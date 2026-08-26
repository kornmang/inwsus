import { useState, type FormEvent, type ReactElement } from 'react';
import type { WorkspaceSummary } from '@inwsus/ipc-contracts';
import { Button, Card, EmptyState, Field } from '../../components/ui/index.js';
import { Folder } from '../../components/icons/index.js';

interface WorkspacePanelProps {
  readonly selectedWorkspace: WorkspaceSummary | null;
  readonly workspaces: readonly WorkspaceSummary[];
  readonly onAddWorkspace: (rootPath: string) => Promise<void>;
}

export function WorkspacePanel({ selectedWorkspace, workspaces, onAddWorkspace }: WorkspacePanelProps): ReactElement {
  const [rootPath, setRootPath] = useState('');
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (rootPath.trim().length === 0) return;
    setPending(true);
    try {
      await onAddWorkspace(rootPath);
      setRootPath('');
    } finally {
      setPending(false);
    }
  }

  return (
    <Card
      className="workspace-card"
      title="Workspace"
      actions={<span className="agent-status-row__meta">{workspaces.length} registered</span>}
    >
      <form onSubmit={(event) => { void submit(event); }} className="card-stack">
        <Field label="Workspace root" htmlFor="workspace-root">
          {({ controlId }) => (
            <div className="field-row">
              <input
                id={controlId}
                aria-label="Workspace root"
                value={rootPath}
                onChange={(event) => setRootPath(event.currentTarget.value)}
                placeholder="C:\Projects\my-app"
              />
              <Button type="submit" size="sm" loading={pending}>
                {pending ? 'Adding…' : 'Add workspace'}
              </Button>
            </div>
          )}
        </Field>
        {selectedWorkspace === null ? (
          <EmptyState
            icon={<Folder size={28} />}
            title="No workspace selected"
            description="Add a workspace root above or pick one from the Projects page."
          />
        ) : (
          <dl className="kv-list">
            <div><dt>Name</dt><dd>{selectedWorkspace.displayName}</dd></div>
            <div><dt>Workspace ID</dt><dd data-testid="workspace-id">{selectedWorkspace.id}</dd></div>
            <div><dt>Configured path</dt><dd>{selectedWorkspace.rootPath}</dd></div>
            <div><dt>Canonical path</dt><dd data-testid="workspace-real-root">{selectedWorkspace.realRootPath}</dd></div>
          </dl>
        )}
      </form>
    </Card>
  );
}
