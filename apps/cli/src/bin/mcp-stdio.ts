import fs from 'node:fs';
import path from 'node:path';
import { syncMachineRoots } from '@inwsus/application';
import { startMcpStdio } from '@inwsus/mcp-server';
import {
  STDIO_ALLOWED_ROOTS_SETTING_KEY,
  STDIO_PERMISSION_PROFILE_SETTING_KEY,
  STDIO_STRICT_ROOTS_SETTING_KEY,
  UNRESTRICTED_SETTING_KEY,
  isUnrestricted,
  parseAllowedRoots,
  parseBooleanSetting,
  parseStdioPermissionProfile,
  resolveInwsusDataPath,
} from '@inwsus/shared';
import { applyPendingSqliteRestoreSync, SqliteBackupService, SqliteDatabase, SqliteSettingsRepository, SqliteWorkspaceRepository } from '@inwsus/storage';
import { machineRootPath, normalizeWorkspaceRoot, WorkspaceService, type Workspace } from '@inwsus/workspace';
import { createStdioMcpRuntime } from '../runtime/stdio-mcp-runtime.js';
import { StrictWorkspaceRepository, canonicalizeAllowedRoots, requestedPathInsideAllowedRoot } from '../runtime/strict-workspace-repository.js';
import { resetWorkspaceRegistrations } from '../runtime/workspace-reset.js';

