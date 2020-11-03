export type PivotalResponse = PivotalStorySuccessResponse | PivotalStoryErrorResponse;

export type PivotalStorySuccessResponse = {
  kind: 'story';
  id: number;
  created_at: string;
  updated_at: string;
  estimate: number;
  story_type: string;
  name: string;
  description?: string;
  current_state: string;
  requested_by_id: number;
  url: string;
  project_id: number;
  owner_ids: number[];
  labels: {
    id: number;
    project_id: number;
    kind: string;
    name: string;
    created_at: string;
    updated_at: string;
  }[];
};

export type PivotalStoryErrorResponse = {
  kind: 'error';
  code: string;
  error: string;
  general_problem?: string;
  possible_fix?: string;
};
