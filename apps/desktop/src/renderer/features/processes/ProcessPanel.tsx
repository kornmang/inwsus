import type { ReactElement } from 'react';
import type { ProcessSummary } from '@inwsus/ipc-contracts';
import { Badge, Button, Card, EmptyState } from '../../components/ui/index.js';
import { Terminal } from '../../components/icons/index.js';

interface ProcessPanelProps {
  readonly workspaceId: string | null;
  readonly processes: readonly ProcessSummary[];
  readonly selectedProcess: ProcessSummary | null;
  readonly onStartFixtureProcess: () => Promise<void>;
  readonly onStopProcess: (processId: string) => Promise<void>;
}

export function ProcessPanel({ workspaceId, processes, selectedProcess, onStartFixtureProcess, onStopProcess }: ProcessPanelProps): ReactElement {
  const canStart = workspaceId !== null && selectedProcess === null;
  const canStop = selectedProcess !== null
    && (selectedProcess.state === 'running' || selectedProcess.state === 'starting' || selectedProcess.state === 'termination_unverified');

  return (
    <Card
      className="process-card"
      title="Managed processes"
      description="Processes run with a direct executable and argument list inside the selected workspace."
      actions={<Badge tone="neutral">{processes.length}</Badge>}
    >
      <div className="card-stack">
        <div>
          <Button size="sm" variant="secondary" disabled={!canStart} onClick={() => { void onStartFixtureProcess(); }}>
            Start fixture process
          </Button>
        </div>
        {selectedProcess === null ? (
          <EmptyState
            icon={<Terminal size={28} />}
            title="No managed process"
            description="Start a fixture process to see its status and logs here."
          />
        ) : (
          <div className="process-details">
            <div className="agent-status-row">
              <span className="stat-tile__label">Status</span>
              <Badge tone={canStop ? 'info' : 'neutral'} data-testid="process-status">{selectedProcess.state}</Badge>
            </div>
            <div>
              <p className="stat-tile__label">Log summary</p>
              <pre className="process-log" data-testid="process-log">{selectedProcess.logSummary}</pre>
            </div>
            {canStop ? (
              <div>
                <Button size="sm" variant="danger" onClick={() => { void onStopProcess(selectedProcess.id); }}>
                  Stop process
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </Card>
  );
}
