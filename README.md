# Schroders

## Quick Start

-   `yarn`
-   `yarn dev`
-   [http://localhost:5173/APLE/?symbolFilter=APL&dateFrom=1691103600000&dateTo=1693782000000](http://localhost:5173/APLE/?symbolFilter=APL&dateFrom=1691103600000&dateTo=1693782000000)

## Decision log

### Technologies

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
-   **React-charts**
    -   A simple Charting library
    -   Pros: handles drawing charts from a given data structure
    -   Cons: have to learn in and mutate API response into desired structure
    -   Consequence: small overhead as results are reformatted
    -   Alternative: d3 (much more flexibility, much higher learning curve)
-   **Shadcn**
    -   A fully accessible component library
    -   Pros: headless first approach makes every component highly customisable
    -   Cons: uses Tailwind, which is new to me
    -   Consequence: additional learning required for Shadcn + tailwind
    -   Alternative: use Radix-UI, Chakra-UI, etx

### Coding

-   "URLs to store state" vs "React handling State"
    -   Decision: URLs
    -   Reason: Allows view to be shareable
    -   Consequence: no custom global state management system added yet
    -   Revisit: When the app grows and global state is truly needed
-   "Fetch data at page level" vs "within components"
    -   Decision: Page level, which forces more upfront thinking about interactions, but long-term simplicity is achieved
    -   Reason: keeping component dumb for as long as possible makes extending capabilities easier
    -   Revisit: When it becomes prohibitive. Whiteboard problem to reduce complexity before undoing
-   useSymbols "filter Function" vs "filter String"
    -   Decision: Function, which increases flexibility, but also increases complexity (but only slightly).
    -   Reason: 'useFinnHubSymbols' should be reusable and extensible without increasing API footprint
    -   Revisit: When more filter functions are _too_ complex.
