import type { ReactElement } from 'react';
import type { DashboardSnapshot, PermissionProfileName, ProcessSummary, WorkspaceSummary } from '@inwsus/ipc-contracts';
import { PermissionPanel } from '../permissions/PermissionPanel.js';
import { ProcessPanel } from '../processes/ProcessPanel.js';
import { McpPanel } from '../mcp/McpPanel.js';
import { WorkspacePanel } from '../workspaces/WorkspacePanel.js';
import { CapabilityPanel } from '../capabilities/CapabilityPanel.js';
import { Badge, Card, SectionHeading } from '../../components/ui/index.js';
import { GitBranch, Terminal } from '../../components/icons/index.js';

interface DashboardPageProps {
  readonly dashboard: DashboardSnapshot;
  readonly workspaces: readonly WorkspaceSummary[];
  readonly processes: readonly ProcessSummary[];
  readonly selectedProcess: ProcessSummary | null;
  readonly onAddWorkspace: (rootPath: string) => Promise<void>;
  readonly onPermissionProfileChange: (profile: PermissionProfileName) => Promise<void>;
  readonly onStartFixtureProcess: () => Promise<void>;
  readonly onStopProcess: (processId: string) => Promise<void>;
  readonly onStartMcp: () => Promise<void>;
  readonly onStopMcp: () => Promise<void>;
  readonly onLaunchManagedBrowser: () => Promise<void>;
  readonly browserBusy: boolean;
  readonly mcpBusy: boolean;
}

export function DashboardPage(props: DashboardPageProps): ReactElement {
  const { dashboard } = props;
  return (
    <div className="page-content">
      <SectionHeading
        eyebrow="Overview"
        title="Gateway dashboard"
        actions={<Badge tone="neutral">Local only</Badge>}
      />
      <div className="section-stack">
        <WorkspacePanel
          selectedWorkspace={dashboard.selectedWorkspace}
          workspaces={props.workspaces}
          onAddWorkspace={props.onAddWorkspace}
        />
        <McpPanel
          status={dashboard.mcp}
          selectedWorkspace={dashboard.selectedWorkspace}
          onStart={props.onStartMcp}
          onStop={props.onStopMcp}
          busy={props.mcpBusy}
        />
        <CapabilityPanel
          capabilities={dashboard.capabilities}
          onLaunchManagedBrowser={props.onLaunchManagedBrowser}
          browserBusy={props.browserBusy}
        />
        <section className="card-grid" aria-label="Gateway status">
          <Card compact eyebrow="Git" title={dashboard.gitSummary.message.length > 0 ? dashboard.gitSummary.message : '—'}>
            <div className="card-stack">
              <p className="agent-status-row__meta">
                <GitBranch size={14} className="icon" />
                {' '}
                {dashboard.gitSummary.branch === null ? 'Branch unavailable' : dashboard.gitSummary.branch}
              </p>
              <p className="agent-status-row__meta">
                {dashboard.gitSummary.changedFiles} changed · {dashboard.gitSummary.stagedFiles} staged
              </p>
            </div>
          </Card>
          <Card compact eyebrow="Codex CLI" title={dashboard.codex.installed ? 'Available' : 'Not detected'}>
            <div className="card-stack">
              <p className="agent-status-row__meta">
                <Terminal size={14} className="icon" />
                {' '}
                {dashboard.codex.version ?? 'No version reported'}
              </p>
            </div>
          </Card>
        </section>
        <Card
          className="audit-card"
          title="Recent audit events"
          actions={<Badge tone="neutral">{dashboard.auditEventCount}</Badge>}
        >
          {dashboard.recentAuditEvents.length === 0 ? (
            <p className="agent-status-row__meta">No recent events.</p>
          ) : (
            <ul className="audit-list">
              {dashboard.recentAuditEvents.map((event) => (
                <li key={event.id}><span>{event.action}</span><span>{event.resultCode}</span></li>
              ))}
            </ul>
          )}
        </Card>
        <PermissionPanel profile={dashboard.permissionProfile} onChange={props.onPermissionProfileChange} />
        <ProcessPanel
          workspaceId={dashboard.selectedWorkspace?.id ?? null}
          processes={props.processes}
          selectedProcess={props.selectedProcess}
          onStartFixtureProcess={props.onStartFixtureProcess}
          onStopProcess={props.onStopProcess}
        />
      </div>
    </div>
  );
}
