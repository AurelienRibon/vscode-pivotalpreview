import * as vscode from 'vscode';
import { readFileSync } from 'fs';
import { PivotalErrorResponse, PivotalStorySuccessResponse } from './pivotal-types';
import { formatDate } from './dates';

export type PreloadedTemplates = {
  hoverTemplateSuccess: string;
  hoverTemplateError: string;
};

export function preloadTemplates(): PreloadedTemplates {
  // Note: since .ts will be compiled in `./out/`, we need to go back one extra level.
  const hoverTemplateSuccess = readFileSync(`${__dirname}/../../../res/hover-template-success.md`, 'utf8');
  const hoverTemplateError = readFileSync(`${__dirname}/../../../res/hover-template-error.md`, 'utf8');
  return { hoverTemplateSuccess, hoverTemplateError };
}

export function templatetizeSuccessResponse(
  res: PivotalStorySuccessResponse,
  templates: PreloadedTemplates
): vscode.MarkdownString {
  const str = templates.hoverTemplateSuccess
    .replace('{{estimate}}', String(res.estimate))
    .replace('{{current_state}}', res.current_state)
    .replace('{{url}}', res.url)
    .replace('{{created_at}}', formatPivotalDate(res.created_at))
    .replace('{{name}}', res.name)
    .replace('{{description}}', res.description ?? 'No description.');

  return new vscode.MarkdownString(str, true);
}

export function templatetizeErrorResponse(
  res: PivotalErrorResponse,
  templates: PreloadedTemplates
): vscode.MarkdownString {
  let description = '';

  if (res.general_problem) {
    description += res.general_problem + '\n  ';
  }

  if (res.possible_fix) {
    description += res.possible_fix;
  }

  const str = templates.hoverTemplateError
    .replace('{{error}}', String(res.error))
    .replace('{{description}}', description);

  return new vscode.MarkdownString(str, true);
}

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function formatPivotalDate(string: string): string {
  return formatDate(new Date(string), true);
}
