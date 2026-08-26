import type { ReactElement } from 'react';
import type { DashboardSnapshot, UiLocale, WorkspaceSummary } from '@inwsus/ipc-contracts';
import { createTranslator } from '../../i18n/index.js';
import { Badge, Button, Card, EmptyState } from '../../components/ui/index.js';
import { Folder, GitBranch, Lightbulb, Refresh, Sparkle } from '../../components/icons/index.js';

interface GitPageProps {
  readonly locale: UiLocale;
  readonly gitSummary: DashboardSnapshot['gitSummary'];
  readonly selectedWorkspace?: WorkspaceSummary | null;
  readonly workspaces?: readonly WorkspaceSummary[];
  readonly onSelectWorkspace?: (workspaceId: string) => Promise<void>;
  readonly onRefresh?: () => Promise<void>;
}

export function GitPage({
  locale,
  gitSummary,
  selectedWorkspace,
  workspaces = [],
  onSelectWorkspace,
  onRefresh,
}: GitPageProps): ReactElement {
  const t = createTranslator(locale);
  const isClean = gitSummary.changedFiles === 0 && gitSummary.stagedFiles === 0;
  const isRepo = gitSummary.isRepo ?? (gitSummary.message !== 'Not a Git repository' && gitSummary.message !== 'No workspace selected');
  const currentPath = gitSummary.repositoryPath ?? selectedWorkspace?.realRootPath ?? '—';

  return (
    <div className="page-content viewport-list-page git-page">
      <div className="page-heading">
        <div>
          <h1>{t('git.title')}</h1>
          <p className="page-subtitle">
            {`Workspace: ${selectedWorkspace?.displayName ?? '—'} (${currentPath})`}
          </p>
        </div>
        <div className="heading-actions">
          {workspaces.length > 1 && onSelectWorkspace !== undefined ? (
            <div className="field-row">
              <select
                aria-label="Select workspace for Git"
                className="settings-select"
                value={selectedWorkspace?.id ?? ''}
                onChange={(event) => { void onSelectWorkspace(event.target.value); }}
              >
                {workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.displayName}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          {onRefresh === undefined ? null : (
            <Button size="sm" variant="secondary" icon={<Refresh size={14} />} onClick={() => { void onRefresh(); }}>
              {t('action.refresh')}
            </Button>
          )}
        </div>
      </div>

      <Card
        className="git-panel"
        title={locale === 'th' ? 'ภาพรวม Repository' : 'Repository Overview'}
        actions={
          <Badge tone={gitSummary.branch ? 'accent' : 'neutral'} icon={gitSummary.branch ? <GitBranch size={14} /> : undefined}>
            {gitSummary.branch ?? (isRepo ? (locale === 'th' ? 'ไม่มี Branch' : 'No Branch') : (locale === 'th' ? 'ไม่ใช่ Git Repo' : 'Not a Git Repo'))}
          </Badge>
        }
      >
        <div className="section-stack">
          <p><strong data-testid="git-summary">{gitSummary.message}</strong></p>

          <div className="git-metrics-grid">
            <div className="stat-tile">
              <span className="stat-tile__label">{locale === 'th' ? 'สาขาปัจจุบัน (Branch)' : 'Current Branch'}</span>
              <strong className="stat-tile__value">{gitSummary.branch ?? '—'}</strong>
            </div>
            <div className="stat-tile">
              <span className="stat-tile__label">{t('git.changed')}</span>
              <strong className="stat-tile__value">{gitSummary.changedFiles}</strong>
            </div>
            <div className="stat-tile">
              <span className="stat-tile__label">{t('git.staged')}</span>
              <strong className="stat-tile__value">{gitSummary.stagedFiles}</strong>
            </div>
            <div className={`stat-tile ${!isRepo ? '' : isClean ? 'stat-tile--safe' : 'stat-tile--warn'}`}>
              <span className="stat-tile__label">{locale === 'th' ? 'สถานะ Working Tree' : 'Working Tree'}</span>
              <strong className="stat-tile__value">
                {!isRepo ? '—' : isClean ? (locale === 'th' ? 'สะอาด (Clean)' : 'Clean') : (locale === 'th' ? 'มีการแก้ไข (Modified)' : 'Modified')}
              </strong>
            </div>
          </div>

          {!isRepo ? (
            <div className="git-not-repo-notice">
              <div className="git-notice-body">
                <span className="git-notice-body__icon"><Lightbulb size={18} /></span>
                <div className="git-notice-body__text">
                  <strong>{locale === 'th' ? 'โฟลเดอร์นี้ยังไม่ได้เชื่อมต่อเป็น Git Repository' : 'Current directory is not a Git repository'}</strong>
                  <p>
                    {locale === 'th'
                      ? `โฟลเดอร์ "${currentPath}" ไม่มี .git หากต้องการดูสถานะ Git ให้เลือกหรือสลับไปยัง Workspace ที่เป็นโปรเจกต์ Git ของคุณ:`
                      : `Path "${currentPath}" has no .git folder. Switch to a Git workspace project below:`}
                  </p>
                </div>
              </div>
              {workspaces.filter((ws) => ws.id !== selectedWorkspace?.id).length > 0 && onSelectWorkspace !== undefined ? (
                <div className="git-switch-list">
                  {workspaces.filter((ws) => ws.id !== selectedWorkspace?.id).map((ws) => (
                    <div key={ws.id} className="git-switch-row">
                      <div className="git-switch-row__text">
                        <strong><Folder size={14} /> {ws.displayName}</strong>
                        <p>{ws.realRootPath}</p>
                      </div>
                      <Button size="sm" variant="secondary" onClick={() => { void onSelectWorkspace(ws.id); }}>
                        {locale === 'th' ? 'สลับมายังโปรเจกต์นี้' : 'Switch to this project'}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Folder size={28} />}
                  title={locale === 'th' ? 'ไม่มี Workspace อื่นให้สลับ' : 'No other workspace to switch to'}
                  description={locale === 'th' ? 'เพิ่มโปรเจกต์ใหม่จากหน้า Projects เพื่อดูสถานะ Git' : 'Add a project from the Projects page to see its Git status here.'}
                />
              )}
            </div>
          ) : gitSummary.entries !== undefined && gitSummary.entries.length > 0 ? (
            <div>
              <h3>{locale === 'th' ? 'รายการไฟล์ที่มีการเปลี่ยนแปลง (Changed Files)' : 'Changed Files'}</h3>
              <div className="git-file-list">
                {gitSummary.entries.map((entry) => (
                  <div key={entry.path} className="git-file-row">
                    <Badge tone="neutral">{entry.kind.toUpperCase()}</Badge>
                    <span className="git-file-row__path">{entry.path}</span>
                    <span className="git-file-row__status">
                      {entry.indexStatus !== ' ' ? 'Staged' : 'Unstaged'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : isClean ? (
            <EmptyState
              icon={<Sparkle size={28} />}
              title={locale === 'th' ? 'Working tree สะอาด' : 'Working Tree Clean'}
              description={
                locale === 'th'
                  ? 'ไม่มีไฟล์ที่ถูกแก้ไขหรือรอการ commit ใน repository นี้'
                  : 'No modified, untracked, or staged files found.'
              }
            />
          ) : null}
        </div>
      </Card>
    </div>
  );
}
