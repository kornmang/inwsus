import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { resolveInwsusDataPath } from './data-path.js';

describe('resolveInwsusDataPath', () => {
  it('uses the same explicit override for Desktop and MCP', () => {
    expect(resolveInwsusDataPath({ INWSUS_DATA_PATH: 'D:\\agent-data', APPDATA: 'C:\\Users\\u\\AppData\\Roaming' })).toBe(path.resolve('D:\\agent-data'));
  });

  it('defaults to the per-user roaming AppData inwsus directory', () => {
    expect(resolveInwsusDataPath({ APPDATA: 'C:\\Users\\u\\AppData\\Roaming' })).toBe(path.resolve('C:\\Users\\u\\AppData\\Roaming\\inwsus'));
  });

  it('accepts Electron appData as a fallback without embedding a build-machine profile', () => {
    expect(resolveInwsusDataPath({}, 'C:\\Users\\end-user\\AppData\\Roaming')).toBe(path.resolve('C:\\Users\\end-user\\AppData\\Roaming\\inwsus'));
  });
});
