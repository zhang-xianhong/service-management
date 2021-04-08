module.exports = {
    extends: ['@commitlint/config-conventional'],
    parserPreset: 'conventional-changelog-conventionalcommits',
    rules: {
        'type-enum': [2, 'always', [
            'upd', 'feat', 'fix', 'refactor', 'docs', 'chore', 'style', 'revert'
        ]],
        'body-leading-blank': [0, 'never'],
        'body-max-line-length': [2, 'always', 200],
        'footer-leading-blank': [1, 'always'],
        'footer-max-line-length': [2, 'always', 100],
        'header-max-length': [2, 'always', 200],
        'scope-case': [0, 'never', 'lower-case'],
        'subject-case': [
            0,
            'never'
        ],
        'subject-full-stop': [0, 'never', '.'],
        'type-case': [0, 'always', 'kebab-case'],
    },
};
