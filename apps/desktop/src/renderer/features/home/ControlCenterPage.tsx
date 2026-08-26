import { useState, type ReactElement } from 'react';
import type { DashboardSnapshot, IncidentClassification, UiLocale, WorkspaceSummary } from '@inwsus/ipc-contracts';
import { createTranslator } from '../../i18n/index.js';
import { Alert, Badge, Button, Card, SectionHeading, StatusDot } from '../../components/ui/index.js';
import type { BadgeTone } from '../../components/ui/index.js';
import { AlertTriangle, Refresh } from '../../components/icons/index.js';

interface ControlCenterPageProps {
  readonly dashboard: DashboardSnapshot;
  readonly workspaces: readonly WorkspaceSummary[];
  readonly locale: UiLocale;
  readonly mcpBusy: boolean;
  readonly tunnelBusy: boolean;
  readonly onRefresh: () => Promise<void>;
  readonly onStopMcp: () => Promise<void>;
  readonly onRestartMcp: () => Promise<void>;
  readonly onSelectWorkspace: (workspaceId: string) => Promise<void>;
  readonly onAddWorkspace: (rootPath: string) => Promise<void>;
  readonly onStartTunnel: () => Promise<void>;
  readonly onStopTunnel: () => Promise<void>;
  readonly onCaptureIncident: () => Promise<void>;
  readonly incidentBusy: boolean;
  readonly incidentClassification: IncidentClassification | null;
  readonly incidentCapturedAt: string | null;
  readonly incidentNotice: string | null;
}

