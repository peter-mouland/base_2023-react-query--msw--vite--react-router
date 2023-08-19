// import '@testing-library/jest-dom/extend-expect';
import { afterAll, afterEach, beforeAll, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

import { server } from './mocks/server';
import { queryClient } from './msw.tsx';

// extends ViTest's expect method with methods from react-testing-library
expect.extend(matchers);

beforeAll(() => {
    server.listen({
        onUnhandledRequest(req) {
            console.warn('Found an unhandled %s request to %s', req.method, req.url.href);
        },
    });
    // server.events.on('request:match', (req) => {
    //     console.log('%s %s has a handler!', req.method, req.url.href)
    // })
});

afterEach(() => {
    queryClient.clear();
    // Reset any runtime handlers tests may use.
    server.resetHandlers();
    // runs a cleanup after each test case (e.g. clearing jsdom)
    cleanup();
});

afterAll(() => {
    server.close();
});
