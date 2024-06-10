export type ProjectProp = {
  id: number;
  name: string;
  url: string;
};

export type VersionType = {
  id: number;
  name: string;
  project: number | ProjectProp | null;
};

export type SnapshotType = {
  id: number;
  date: string;
  version: number | VersionType;
  versionName: string | null;
  passed: number[];
  failed: number[];
  todo: number[];
  unverified: number[];
};

export type TestcaseType = {
  id: number;
  email: string;
  timeout: number;
  command: string;
  key: string;
  status: string;
  group: null | number;
  recent: null | number;
};

export type GroupType = {
  id: number;
  name: string;
  project: number;
};
