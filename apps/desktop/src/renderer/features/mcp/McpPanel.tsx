import { useEffect, useState, type ReactElement } from 'react';
import type { DashboardSnapshot, WorkspaceSummary } from '@inwsus/ipc-contracts';
import { Badge, Button, Card, StatusDot } from '../../components/ui/index.js';
import { Copy } from '../../components/icons/index.js';

interface McpPanelProps {
  readonly status: DashboardSnapshot['mcp'];
  readonly selectedWorkspace: WorkspaceSummary | null;
  readonly onStart: () => Promise<void>;
  readonly onStop: () => Promise<void>;
  readonly busy: boolean;
}

export function McpPanel({ status, selectedWorkspace, onStart, onStop, busy }: McpPanelProps): ReactElement {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  useEffect(() => {
    setCopyStatus(null);
  }, [status.url]);

  async function copyEndpoint(): Promise<void> {
    if (status.url === null) return;
    try {
      await copyText(status.url);
      setCopyStatus('Copied');
    } catch {
      setCopyStatus('Copy failed; select the endpoint manually');
    }
  }

  return (
    <Card
      className="mcp-card"
      aria-label="MCP connection"
      title="MCP connection"
      actions={<Badge tone="neutral">{selectedWorkspace?.displayName ?? 'No workspace selected'}</Badge>}
    >
      <div className="card-stack">
        <div className="agent-status-row agent-status-row--split">
          <div className="agent-status-row__group">
            <StatusDot tone={status.running ? 'success' : 'neutral'} />
            <div className="agent-status-row__text">
              <span className="agent-status-row__meta">Local status</span>
              <strong data-testid="mcp-status">{status.running ? 'Running' : 'Stopped'}</strong>
            </div>
          </div>
          <div className="project-row__actions">
            <Button
              size="sm"
              variant="secondary"
              disabled={busy || status.running || selectedWorkspace === null}
              onClick={() => { void onStart(); }}
            >
              Start Connection
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={busy || !status.running}
              onClick={() => { void onStop(); }}
            >
              Stop Connection
            </Button>
          </div>
        </div>
        <div>
          <p className="stat-tile__label">MCP endpoint</p>
          <code className="endpoint-code" data-testid="mcp-endpoint">{status.url ?? 'No local endpoint active'}</code>
        </div>
        <div className="field-row">
          <Button
            size="sm"
            variant="ghost"
            icon={<Copy size={14} />}
            disabled={status.url === null}
            onClick={() => { void copyEndpoint(); }}
          >
            Copy MCP endpoint
          </Button>
          {copyStatus === null ? null : <span data-testid="mcp-copy-status" role="status">{copyStatus}</span>}
        </div>
      </div>
    </Card>
  );
}

async function copyText(value: string): Promise<void> {
  if (navigator.clipboard !== undefined) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const input = document.createElement('textarea');
  input.value = value;
  input.setAttribute('readonly', 'true');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand('copy');
  input.remove();
  if (!copied) throw new Error('Clipboard is unavailable');
}
