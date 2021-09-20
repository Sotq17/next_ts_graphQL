module.exports = {
  extends: ['standard', 'plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 80,
        tabWidth: 2,
        useTabs: false,
        semi: false,
        singleQuote: true,
        jsxSingleQuote: true,
        trailingComma: 'es5',
        bracketSpacing: true,
        jsxBracketSameLine: false,
        arrowParens: 'avoid',
        rangeStart: 0,
        requirePragma: false,
        insertPragma: false,
        proseWrap: 'preserve',
        endOfLine: 'auto',
      },
    ],
  },
}
