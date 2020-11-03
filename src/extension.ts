'use strict';

import * as vscode from 'vscode';
import { fetchStory } from './lib/pivotal';
import {
  PreloadedTemplates,
  preloadTemplates,
  templatetizeErrorResponse,
  templatetizeSuccessResponse,
} from './lib/templates';

export function activate(context: vscode.ExtensionContext): void {
  const regexp = /\b(\d{9})\b/;
  const templates = preloadTemplates();
  const hoverProvider = generateHoverProvider(regexp, templates);
  context.subscriptions.push(vscode.languages.registerHoverProvider('*', hoverProvider));
}

export function deactivate(): void {
  void 0;
}

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function generateHoverProvider(regexp: RegExp, templates: PreloadedTemplates): vscode.HoverProvider {
  return {
    async provideHover(document, position) {
      const wordRange = document.getWordRangeAtPosition(position);
      if (!wordRange) {
        return;
      }

      const word = document.getText(wordRange);
      const match = word.match(regexp);

      if (!match) {
        return;
      }

      const storyId = match[1];
      const { token } = vscode.workspace.getConfiguration('pivotalpreview');
      const response = await fetchStory(token, storyId);

      if (response.kind === 'story') {
        return new vscode.Hover(templatetizeSuccessResponse(response, templates));
      } else if (response.kind === 'error') {
        return new vscode.Hover(templatetizeErrorResponse(response, templates));
      }
    },
  };
}