export function ControlCenterPage(props: ControlCenterPageProps): ReactElement {
  const t = createTranslator(props.locale);
  const { dashboard } = props;
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [projectPath, setProjectPath] = useState('');
  const [selectedId, setSelectedId] = useState(dashboard.selectedWorkspace?.id ?? '');

  const agentLabel = dashboard.agentState === 'busy'
    ? t('agent.busy')
    : dashboard.agentState === 'idle'
      ? t('agent.ready')
      : t('agent.stopped');
  // stopped/offline -> muted grey (neutral), idle/ready -> green (success),
  // busy/working -> blue (info) with a pulsing dot (see StatusDot `pulse`).
  const agentTone = dashboard.agentState === 'busy' ? 'info' : dashboard.agentState === 'idle' ? 'success' : 'neutral';
  const agentBusy = dashboard.agentState === 'busy';

  const tunnelLabel = dashboard.tunnel.state === 'running'
    ? dashboard.tunnel.source === 'external'
      ? t('tunnel.runningExternal')
      : t('tunnel.running')
    : dashboard.tunnel.state === 'starting'
      ? t('tunnel.starting')
      : dashboard.tunnel.state === 'error'
        ? t('tunnel.error')
        : t('tunnel.stopped');

  const stdioBroad = dashboard.stdioPermissionProfile === 'full' && !dashboard.stdioStrictRoots;
  const broadAccess = dashboard.unrestricted || dashboard.allowAiDelete || stdioBroad;
  const onOff = (enabled: boolean): string => enabled ? t('security.enabled') : t('security.disabled');
  const workspaceScope = dashboard.stdioStrictRoots
    ? `${dashboard.stdioAllowedRoots.length} ${t('security.allowedRoots')}`
    : t('security.machineRoots');

  async function copyText(value: string): Promise<void> {
    await navigator.clipboard.writeText(value);
    setCopyStatus(t('mcp.copied'));
  }

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <h1>{t('home.title')}</h1>
          <p className="page-subtitle">{t('home.subtitle')}</p>
        </div>
        <div className="heading-actions">
          <Button size="sm" variant="secondary" icon={<Refresh size={14} />} onClick={() => { void props.onRefresh(); }}>
            {t('action.refresh')}
          </Button>
          <Button type="button" variant="secondary" size="sm" disabled={props.incidentBusy} onClick={() => { void props.onCaptureIncident(); }}>{t('live.captureIncident')}</Button>
          <Button size="sm" variant="secondary" disabled={props.mcpBusy || !dashboard.mcp.running} onClick={() => { void props.onStopMcp(); }}>
            {t('action.stop')}
          </Button>
          <Button size="sm" variant="secondary" disabled={props.mcpBusy || dashboard.selectedWorkspace === null} onClick={() => { void props.onRestartMcp(); }}>
            {t('action.restart')}
          </Button>
        </div>
      </div>
      {!props.incidentBusy && props.incidentNotice === null && props.incidentClassification === null ? null : (
        <Alert tone={props.incidentBusy ? 'info' : 'warning'} role="status">
          {props.incidentBusy ? t('live.incident.capturing') : props.incidentNotice ?? `${incidentLabel(t, props.incidentClassification!)} · ${props.incidentCapturedAt ?? ''}`}
        </Alert>
      )}

      <div className="section-stack">
        <Card aria-label={agentLabel}>
          <div className="agent-status-row">
            <StatusDot tone={agentTone} pulse={agentBusy} data-testid="agent-state" />
            <div className="agent-status-row__text">
              <strong data-testid="mcp-status">{agentLabel}</strong>
              <span className="agent-status-row__meta">
                {t('agent.mode')}
                {dashboard.unrestricted ? ` • ${t('badge.unrestricted')}` : ''}
              </span>
            </div>
          </div>
        </Card>

        <Card aria-label={t('security.title')}>
          <SectionHeading
            title={t('security.title')}
            description={t('security.strictHint')}
            actions={
              <Badge tone={broadAccess ? 'warning' : 'success'} data-testid="security-summary">
                {broadAccess ? t('security.summaryBroad') : t('security.summaryRestricted')}
              </Badge>
            }
          />
          <div className="security-metric-grid">
            <SecurityMetric label={t('security.desktopProfile')} value={dashboard.permissionProfile.toUpperCase()} />
            <SecurityMetric label={t('security.stdioProfile')} value={dashboard.stdioPermissionProfile.toUpperCase()} />
            <SecurityMetric label={t('security.strictRoots')} value={onOff(dashboard.stdioStrictRoots)} state={dashboard.stdioStrictRoots ? 'safe' : 'warn'} />
            <SecurityMetric label={t('security.aiDelete')} value={onOff(dashboard.allowAiDelete)} state={dashboard.allowAiDelete ? 'warn' : 'safe'} />
            <SecurityMetric label={t('security.unrestricted')} value={onOff(dashboard.unrestricted)} state={dashboard.unrestricted ? 'warn' : 'safe'} />
            <SecurityMetric label={t('security.workspaceScope')} value={workspaceScope} state={dashboard.stdioStrictRoots ? 'safe' : 'warn'} />
            <SecurityMetric label={t('security.tunnelAccess')} value={tunnelLabel} state={dashboard.tunnel.state === 'running' ? 'active' : 'neutral'} />
            <SecurityMetric label={t('security.registeredWorkspaces')} value={String(props.workspaces.length)} />
          </div>
          {stdioBroad ? (
            <Alert tone="warning" icon={<AlertTriangle size={16} />} role="status">
              {t('security.warningBroad')}
            </Alert>
          ) : null}
        </Card>

        <div className="home-two-col">
          <Card title={t('mcp.localUrl')}>
            <div className="card-stack">
              <code data-testid="mcp-endpoint" className="endpoint-code">
                {dashboard.connectionModes.httpUrl ?? '—'}
              </code>
              <div className="field-row">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={dashboard.connectionModes.httpUrl === null}
                  onClick={() => {
                    if (dashboard.connectionModes.httpUrl !== null) void copyText(dashboard.connectionModes.httpUrl);
                  }}
                >
                  {t('mcp.copy')}
                </Button>
                {copyStatus === null ? null : <span data-testid="mcp-copy-status" role="status">{copyStatus}</span>}
              </div>
              <p className="agent-status-row__meta">{t('mcp.stdioCommand')}</p>
              <code className="endpoint-code">{dashboard.connectionModes.stdioCommand}</code>
            </div>
          </Card>

          <Card title={t('tunnel.title')}>
            <div className="card-stack">
              <p data-testid="tunnel-status">{tunnelLabel}</p>
              {dashboard.tunnel.message ? <Alert tone="danger">{dashboard.tunnel.message}</Alert> : null}
              {!dashboard.tunnel.hasApiKey ? <p className="agent-status-row__meta">{t('tunnel.needKey')}</p> : null}
              {!dashboard.tunnel.profileExists ? <p className="agent-status-row__meta">{t('tunnel.needProfile')}</p> : null}
              <div className="field-row">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={props.tunnelBusy || !dashboard.tunnel.hasApiKey || dashboard.tunnel.state === 'running'}
                  onClick={() => { void props.onStartTunnel(); }}
                >
                  {t('tunnel.start')}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={props.tunnelBusy || dashboard.tunnel.state === 'stopped'}
                  onClick={() => { void props.onStopTunnel(); }}
                >
                  {t('tunnel.stop')}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="home-two-col">
          <Card title={t('project.active')}>
            <div className="card-stack">
              <div className="field-row">
                <select
                  aria-label={t('project.active')}
                  value={selectedId}
                  onChange={(event) => setSelectedId(event.target.value)}
                >
                  {props.workspaces.map((workspace) => (
                    <option key={workspace.id} value={workspace.id}>
                      {workspace.displayName}
                    </option>
                  ))}
                </select>
                <Button
                  size="sm"
                  disabled={selectedId.length === 0}
                  onClick={() => { void props.onSelectWorkspace(selectedId); }}
                >
                  {t('project.setMain')}
                </Button>
              </div>
              <label className="stat-tile__label" htmlFor="add-project-path">{t('project.add')}</label>
              <p className="agent-status-row__meta">{t('project.addHint')}</p>
              <div className="field-row">
                <input
                  id="add-project-path"
                  value={projectPath}
                  onChange={(event) => setProjectPath(event.target.value)}
                  placeholder="D:\projects\app"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    void props.onAddWorkspace(projectPath).then(() => setProjectPath(''));
                  }}
                >
                  {t('project.add')}
                </Button>
              </div>
            </div>
          </Card>

          <section className="card-grid" aria-label="Status cards">
            <div className="stat-tile">
              <span className="stat-tile__label">{t('info.workspace')}</span>
              <strong className="stat-tile__value" data-testid="workspace-real-root">{dashboard.selectedWorkspace?.realRootPath ?? '—'}</strong>
            </div>
            <div className="stat-tile">
              <span className="stat-tile__label">{t('info.activeProject')}</span>
              <strong className="stat-tile__value">{dashboard.selectedWorkspace?.displayName ?? '—'}</strong>
              <span data-testid="workspace-id" hidden>{dashboard.selectedWorkspace?.id ?? ''}</span>
            </div>
            <div className="stat-tile">
              <span className="stat-tile__label">{t('info.mode')}</span>
              <strong className="stat-tile__value">{dashboard.mode}</strong>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

