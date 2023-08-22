import { expect, test, describe } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { renderHook, waitFor } from '@testing-library/react';

import { useDate } from './utils.ts';
import { wrapperWithRouter } from '../../../test-setup/react-router.tsx';

describe('useDate', () => {
    test('default params', async () => {
        const { result } = renderHook(() => useDate(), {
            wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
        });
        expect(result.current.params).toEqual({ dateFrom: null, dateTo: null });
        expect(result.current.updateDateFilter).toBeTypeOf('function');
    });
    test('reads location params', async () => {
        const from = 1691103600000;
        const to = 1693782000000;
        const { result } = renderHook(() => useDate(), {
            wrapper: ({ children }) =>
                wrapperWithRouter(
                    <Routes>
                        <Route path="/:symbol" exact={false} element={children} />
                        <Route path="*" element={'Route not matched'} />
                    </Routes>,
                    { route: '/GOOG?dateFrom=' + from + '&dateTo=' + to },
                ),
        });

        expect(result.current.params).toEqual({
            dateFrom: new Date(parseInt(from, 10)),
            dateTo: new Date(parseInt(to, 10)),
        });
    });
    test('updates location params', async () => {
        const from = 1691103600000;
        const to = 1693782000000;

        const { result } = renderHook(() => useDate(), {
            wrapper: ({ children }) =>
                wrapperWithRouter(
                    <Routes>
                        <Route path="/:symbol" exact={false} element={children} />
                        <Route path="*" element={'Route not matched'} />
                    </Routes>,
                    { route: '/GOOG?dateFrom=' + from + '&dateTo=' + to },
                ),
        });

        const oneDay = 1000 * 60 * 60 * 24;
        result.current.updateDateFilter({ from: from + oneDay, to: to + oneDay });
        // wait for hook to execute (async)
        await waitFor(() => {
            expect(result.current.params).toEqual({
                dateFrom: new Date(parseInt(from + oneDay, 10)),
                dateTo: new Date(parseInt(to + oneDay, 10)),
            });
        });
    });
    test('updating params doesnt remove exeisting search params', async () => {
        const from = 1691103600000;
        const to = 1693782000000;
        const { result } = renderHook(() => useDate(), {
            wrapper: ({ children }) =>
                wrapperWithRouter(
                    <Routes>
                        <Route path="/:symbol" exact={false} element={children} />
                        <Route path="*" element={'Route not matched'} />
                    </Routes>,
                    { route: '/GOOG?other=test&dateFrom=' + from + '&dateTo=' + to },
                ),
        });

        result.current.updateDateFilter({ from: from, to: to });
        // wait for hook to execute (async)
        await waitFor(() => {
            expect(location.search).toEqual('?other=test&dateFrom=' + from + '&dateTo=' + to);
        });
    });
});