function readArg(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index < 0) return undefined;
  const value = process.argv[index + 1];
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function readArgs(flag: string): readonly string[] {
  const values: string[] = [];
  for (let index = 0; index < process.argv.length; index += 1) {
    if (process.argv[index] !== flag) continue;
    const value = process.argv[index + 1];
    if (typeof value === 'string' && value.trim().length > 0) values.push(value.trim());
  }
  return values;
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function resolveDataPath(): string {
  return resolveInwsusDataPath(process.env);
}

async function main(): Promise<void> {
  const dataPath = resolveDataPath();
  fs.mkdirSync(dataPath, { recursive: true });
  const restore = applyPendingSqliteRestoreSync(path.join(dataPath, 'inwsus.sqlite'), path.join(dataPath, 'backups'));
  if (restore.error !== undefined) process.stderr.write(`inwsus MCP stdio: scheduled restore failed: ${restore.error}\n`);
  if (restore.applied) process.stderr.write(`inwsus MCP stdio: restored database from ${restore.backupId ?? 'scheduled backup'}\n`);

  const database = new SqliteDatabase(path.join(dataPath, 'inwsus.sqlite'), { backupDirectory: path.join(dataPath, 'backups') });
  const rawWorkspaceRepository = new SqliteWorkspaceRepository(database);
  const settingsRepository = new SqliteSettingsRepository(database);

  const profileName = parseStdioPermissionProfile(
    readArg('--profile')
      ?? process.env.INWSUS_STDIO_PROFILE
      ?? settingsRepository.get(STDIO_PERMISSION_PROFILE_SETTING_KEY),
    'full',
  );
  const strictRootsEnabled = hasFlag('--strict-roots')
    || (process.env.INWSUS_STRICT_ROOTS !== undefined
      ? parseBooleanSetting(process.env.INWSUS_STRICT_ROOTS, false)
      : parseBooleanSetting(settingsRepository.get(STDIO_STRICT_ROOTS_SETTING_KEY), false));
  const cliAllowedRoots = readArgs('--allowed-root');
  const envAllowedRoots = parseAllowedRoots(process.env.INWSUS_ALLOWED_ROOTS);
  const storedAllowedRoots = parseAllowedRoots(settingsRepository.get(STDIO_ALLOWED_ROOTS_SETTING_KEY));
  const configuredAllowedRoots = cliAllowedRoots.length > 0
    ? cliAllowedRoots
    : envAllowedRoots.length > 0
      ? envAllowedRoots
      : storedAllowedRoots;
  const strictAllowedRoots = strictRootsEnabled ? await canonicalizeAllowedRoots(configuredAllowedRoots) : undefined;

  const rawWorkspaceService = new WorkspaceService(rawWorkspaceRepository);
  const reset = hasFlag('--reset-workspaces')
    || process.env.INWSUS_RESET_WORKSPACES === '1'
    || process.env.INWSUS_RESET_WORKSPACES === 'true';
  if (reset) {
    const backupService = new SqliteBackupService(database, {
      databaseFilename: path.join(dataPath, 'inwsus.sqlite'),
      backupDirectory: path.join(dataPath, 'backups'),
    });
    const result = await resetWorkspaceRegistrations(
      rawWorkspaceService,
      backupService,
      readArg('--confirm-reset-workspaces') ?? process.env.INWSUS_CONFIRM_RESET_WORKSPACES,
    );
    process.stderr.write(
      `inwsus MCP stdio: cleared ${result.deleted} previous workspace registration(s)`
      + `${result.backupId === null ? '' : ` after backup ${result.backupId}`}\n`,
    );
  }

  const workspaceRepository = strictAllowedRoots === undefined
    ? rawWorkspaceRepository
    : new StrictWorkspaceRepository(rawWorkspaceRepository, strictAllowedRoots);
  const workspaceService = new WorkspaceService(workspaceRepository);
  const unrestricted = strictAllowedRoots === undefined
    ? isUnrestricted(process.env, settingsRepository.get(UNRESTRICTED_SETTING_KEY))
    : false;

  const requestedRaw = readArg('--workspace') ?? process.env.INWSUS_WORKSPACE;
  const requestedPath = path.resolve(
    requestedRaw && requestedRaw.trim().length > 0
      ? requestedRaw
      : strictAllowedRoots?.[0] ?? machineRootPath(),
  );
  if (!fs.existsSync(requestedPath)) {
    process.stderr.write(`inwsus MCP stdio: workspace path does not exist: ${requestedPath}\n`);
    process.exit(2);
  }

  let workspace: Workspace;
  if (strictAllowedRoots !== undefined) {
    process.env.INWSUS_CAPABILITY_ROOTS = strictAllowedRoots.join(';');
    for (const root of strictAllowedRoots) {
      const normalized = normalizeWorkspaceRoot(root).toLowerCase();
      const existing = (await workspaceService.list()).find((entry) => normalizeWorkspaceRoot(entry.realRootPath).toLowerCase() === normalized);
      if (existing !== undefined) continue;
      const added = await workspaceService.add(path.basename(root) || root, root);
      if (!added.ok) throw new Error(`Could not register strict allowed root ${root}: ${added.error.message}`);
    }
    const selectedAllowedRoot = await requestedPathInsideAllowedRoot(requestedPath, strictAllowedRoots);
    const selectedNorm = normalizeWorkspaceRoot(selectedAllowedRoot).toLowerCase();
    const selected = (await workspaceService.list()).find((entry) => normalizeWorkspaceRoot(entry.realRootPath).toLowerCase() === selectedNorm);
    if (selected === undefined) throw new Error(`Strict allowed root was not registered: ${selectedAllowedRoot}`);
    workspace = selected;
  } else {
    const restrictedRoot = machineRootPath(requestedPath);
    process.env.INWSUS_CAPABILITY_ROOTS = process.env.INWSUS_CAPABILITY_ROOTS?.trim()
      || restrictedRoot.replace(/\\/g, '/');
    const machineRoot = await syncMachineRoots(workspaceService, unrestricted, requestedPath);
    if (machineRoot === null) throw new Error('Could not register machine root');

    const requestedNorm = normalizeWorkspaceRoot(requestedPath).toLowerCase();
    const workspaces = await workspaceService.list();
    let selected = workspaces.find((entry) => normalizeWorkspaceRoot(entry.realRootPath).toLowerCase() === requestedNorm);
    if (selected === undefined && requestedNorm !== normalizeWorkspaceRoot(restrictedRoot).toLowerCase()) {
      const added = await workspaceService.add(path.basename(requestedPath) || 'Workspace', requestedPath);
      if (!added.ok) throw new Error(`Could not register ${requestedPath}: ${added.error.message}`);
      selected = added.value;
    }
    workspace = selected ?? machineRoot;
  }

  for (const entry of await workspaceService.list()) {
    process.stderr.write(`inwsus workspace id=${entry.id} root=${entry.realRootPath}\n`);
  }
  database.close();

  const runtime = createStdioMcpRuntime(dataPath, workspace, unrestricted, {
    permissionProfile: profileName,
    ...(strictAllowedRoots === undefined ? {} : { strictAllowedRoots }),
  });
  await runtime.activityReady;
  process.stderr.write(
    `inwsus MCP stdio ready primary=${workspace.id} root=${workspace.realRootPath} profile=${profileName}`
      + `${unrestricted ? ' unrestricted=1' : ''}${strictAllowedRoots === undefined ? '' : ` strict_roots=${strictAllowedRoots.length}`}\n`,
  );

  let shuttingDown = false;
  const shutdown = async (): Promise<void> => {
    if (shuttingDown) return;
    shuttingDown = true;
    try { await handle?.close(); } catch { /* transport may already be closed */ }
    try { await runtime.close(); } catch { /* runtime may already be closing */ }
    process.exit(0);
  };

  const handle = startMcpStdio({
    services: runtime.services,
    actor: runtime.actor,
    activityTracker: runtime.activityTracker,
    codexToolsEnabled: runtime.codexToolsEnabled,
    profileProvider: runtime.profileProvider,
    allowAiDeleteProvider: runtime.allowAiDeleteProvider,
    destructivePolicyProvider: runtime.destructivePolicyProvider,
    activeWorkspaceScopeProvider: runtime.activeWorkspaceScopeProvider,
    onError: (error): void => {
      if (/EPIPE|ECONNRESET|broken pipe/i.test(error.message)) {
        process.stderr.write(`inwsus MCP stdio: peer closed (${error.message})\n`);
        void shutdown();
        return;
      }
      process.stderr.write(`inwsus MCP stdio error: ${error.message}\n`);
    },
  });

  process.stdin.on('end', () => { void shutdown(); });
  process.stdin.on('close', () => { void shutdown(); });
  process.stdout.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EPIPE' || error.code === 'ECONNRESET') void shutdown();
  });
  process.on('SIGINT', () => { void shutdown(); });
  process.on('SIGTERM', () => { void shutdown(); });
}

main().catch((error: unknown) => {
  process.stderr.write(`inwsus MCP stdio failed: ${error instanceof Error ? error.message : 'unknown'}\n`);
  process.exit(1);
});
