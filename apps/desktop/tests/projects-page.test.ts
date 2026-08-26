import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { WorkspaceSummary } from '@inwsus/ipc-contracts';
import { ProjectsPage } from '../src/renderer/features/projects/ProjectsPage.js';

const noop = async (): Promise<void> => undefined;
const workspace = (id: string, overrides: Partial<WorkspaceSummary> = {}): WorkspaceSummary => ({
  id,
  displayName: id,
  rootPath: `E:\\${id}`,
  realRootPath: `E:\\${id}`,
  createdAt: '2026-08-24T00:00:00.000Z',
  kind: 'project',
  archivedAt: null,
  ...overrides,
});

describe('Projects page lifecycle controls', () => {
  it('separates active, archived, and system workspaces with safe actions', () => {
    const markup = renderToStaticMarkup(createElement(ProjectsPage, {
      locale: 'en',
      workspaces: [
        workspace('active-project'),
        workspace('archived-project', { archivedAt: '2026-08-24T00:01:00.000Z' }),
        workspace('system-root', { rootPath: 'E:\\', realRootPath: 'E:\\', kind: 'machine_root' }),
      ],
      selectedWorkspaceId: 'active-project',
      onSelectWorkspace: noop,
      onAddWorkspace: noop,
      onSetWorkspaceArchived: async (): Promise<void> => undefined,
      onDeleteWorkspace: noop,
    }));

    expect(markup).toContain('Active projects');
    expect(markup).toContain('Archived projects');
    expect(markup).toContain('System workspaces');
    // Buttons render via the shared `Button` primitive, which wraps its label
    // in a `ui-button__label` span — assert against that shape instead of a
    // bare `<button>` close tag.
    expect(markup).toContain('Archive</span></button>');
    expect(markup).toContain('Restore</span></button>');
    expect(markup).toContain('Remove</span></button>');
    expect(markup).toContain('managed automatically by inwsus');
    expect(markup.match(/>Remove<\/span><\/button>/g)?.length).toBe(2);
  });

  it('explains that registration removal never deletes project files', () => {
    const source = renderToStaticMarkup(createElement(ProjectsPage, {
      locale: 'th',
      workspaces: [workspace('project-a')],
      selectedWorkspaceId: null,
      onSelectWorkspace: noop,
      onAddWorkspace: noop,
      onSetWorkspaceArchived: async (): Promise<void> => undefined,
      onDeleteWorkspace: noop,
    }));
    expect(source).toContain('ลบรายการ');
  });
});
