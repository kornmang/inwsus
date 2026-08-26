import { useState, type ReactElement } from 'react';
import type { IncidentClassification, LogLine, LogSource, UiLocale, WorkspaceSummary } from '@inwsus/ipc-contracts';
import { createTranslator } from '../../i18n/index.js';
import { Alert, Button } from '../../components/ui/index.js';
import { Activity, Loader, ExternalLink } from '../../components/icons/index.js';
import { LogStreamPanel, type LogScopeSelection } from './LogStreamPanel.js';

interface LiveLogsPageProps {
  readonly locale: UiLocale;
  readonly lines: readonly LogLine[];
  readonly tunnelLogPath: string | null;
  readonly tunnelLogExists: boolean;
  readonly onClear: (source: LogSource, scope: LogScopeSelection) => Promise<void>;
  readonly onClearAll: () => Promise<void>;
  readonly onExport: (source: LogSource, scope: LogScopeSelection, query: string) => Promise<void>;
  readonly onPopOut: () => Promise<void>;
  readonly onCaptureIncident: () => Promise<void>;
  readonly incidentBusy: boolean;
  readonly incidentClassification: IncidentClassification | null;
  readonly incidentCapturedAt: string | null;
  readonly incidentNotice: string | null;
  readonly workspaces: readonly WorkspaceSummary[];
}

type LogTab = LogSource;

export function LiveLogsPage(props: LiveLogsPageProps): ReactElement {
  const t = createTranslator(props.locale);
  const [tab, setTab] = useState<LogTab>('tunnel');
  const sources: readonly LogTab[] = ['tunnel', 'mcp', 'process'];

  return (
    <div className="page-content live-logs-page">
      <div className="page-heading">
        <div>
          <h1>{t('live.title')}</h1>
          <p className="page-subtitle">{t('live.subtitle')}</p>
        </div>
        <div className="heading-actions">
          <Button type="button" variant="danger" size="sm" className="clear-all-logs-button" onClick={() => { void props.onClearAll(); }}>{props.locale === 'th' ? 'ล้าง Log ทั้งหมด' : 'Clear All Logs'}</Button>
          <Button type="button" variant="secondary" size="sm" disabled={props.incidentBusy} onClick={() => { void props.onCaptureIncident(); }}>{t('live.captureIncident')}</Button>
          <Button type="button" variant="secondary" size="sm" icon={<ExternalLink size={14} />} onClick={() => { void props.onPopOut(); }}>{t('live.popOut')}</Button>
        </div>
      </div>
      {!props.incidentBusy && props.incidentNotice === null && props.incidentClassification === null ? null : (
        <Alert
          tone={props.incidentBusy ? 'info' : 'warning'}
          role="status"
          icon={props.incidentBusy ? <Loader size={16} /> : <Activity size={16} />}
        >
          {props.incidentBusy ? t('live.incident.capturing') : props.incidentNotice ?? `${incidentSummary(t, props.incidentClassification!)} · ${props.incidentCapturedAt ?? ''}`}
        </Alert>
      )}
      <div className="log-tabs" role="tablist" aria-label={t('live.title')}>
        {sources.map((source) => (
          <button
            key={source}
            type="button"
            role="tab"
            aria-selected={tab === source}
            className={tab === source ? 'log-tab active' : 'log-tab'}
            onClick={() => setTab(source)}
          >
            {source === 'tunnel' ? t('live.tabTunnel') : source === 'mcp' ? t('live.tabMcp') : t('live.tabProcess')}
          </button>
        ))}
      </div>
      {sources.map((source) => (
        tab === source ? (
          <LogStreamPanel
            key={source}
            title={source === 'tunnel' ? t('live.tabTunnel') : source === 'mcp' ? t('live.tabMcp') : t('live.tabProcess')}
            source={source}
            lines={props.lines.filter((line) => line.source === source)}
            tunnelLogPath={props.tunnelLogPath}
            tunnelLogExists={props.tunnelLogExists}
            pauseLabel={t('live.pause')}
            followLabel={t('live.follow')}
            filterPlaceholder={t('live.filter')}
            clearLabel={t('live.clearTab')}
            clearSessionLabel={t('scope.clearSession')}
            clearWorkspaceLabel={t('scope.clearWorkspace')}
            exportLabel={t('live.export')}
            waitingLabel={source === 'tunnel' ? t('live.waitingTunnel') : t('live.waiting')}
            copyLabel={t('mcp.copy')}
            copiedLabel={t('mcp.copied')}
            workspaces={props.workspaces}
            workspaceLabel={t('scope.workspace')}
            sessionLabel={t('scope.session')}
            scopeAllLabel={t('scope.all')}
            onClear={(scope) => props.onClear(source, scope)}
            onExport={(scope, query) => props.onExport(source, scope, query)}
          />
        ) : null
      ))}
    </div>
  );
}

function incidentSummary(t: ReturnType<typeof createTranslator>, classification: IncidentClassification): string {
  if (classification === 'local_tool_failed') return t('live.incident.localToolFailed');
  if (classification === 'tunnel_disconnected') return t('live.incident.tunnelDisconnected');
  if (classification === 'remote_turn_stopped') return t('live.incident.remoteTurnStopped');
  return t('live.incident.healthyOrInconclusive');
}
