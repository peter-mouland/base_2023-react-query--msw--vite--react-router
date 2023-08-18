module.exports = {
    '*.css': ['stylelint --fix'],
    '*.{js,jsx,ts,tsx}': [
        'eslint --cache --fix',
        // 'yarn test --bail --findRelatedTests',
    ],
    '*.{json,md}': ['prettier . --write'],
};
