import type { ReactElement, ReactNode } from 'react';
import type { UiLocale, UpdateStatus } from '@inwsus/ipc-contracts';
import { createTranslator } from '../../i18n/index.js';
import type { MessageKey } from '../../i18n/messages.js';
import { StatusDot } from '../../components/ui/index.js';
import {
  Activity,
  GitBranch,
  Home,
  LayoutGrid,
  ScrollText,
  Settings,
  Stethoscope,
  type IconProps,
} from '../../components/icons/index.js';

export type Screen = 'home' | 'projects' | 'git' | 'worklog' | 'live' | 'settings' | 'doctor';

interface AppShellProps {
  readonly locale: UiLocale;
  readonly appVersion: string;
  readonly mcpRunning: boolean;
  readonly updateStatus: UpdateStatus | null;
  readonly screen: Screen;
  readonly onNavigate: (screen: Screen) => void;
  readonly onLocaleChange: (locale: UiLocale) => void;
  readonly onUpdateAction: () => void;
  readonly children: ReactNode;
}

const navItems: ReadonlyArray<{
  readonly screen: Screen;
  readonly key: MessageKey;
  readonly icon: (props: IconProps) => ReactElement;
}> = [
  { screen: 'home', key: 'nav.home', icon: Home },
  { screen: 'projects', key: 'nav.projects', icon: LayoutGrid },
  { screen: 'git', key: 'nav.git', icon: GitBranch },
  { screen: 'worklog', key: 'nav.workLog', icon: ScrollText },
  { screen: 'live', key: 'nav.live', icon: Activity },
  { screen: 'settings', key: 'nav.settings', icon: Settings },
  { screen: 'doctor', key: 'nav.doctor', icon: Stethoscope },
];

export function AppShell(props: AppShellProps): ReactElement {
  const t = createTranslator(props.locale);
  return (
    <div className="window-container">
      <header className="custom-titlebar">
        <div className="titlebar-drag-region">
          <div className="titlebar-brand">
            <img src="./favicon.ico" alt="inwsus logo" className="titlebar-logo" />
            <span className="titlebar-title">{t('brand')}</span>
          </div>
          <button
            type="button"
            className={`titlebar-version update-${props.updateStatus?.phase ?? 'idle'}`}
            onClick={props.onUpdateAction}
            title={props.updateStatus?.message ?? (props.locale === 'th' ? 'กดเพื่อตรวจอัปเดต' : 'Check for updates')}
            aria-label={props.updateStatus?.canInstall === true
              ? (props.locale === 'th' ? `ติดตั้งอัปเดต ${props.updateStatus.availableVersion ?? ''}` : `Install update ${props.updateStatus.availableVersion ?? ''}`)
              : (props.locale === 'th' ? 'ตรวจอัปเดต' : 'Check for updates')}
            aria-busy={props.updateStatus?.phase === 'checking' || props.updateStatus?.phase === 'downloading'}
          >
            {versionBadgeText(props.appVersion, props.updateStatus, props.locale)}
          </button>
          <StatusDot
            className="titlebar-status"
            tone={props.mcpRunning ? 'success' : 'neutral'}
            label={props.mcpRunning ? (props.locale === 'th' ? 'MCP Gateway ออนไลน์' : 'MCP Gateway Active') : (props.locale === 'th' ? 'MCP พร้อมทำงาน' : 'MCP Ready')}
          />
        </div>

        <div className="titlebar-actions">
          <div className="locale-switch" role="group" aria-label={t('settings.locale')}>
            <button
              type="button"
              className={props.locale === 'th' ? 'active' : undefined}
              onClick={() => props.onLocaleChange('th')}
            >
              {t('language.th')}
            </button>
            <button
              type="button"
              className={props.locale === 'en' ? 'active' : undefined}
              onClick={() => props.onLocaleChange('en')}
            >
              {t('language.en')}
            </button>
          </div>
        </div>
      </header>

      {/* Main App Body */}
      <div className="app-shell">
        <aside className="sidebar" aria-label="Navigation">
          <div className="sidebar-brand">
            <strong>{t('brand')}</strong>
            <span>v{props.appVersion}</span>
          </div>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <button
                key={item.screen}
                type="button"
                className={props.screen === item.screen ? 'nav-item active' : 'nav-item'}
                onClick={() => props.onNavigate(item.screen)}
              >
                <item.icon size={16} className="nav-item__icon" />
                <span className="nav-item__label">{t(item.key)}</span>
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <span className="sidebar-footer__label">Windows Desktop</span>
            <StatusDot
              tone={props.mcpRunning ? 'success' : 'neutral'}
              label={props.mcpRunning ? t('footer.connected') : t('footer.disconnected')}
            />
          </div>
        </aside>

        <div className="main-pane">
          <main className="main-content">{props.children}</main>
        </div>
      </div>
    </div>
  );
}
function versionBadgeText(appVersion: string, status: UpdateStatus | null, locale: UiLocale): string {
  if (status === null) return `v${appVersion}`;
  const next = status.availableVersion;
  if (status.phase === 'ready' && next !== null) return locale === 'th' ? `อัปเดต v${next}` : `Update v${next}`;
  if (status.phase === 'installing' && next !== null) return locale === 'th' ? `กำลังติดตั้ง v${next}` : `Installing v${next}`;
  if (status.phase === 'downloading') {
    const percent = status.progressPercent === null ? '' : ` ${Math.round(status.progressPercent)}%`;
    return `v${appVersion} ↓${percent}`;
  }
  if (status.phase === 'available' && next !== null) return `v${appVersion} → v${next}`;
  if (status.phase === 'checking') return locale === 'th' ? `v${appVersion} • เช็ก…` : `v${appVersion} • checking…`;
  if (status.phase === 'error') return `v${appVersion} • !`;
  return `v${appVersion}`;
}
