/** @type {import("@commitlint/types").UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'ci', 'perf', 'build'],
    ],
    'subject-case': [1, 'always', ['sentence-case', 'lower-case']],
    'body-max-line-length': [0],
    'references-empty': [1, 'never'],
  },
  ignores: [(commit) => commit.startsWith('Merge')],
  parserPreset: {
    parserOpts: {
      issuePrefixes: ['Fixes #', 'Fixed #', 'Closes #', 'Closed #'],
    },
  },
};
