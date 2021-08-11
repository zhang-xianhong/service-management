export const NUMERIC_VER = /v?(0|[1-9]\d{0,3})\.(0|[1-9]\d{0,3})\.(0|[1-9]\d{0,3})/i;

export type ReleaseType = 'major' | 'minor' | 'patch';

export type Version = `${SemVerStruct['major']}.${SemVerStruct['minor']}.${SemVerStruct['patch']}`;

export const enum Relation {
  Equal = 0,
  Greater = 1,
  Less = -1,
}
export type SemVerNumer = {
  readonly [key in ReleaseType]: number;
};
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};
export type SemVerStruct = SemVerNumer & {
  readonly raw: string;
  readonly version: `${number}.${number}.${number}`;
  compare: (version: string) => Relation;
  inc: (release: ReleaseType, identifier: number) => void;
};
// eslint-disable-next-line no-nested-ternary
export const compareIdentifiers = (a: number, b: number) => (a === b ? 0 : a < b ? -1 : 1);

export class SemVer implements SemVerStruct {
  major: number;
  minor: number;
  patch: number;
  raw: string;
  constructor(version: string) {
    const m = version.match(NUMERIC_VER);
    if (!m) {
      throw new TypeError(`Invalid Version ${version}`);
    }
    this.major = +m[1];
    this.minor = +m[2];
    this.patch = +m[3];
    this.raw = version;
  }

  get version(): `${number}.${number}.${number}` {
    return `${this.major}.${this.minor}.${this.patch}`;
  }

  compare(other: string | SemVerStruct): Relation {
    let otherSemVer: SemVerStruct;
    if (typeof other === 'string') {
      if (other === this.version) return 0;
      otherSemVer = new SemVer(other);
    } else {
      otherSemVer = other;
    }

    if (otherSemVer.version === this.version) {
      return 0;
    }

    return (
      compareIdentifiers(this.major, otherSemVer.major) ||
      compareIdentifiers(this.minor, otherSemVer.minor) ||
      compareIdentifiers(this.patch, otherSemVer.patch)
    );
  }

  inc(release: ReleaseType, identifier = 1) {
    if (release === 'major') {
      this.major += identifier;
      this.minor = 0;
      this.patch = 0;
    }
    if (release === 'minor') {
      this.minor += identifier;
      this.patch = 0;
    }
    if (release === 'patch') {
      this.patch += identifier;
    }
  }
}

export const parse = (version: string) => {
  try {
    return new SemVer(version);
  } catch (error) {
    return null;
  }
};

export const valid = (version: string) => {
  const v = parse(version);
  return v ? v.version : null;
};

export const compare = (v1: string, v2: string) => new SemVer(v1).compare(new SemVer(v2));

export const eq = (v1: string, v2: string) => new SemVer(v1).compare(new SemVer(v2)) === 0;

export const diff = (v1: string, v2: string, type: ReleaseType) => {
  const server1 = new SemVer(v1);
  const server2 = new SemVer(v2);
  return server1[type] - server2[type];
};
