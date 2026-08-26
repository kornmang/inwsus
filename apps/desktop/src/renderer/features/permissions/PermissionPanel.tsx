import type { ReactElement } from 'react';
import type { PermissionProfileName } from '@inwsus/ipc-contracts';
import { Badge, Card, Field } from '../../components/ui/index.js';

interface PermissionPanelProps {
  readonly profile: PermissionProfileName;
  readonly onChange: (profile: PermissionProfileName) => Promise<void>;
}

export function PermissionPanel({ profile, onChange }: PermissionPanelProps): ReactElement {
  return (
    <Card
      className="permission-card"
      title="Permission profile"
      actions={<Badge tone="accent" data-testid="permission-profile">{profileLabel(profile)}</Badge>}
    >
      <Field label="Profile controls execution and write prompts." htmlFor="permission-profile-select">
        {({ controlId }) => (
          <select
            id={controlId}
            aria-label="Permission profile"
            value={profile}
            onChange={(event) => {
              const next = event.currentTarget.value;
              if (isPermissionProfileName(next)) void onChange(next);
            }}
          >
            <option value="safe">Safe</option>
            <option value="balanced">Balanced</option>
            <option value="full">Full Access</option>
            <option value="custom">Custom</option>
          </select>
        )}
      </Field>
    </Card>
  );
}

function isPermissionProfileName(value: string): value is PermissionProfileName {
  return value === 'safe' || value === 'balanced' || value === 'full' || value === 'custom';
}

function profileLabel(profile: PermissionProfileName): string {
  return profile === 'full' ? 'Full Access' : profile.charAt(0).toUpperCase() + profile.slice(1);
}
