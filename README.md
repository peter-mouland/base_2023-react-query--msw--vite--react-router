# Schroders

## Decision log

-   **Vite**
    -   Run the app during development, and build production ready assets
    -   Pros: quick and easy to set up. no framework, just production ready code.
    -   Cons: lacks feature set of frameworks
    -   Consequence: minimal effort needed to migrate to a framework at a later date
    -   Alternatives: NextJS, GatsbyJS, Remix etc. disregarded due to complexity for a _single-page_ SPA,
        plus desire to make it easy to determine candidate code vs boilerplate code
-   **Git Hooks**
    -   Run commands on git commit and push
    -   Pros: linting is enforced on each commit (using Husky, lint-staged, eslint, prettier, tslint, stylelint)
    -   Cons: minor setup cost before coding can begin
    -   Consequence: Slightly longer to complete aim of task - but bugs caught earlier
    -   Alternatives: _not linting on each commit_. Disregarded so quality is kept high from the start
-   **ViTest**
    -   Run unit and integration level tests
    -   Pros: works without effort with Vite
    -   Cons: new test-runner, longer to get going... assumption is all test runners are now _very_ similar.
    -   Consequence: small onboarding to set up
    -   Alternatives: Jest, node:test
-   **React-testing-library**
    -   React renderer and assertion library for Unit and integration level test
    -   Pros: well known and now de-facto for react. Test as the user interacts by default.
    -   Cons: none
    -   Consequence: n/a
    -   Alternatives: Cypress
-   **React-query**
    -   Integrate React smoothly with APIs.
    -   Pros: handles states (loading, error, pending), cache, stale-time and all things regards data-management
    -   Cons: Now has 'best practises' which new users (devs) should learn to keep standards high
    -   Consequence: small onboarding time, but much faster development time
    -   Alternatives: SWC
