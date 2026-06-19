/** @type {import("prettier").Config} */
module.exports = {
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  semi: true,
  arrowParens: 'always',
  htmlWhitespaceSensitivity: 'css',
  endOfLine: 'lf',
  overrides: [
    {
      files: '*.html',
      options: {
        parser: 'angular',
      },
    },
    {
      files: ['tsconfig.json', 'angular.json', 'tsconfig.*.json'],
      options: {
        parser: 'jsonc',
      },
    },
  ],
};
