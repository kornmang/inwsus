import type { McpToolDefinition } from './tools/tool-types.js';

export interface InwsusPluginPermission {
  readonly name: string;
  readonly reason: string;
}

export interface InwsusSkillDescriptor {
  readonly id: string;
  readonly description: string;
  readonly tags: readonly string[];
}

export interface InwsusRecipeDescriptor {
  readonly name: string;
  readonly steps: readonly string[];
}

export interface InwsusPlugin {
  readonly id: string;
  readonly version: string;
  readonly tools?: readonly McpToolDefinition[];
  readonly hooks?: readonly string[];
  readonly skills?: readonly InwsusSkillDescriptor[];
  readonly recipes?: readonly InwsusRecipeDescriptor[];
  readonly requiredPermissions?: readonly InwsusPluginPermission[];
}
