import type { ReactElement } from 'react';
import type { DashboardSnapshot } from '@inwsus/ipc-contracts';
import { Badge, Button, Card } from '../../components/ui/index.js';
import { Globe } from '../../components/icons/index.js';

interface CapabilityPanelProps {
  readonly capabilities: DashboardSnapshot['capabilities'];
  readonly onLaunchManagedBrowser: () => Promise<void>;
  readonly browserBusy: boolean;
}

export function CapabilityPanel({ capabilities, onLaunchManagedBrowser, browserBusy }: CapabilityPanelProps): ReactElement {
  const readyCount = capabilities.filter((capability) => capability.available && capability.ready).length;
  const availableCount = capabilities.filter((capability) => capability.available).length;
  return (
    <Card
      className="capability-card"
      aria-label="Local computer capabilities"
      eyebrow="Local computer access"
      title="7 MCP tools"
      actions={<Badge tone="neutral">{readyCount}/7 ready · {availableCount}/7 available</Badge>}
    >
      {capabilities.length === 0 ? (
        <p className="agent-status-row__meta">No capability data reported yet.</p>
      ) : (
        <div className="capability-grid">
          {capabilities.map((capability) => {
            const ready = capability.available && capability.ready;
            const available = capability.available;
            const tone = ready ? 'success' : available ? 'info' : 'neutral';
            return (
              <article className="capability-row" key={capability.name}>
                <div className="capability-row__text">
                  <strong>{capability.name}</strong>
                  <p>{capability.title}</p>
                  <small>{capability.description}</small>
                </div>
                <div className="capability-row__actions">
                  <Badge tone={tone}>{ready ? 'READY' : available ? 'AVAILABLE' : 'UNAVAILABLE'}</Badge>
                  {capability.name === 'dom_cdp' && available && !ready ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={<Globe size={14} />}
                      loading={browserBusy}
                      disabled={browserBusy}
                      onClick={() => { void onLaunchManagedBrowser(); }}
                    >
                      {browserBusy ? 'Launching…' : 'Launch managed Chrome'}
                    </Button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </Card>
  );
}
