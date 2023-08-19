import { expect, test, describe } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { queryFinnHubFn, useFinnHubSymbols, useFinnHubCandles } from './index.ts';
import { wrapper, setupApi } from '../../../test-setup/msw.tsx';

describe('useQueryFinnHub', () => {
    test('invalid params', async () => {
        await expect(() => queryFinnHubFn()).toThrowError(/queryFinnHubFn/);
    });
    test('success', async () => {
        const response = { answer: 42 };
        setupApi('*/any', { response });
        const res = await queryFinnHubFn('/any');
        expect(res).toStrictEqual(response);
    });
    test('error 500', async () => {
        setupApi('*/any', { status: 500 });
        await expect(queryFinnHubFn('/any')).rejects.toThrow(/queryFinnHubFn: Fetch Error 500/);
    });
    test('error 404', async () => {
        setupApi('*/any', { status: 404 });
        await expect(queryFinnHubFn('/any')).rejects.toThrow(/queryFinnHubFn: Fetch Error 404/);
    });
});

describe('useFinnHubSymbols', () => {
    test('throws w/ missing required options', async () => {
        const response = { answer: 42 };
        setupApi('*/stock/symbol', { response });
        await expect(() => useFinnHubSymbols('/any')).toThrow(/useFinnHubSymbols: Missing "exchange" string/);
    });
    test('url params created from options', async () => {
        const response = { answer: 42 };
        //  https://finnhub.io/api/v1/stock/symbol
        const apiPromise = setupApi('*/stock/symbol', { response });
        renderHook(() => useFinnHubSymbols({ exchange: 'US' }), { wrapper });
        const { request } = await apiPromise();
        expect(request.url.href).toBe('https://finnhub.io/api/v1/stock/symbol?exchange=US');
    });
    test('success', async () => {
        const response = { answer: 42 };
        setupApi('*/stock/symbol', { response });
        const { result } = renderHook(() => useFinnHubSymbols({ exchange: 'US' }), { wrapper });
        await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
        expect(result.current.error).toBeFalsy();
        expect(result.current.data).toEqual(response);
    });
    test('error', async () => {
        setupApi('*/stock/symbol', { status: 500 });
        const { result } = renderHook(() => useFinnHubSymbols({ exchange: 'US' }), { wrapper });
        await waitFor(() => expect(result.current.isError).toBeTruthy());
        await expect(result.current.error).toBeTruthy();
        expect(result.current.data).toEqual(undefined);
    });
});

describe('useFinnHubCandles', () => {
    test('throws w/ missing required symbol option', async () => {
        setupApi('*/stock/symbol');
        await expect(() => useFinnHubCandles({})).toThrow(/useFinnHubCandles: Missing 'symbol' string/);
    });
    test('throws w/ missing required from option', async () => {
        setupApi('*/stock/symbol');
        await expect(() => useFinnHubCandles({ symbol: 'APL' })).toThrow(/useFinnHubCandles: Missing 'from' date ms/);
    });
    test('throws w/ missing required to option', async () => {
        setupApi('*/stock/symbol');
        await expect(() => useFinnHubCandles({ symbol: 'APL', from: Date.now() })).toThrow(
            /useFinnHubCandles: Missing 'to' date ms/,
        );
    });
    test('url params created from options', async () => {
        const response = { answer: 42 };
        //  https://finnhub.io/api/v1/stock/symbol
        const apiPromise = setupApi('*/stock/candle', { response });
        const args = { symbol: 'APL', from: 1692525042233, to: 1692525042234 };
        renderHook(() => useFinnHubCandles(args), { wrapper });
        const { request } = await apiPromise();
        expect(request.url.href).toBe(
            'https://finnhub.io/api/v1/stock/candle?symbol=APL&from=1692525042233&to=1692525042234&resolution=1',
        );
    });
    test('success', async () => {
        const response = { answer: 42 };
        const args = { symbol: 'APL', from: 1692525042233, to: 1692525042234 };
        setupApi('*/stock/candle', { response });
        const { result } = renderHook(() => useFinnHubCandles(args), { wrapper });
        await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
        expect(result.current.error).toBeFalsy();
        expect(result.current.data).toEqual(response);
    });
    test('error', async () => {
        setupApi('*/stock/candle', { status: 500 });
        const args = { symbol: 'APL', from: 1692525042233, to: 1692525042234 };
        const { result } = renderHook(() => useFinnHubCandles(args), { wrapper });
        await waitFor(() => expect(result.current.isError).toBeTruthy());
        await expect(result.current.error).toBeTruthy();
        expect(result.current.data).toEqual(undefined);
    });
});
