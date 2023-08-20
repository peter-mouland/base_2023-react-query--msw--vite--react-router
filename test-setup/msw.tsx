import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { rest } from 'msw';
import { server } from './mocks/server';

export const queryCache = new QueryCache();
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
    logger: {
        log: console.log,
        warn: console.warn,
        // ✅ no more errors on the console for tests
        error: function hideError() {
            /**/
        },
    },
});

export const wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;

export const setupApi = (endpoint, { response, method = 'get', status = 200, delay = 0 } = {}) => {
    let resolver;
    const promise = new Promise((resolve) => {
        resolver = resolve;
    });
    server.use(
        rest[method](endpoint, (req, res, ctx) => {
            const handlers = [ctx.status(status), response ? ctx.json(response) : null, ctx.delay(delay)];
            // send response back as fulfilled promise
            //  enables people to await API to be hit before running an assertion
            //  e.g.
            //      const apiPromise = serveOnce('http://google.com', { response: { key: 'value' });
            //      const { result } = renderHook(() => useGoogle(), { wrapper });
            //      const { response, request } = await apiPromise();
            //      assert(...) // on UI update, or request headers etc etc
            resolver({ response, request: req });
            return res.once(...handlers);
        }),
    );
    return () => promise;
};
