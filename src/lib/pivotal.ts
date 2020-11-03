import * as https from 'https';
import { OutgoingHttpHeaders } from 'http';
import { PivotalResponse } from './pivotal-types';

const URL_TEMPLATE = 'https://www.pivotaltracker.com/services/v5/projects/{projectId}/stories/{storyId}';
const URL_STUB_PROJECTID = '{projectId}';
const URL_STUB_STORYID = '{storyId}';

export async function fetchStory(token: string, projectId: string, storyId: string): Promise<PivotalResponse> {
  const url = URL_TEMPLATE.replace(URL_STUB_PROJECTID, projectId).replace(URL_STUB_STORYID, storyId);
  const headers = { 'X-TrackerToken': token };
  const response = await fetch(url, headers);
  return safeParse(response) as PivotalResponse;
}

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

async function fetch(url: string, headers: OutgoingHttpHeaders): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      const chunks: Uint8Array[] = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const string = Buffer.concat(chunks).toString('utf8');
        return resolve(string);
      });
      res.on('error', reject);
    });
  });
}

function safeParse(string: string): unknown | undefined {
  try {
    return JSON.parse(string);
  } catch {
    return;
  }
}
