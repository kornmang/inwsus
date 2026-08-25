import { mkdir, mkdtemp, realpath, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { preferredTunnelMcpCommand } from '../src/main/tunnel-profile.js';

const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

async function createInstall(): Promise<{ root: string; exe: string }> {
  const root = await mkdtemp(path.join(os.tmpdir(), 'inwsus-packaged-tunnel-'));
  temporaryRoots.push(root);
  const exe = path.join(root, 'inwsus.exe');
  await writeFile(exe, 'stub', 'utf8');
  return { root, exe };
}

describe('packaged tunnel stdio launcher boundary', () => {
  it('never falls back from an installed inwsus.exe to a developer-repository launcher', () => {
    const installedExe = 'C:\\Users\\end-user\\AppData\\Local\\Programs\\inwsus\\inwsus.exe';
    const developerLauncher = 'D:\\inwsus\\inwsus-mcp-stdio.cmd';

    expect(preferredTunnelMcpCommand(installedExe, developerLauncher)).toBeNull();
  });

  it('accepts the real launcher installed beside inwsus.exe', async () => {
    const { root, exe } = await createInstall();
    const launcher = path.join(root, 'inwsus-mcp-stdio.cmd');
    await writeFile(launcher, '@echo off\n', 'utf8');

    expect(preferredTunnelMcpCommand(exe, launcher)).toBe(await realpath(launcher));
  });

  it('accepts the real launcher installed under the packaged resources directory', async () => {
    const { root, exe } = await createInstall();
    const resources = path.join(root, 'resources');
    await mkdir(resources);
    const launcher = path.join(resources, 'inwsus-mcp-stdio.cmd');
    await writeFile(launcher, '@echo off\n', 'utf8');

    expect(preferredTunnelMcpCommand(exe, launcher)).toBe(await realpath(launcher));
  });

  it('rejects a packaged-looking launcher that escapes through a resources junction', async () => {
    const { root, exe } = await createInstall();
    const outside = await mkdtemp(path.join(os.tmpdir(), 'inwsus-packaged-tunnel-outside-'));
    temporaryRoots.push(outside);
    const outsideLauncher = path.join(outside, 'inwsus-mcp-stdio.cmd');
    await writeFile(outsideLauncher, '@echo off\n', 'utf8');
    const resources = path.join(root, 'resources');
    await symlink(outside, resources, 'junction');

    expect(preferredTunnelMcpCommand(exe, path.join(resources, 'inwsus-mcp-stdio.cmd'))).toBeNull();
  });
});
