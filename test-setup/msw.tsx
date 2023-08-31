import * as React from 'react';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { rest } from 'msw';
import type { RestRequest } from 'msw';

import { server } from './mocks/server';
import { ResponseOk, ResponseError } from '../src/ts-utils/http-codes';

export const queryCache = new QueryCache();
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

export const wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;

type Methods = 'get' | 'post' | 'put' | 'delete' | 'patch'
interface ApiOptionsOk {
    response: unknown;
    method?: Methods;
    status?: ResponseOk;
    delay?: number;
}
interface ApiOptionsError {
    response?: unknown;
    method?: Methods;
    status: ResponseError;
    delay?: number;
}
type ApiOptions = ApiOptionsOk | ApiOptionsError
interface ResolvedResponse {
    response: unknown,
    request: RestRequest
}
export const setupApi = (endpoint: string, { response = null, method = 'get', status = 200, delay = 0 } : ApiOptions = { response:null}) => {
    let resolver;
    const promise = new Promise<ResolvedResponse>((resolve) => {
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
