'use strict';

import * as vscode from 'vscode';
import { fetchStory } from './lib/pivotal';
import { preloadTemplates, templatetizeErrorResponse, templatetizeSuccessResponse } from './lib/templates';

export function activate(context: vscode.ExtensionContext): void {
  const regexp = /^#?(\d{9})$/;
  const templates = preloadTemplates();

  const disposable = vscode.languages.registerHoverProvider('javascript', {
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
  });

  context.subscriptions.push(disposable);
}

export function deactivate(): void {
  void 0;
}
