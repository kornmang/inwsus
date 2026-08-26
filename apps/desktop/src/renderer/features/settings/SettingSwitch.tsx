import type { ReactElement } from 'react';

interface SettingSwitchProps {
  readonly checked: boolean;
  readonly label: string;
  readonly description?: string;
  readonly disabled?: boolean;
  readonly onChange: (checked: boolean) => void;
  /**
   * Renders the track only (no inline label/description row) for placement
   * next to a card title — e.g. a `SectionHeading`'s `actions` slot — where
   * the label and description are already shown elsewhere. The label is
   * still exposed via `aria-label` for accessibility.
   */
  readonly compact?: boolean;
}

/**
 * A labeled on/off row. Kept as its own component (rather than folded into the
 * shared `Switch` primitive) because callers pass a full label + description
 * pair that doubles as the click target — see DESIGN_CONTRACT.md §4.
 */
export function SettingSwitch({ checked, label, description, disabled = false, onChange, compact = false }: SettingSwitchProps): ReactElement {
  return (
    <button
      type="button"
      className={`setting-switch${checked ? ' is-on' : ''}${compact ? ' setting-switch--compact' : ''}`}
      role="switch"
      aria-checked={checked}
      aria-label={compact ? label : undefined}
      disabled={disabled}
      onClick={() => onChange(!checked)}
    >
      {compact ? null : (
        <span className="setting-switch__copy">
          <strong>{label}</strong>
          {description === undefined ? null : <small>{description}</small>}
        </span>
      )}
      <span className="setting-switch__track" aria-hidden="true">
        <span className="setting-switch__thumb" />
      </span>
    </button>
  );
}