const SECURITY_METRIC_TONE: Record<'safe' | 'warn' | 'active' | 'neutral', BadgeTone> = {
  safe: 'success',
  warn: 'warning',
  active: 'accent',
  neutral: 'neutral',
};

function SecurityMetric(props: { readonly label: string; readonly value: string; readonly state?: 'safe' | 'warn' | 'active' | 'neutral' }): ReactElement {
  const state = props.state ?? 'neutral';
  const valueClassName = state === 'neutral' ? 'stat-tile__value' : `stat-tile__value stat-tile__value--${state}`;
  return (
    <article className="stat-tile">
      <span className="stat-tile__label-row">
        <StatusDot tone={SECURITY_METRIC_TONE[state]} />
        <span className="stat-tile__label">{props.label}</span>
      </span>
      <strong className={valueClassName}>{props.value}</strong>
    </article>
  );
}

function incidentLabel(t: ReturnType<typeof createTranslator>, classification: IncidentClassification): string {
  if (classification === 'local_tool_failed') return t('live.incident.localToolFailed');
  if (classification === 'tunnel_disconnected') return t('live.incident.tunnelDisconnected');
  if (classification === 'remote_turn_stopped') return t('live.incident.remoteTurnStopped');
  return t('live.incident.healthyOrInconclusive');
}
