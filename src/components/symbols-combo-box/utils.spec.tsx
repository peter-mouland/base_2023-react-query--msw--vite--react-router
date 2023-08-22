import { expect, test, describe } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { renderHook } from '@testing-library/react';

import { useSymbols } from './utils.ts';
import { wrapperWithRouter } from '../../../test-setup/react-router.tsx';

describe('useSymbols', () => {
    test('default params', async () => {
        const { result } = renderHook(() => useSymbols(), {
            wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
        });
        expect(result.current.params.symbol).toEqual([]);
        expect(result.current.params.symbolFilter).toBeTypeOf('undefined');
        expect(result.current.updateSymbol).toBeTypeOf('function');
        expect(result.current.updateSymbolFilter).toBeTypeOf('function');
        expect(result.current.filterFunction).toBeTypeOf('function');
    });
    test('reads location params', async () => {
        const symbol = 'PETE';
        const symbolFilter = 'filter';
        const { result } = renderHook(() => useSymbols(), {
            wrapper: ({ children }) =>
                wrapperWithRouter(
                    <Routes>
                        <Route path="/:symbol" exact={false} element={children} />
                        <Route path="*" element={'Route not matched'} />
                    </Routes>,
                    { route: '/' + symbol + '?symbolFilter=' + symbolFilter },
                ),
        });

        expect(result.current.params).toEqual({ symbolFilter: symbolFilter.toUpperCase(), symbol: [symbol] });
    });

    test('returns multiple symbols in sorted order', async () => {
        const symbol = 'zPETE';
        const symbol2 = 'aPAUL';
        const { result } = renderHook(() => useSymbols(), {
            wrapper: ({ children }) =>
                wrapperWithRouter(
                    <Routes>
                        <Route path="/:symbol" exact={false} element={children} />
                        <Route path="*" element={'Route not matched'} />
                    </Routes>,
                    { route: '/' + symbol + ':' + symbol2 },
                ),
        });

        expect(result.current.params).toEqual({ symbolFilter: undefined, symbol: [symbol2, symbol] });
    });

    test('handles maximum of 3 symbols', async () => {
        const symbol = 'a';
        const symbol2 = 'b';
        const symbol3 = 'c';
        const symbol4 = 'd';
        const { result } = renderHook(() => useSymbols(), {
            wrapper: ({ children }) =>
                wrapperWithRouter(
                    <Routes>
                        <Route path="/:symbol" exact={false} element={children} />
                        <Route path="*" element={'Route not matched'} />
                    </Routes>,
                    { route: '/' + symbol + ':' + symbol2 + ':' + symbol3 + ':' + symbol4 },
                ),
        });

        expect(result.current.params).toEqual({ symbolFilter: undefined, symbol: [symbol, symbol2, symbol3] });
    });
    test('filterFunction return only matching symbols', async () => {
        const symbol = 'a';
        const symbol2 = 'b';
        const symbol3 = 'c';
        const symbol4 = 'd';
        const { result } = renderHook(() => useSymbols(), {
            wrapper: ({ children }) =>
                wrapperWithRouter(
                    <Routes>
                        <Route path="/:symbol" exact={false} element={children} />
                        <Route path="*" element={'Route not matched'} />
                    </Routes>,
                    { route: '/GOOG?symbolFilter=a' },
                ),
        });

        expect(
            result.current.filterFunction([
                { symbol: symbol },
                { symbol: symbol2 },
                { symbol: symbol3 },
                { symbol: symbol4 },
            ]),
        ).toEqual([{ symbol }]);
    });
});
