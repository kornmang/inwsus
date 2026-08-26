import { useMemo, useState, type ReactElement } from 'react';
import type { UiLocale, WorkspaceSummary } from '@inwsus/ipc-contracts';
import { createTranslator } from '../../i18n/index.js';
import { Badge, Button, Card, EmptyState, Field } from '../../components/ui/index.js';
import { Folder } from '../../components/icons/index.js';

interface ProjectsPageProps {
  readonly locale: UiLocale;
  readonly workspaces: readonly WorkspaceSummary[];
  readonly selectedWorkspaceId: string | null;
  readonly onSelectWorkspace: (workspaceId: string) => Promise<void>;
  readonly onAddWorkspace: (rootPath: string) => Promise<void>;
  readonly onSetWorkspaceArchived: (workspaceId: string, archived: boolean) => Promise<void>;
  readonly onDeleteWorkspace: (workspaceId: string) => Promise<void>;
}

export function ProjectsPage(props: ProjectsPageProps): ReactElement {
  const t = createTranslator(props.locale);
  const [rootPath, setRootPath] = useState('');
  const [busyWorkspaceId, setBusyWorkspaceId] = useState<string | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const groups = useMemo(() => groupWorkspaces(props.workspaces), [props.workspaces]);

  async function runWorkspaceAction(workspaceId: string, action: () => Promise<void>): Promise<void> {
    setBusyWorkspaceId(workspaceId);
    try {
      await action();
      setConfirmingDeleteId((current) => current === workspaceId ? null : current);
    } finally {
      setBusyWorkspaceId(null);
    }
  }

  function renderProjectRow(workspace: WorkspaceSummary, archived: boolean): ReactElement {
    const selected = workspace.id === props.selectedWorkspaceId;
    const busy = workspace.id === busyWorkspaceId;
    const confirmingDelete = workspace.id === confirmingDeleteId;
    return (
      <li key={workspace.id} className={`project-row ${selected ? 'project-row--active' : ''}`}>
        <div className="project-row__main">
          <div className="project-row__title">
            <strong>{workspace.displayName}</strong>
            {selected ? <Badge tone="accent">{t('project.active')}</Badge> : null}
            {archived ? <Badge tone="neutral">{t('project.archivedBadge')}</Badge> : null}
          </div>
          <p className="project-row__path">{workspace.realRootPath}</p>
          {confirmingDelete ? <p className="project-row__path">{t('project.deleteHint')}</p> : null}
        </div>
        <div className="project-row__actions">
          {archived ? (
            <Button size="sm" variant="secondary" disabled={busy} onClick={() => { void runWorkspaceAction(workspace.id, () => props.onSetWorkspaceArchived(workspace.id, false)); }}>
              {t('project.restore')}
            </Button>
          ) : (
            <>
              <Button size="sm" variant={selected ? 'secondary' : 'primary'} disabled={busy || selected} onClick={() => { void runWorkspaceAction(workspace.id, () => props.onSelectWorkspace(workspace.id)); }}>
                {selected ? t('project.active') : t('project.setMain')}
              </Button>
              <Button size="sm" variant="secondary" disabled={busy} onClick={() => { void runWorkspaceAction(workspace.id, () => props.onSetWorkspaceArchived(workspace.id, true)); }}>
                {t('project.archive')}
              </Button>
            </>
          )}
          {confirmingDelete ? (
            <>
              <Button size="sm" variant="danger" disabled={busy} onClick={() => { void runWorkspaceAction(workspace.id, () => props.onDeleteWorkspace(workspace.id)); }}>
                {t('project.confirmDelete')}
              </Button>
              <Button size="sm" variant="ghost" disabled={busy} onClick={() => setConfirmingDeleteId(null)}>
                {t('project.cancel')}
              </Button>
            </>
          ) : (
            <Button size="sm" variant="danger" disabled={busy} onClick={() => setConfirmingDeleteId(workspace.id)}>
              {t('project.delete')}
            </Button>
          )}
        </div>
      </li>
    );
  }

  return (
    <div className="page-content viewport-list-page projects-page">
      <h1>{t('nav.projects')}</h1>
      <Card>
        <Field label={t('project.add')} htmlFor="workspace-root" hint={t('project.addHint')}>
          {({ controlId }) => (
            <div className="field-row">
              <input
                id={controlId}
                aria-label="Workspace root"
                value={rootPath}
                onChange={(event) => setRootPath(event.target.value)}
              />
              <Button size="sm" disabled={rootPath.trim().length === 0} onClick={() => { void props.onAddWorkspace(rootPath).then(() => setRootPath('')); }}>
                {t('project.add')}
              </Button>
            </div>
          )}
        </Field>
      </Card>
      <section className="panel project-list-panel">
        <div className="project-list-scroll">
          <ProjectSection title={t('project.activeList')} count={groups.active.length} emptyText={t('project.emptyActive')}>
            {groups.active.map((workspace) => renderProjectRow(workspace, false))}
          </ProjectSection>
          <ProjectSection title={t('project.archivedList')} count={groups.archived.length} emptyText={t('project.emptyArchived')}>
            {groups.archived.map((workspace) => renderProjectRow(workspace, true))}
          </ProjectSection>
          {groups.system.length === 0 ? null : (
            <ProjectSection title={t('project.systemList')} count={groups.system.length} emptyText="">
              {groups.system.map((workspace) => (
                <li key={workspace.id} className="project-row">
                  <div className="project-row__main">
                    <div className="project-row__title">
                      <strong>{workspace.displayName}</strong>
                      <Badge tone="neutral">{t('project.systemBadge')}</Badge>
                    </div>
                    <p className="project-row__path">{workspace.realRootPath}</p>
                    <p className="project-row__path">{t('project.systemHint')}</p>
                  </div>
                </li>
              ))}
            </ProjectSection>
          )}
        </div>
      </section>
    </div>
  );
}

function ProjectSection(props: { readonly title: string; readonly count: number; readonly emptyText: string; readonly children: ReactElement | readonly ReactElement[] }): ReactElement {
  return (
    <section className="project-list-section">
      <div className="project-list-section-heading"><h2>{props.title}</h2><Badge tone="neutral">{props.count}</Badge></div>
      {props.count === 0 ? (
        <EmptyState icon={<Folder size={24} />} title={props.emptyText} />
      ) : (
        <ul className="project-list">{props.children}</ul>
      )}
    </section>
  );
}

function groupWorkspaces(workspaces: readonly WorkspaceSummary[]): {
  readonly active: readonly WorkspaceSummary[];
  readonly archived: readonly WorkspaceSummary[];
  readonly system: readonly WorkspaceSummary[];
} {
  const system = workspaces.filter((workspace) => workspace.kind === 'machine_root');
  const projects = workspaces.filter((workspace) => workspace.kind !== 'machine_root');
  return {
    active: projects.filter((workspace) => workspace.archivedAt === undefined || workspace.archivedAt === null),
    archived: projects.filter((workspace) => workspace.archivedAt !== undefined && workspace.archivedAt !== null),
    system,
  };
}
