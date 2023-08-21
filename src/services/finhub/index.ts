import { useQuery, useQueries } from '@tanstack/react-query';

import { Exchange } from './types/exchanges.ts';

const FINNHUB_KEY = 'cjg7469r01qohhhj96dgcjg7469r01qohhhj96e0';

const applyToken = (url) => {
    const [start = '', hash] = url.split('#');
    const end = hash ? '#' + hash : '';
    if (start.includes('?')) {
        return start + '&token=' + FINNHUB_KEY + end;
    } else {
        return start + '?token=' + FINNHUB_KEY + end;
    }
};
export function queryFinnHubFn<T>(url: string): Promise<T> {
    if (typeof url === 'undefined') throw Error('queryFinnHubFn: Missing URL for fetch function');
    return fetch('https://finnhub.io/api/v1' + applyToken(url), {
        method: 'GET',
        //  use headers when in prod to remove KEY from url
        // headers: {
        // 'Content-Type': 'application/json',
        // 'X-Finnhub-Token': FINNHUB_KEY,
        // },
    }).then((response) => {
        if (response.ok) {
            // 1xx: Informational
            // 2xx: Success
            // 3xx: Redirection
            return response.json() as T;
        } else {
            // 4xx: Client errors
            // 5xx: Server errors
            return Promise.reject(new Error('queryFinnHubFn: Fetch Error ' + response.status));
        }
    });
}

export interface StockSymbol {
    currency: string; // "USD",
    description: string; // "INDIEPUB ENTERTAINMENT INC",
    displaySymbol: string; // "IPUB",
    figi: string; // "BBG000PHSCM3",
    mic: string; // "OOTC",
    shareClassFIGI: string; // "BBG001SR2K91",
    symbol: string; // "IPUB",
    symbol2: string; // "",
    type: string; // "Common Stock"
}

export const useFinnHubSymbols = ({ exchange, filter }: { exchange: Exchange; filter?: () => string }) => {
    if (typeof exchange === 'undefined') throw Error('useFinnHubSymbols: Missing "exchange" string');
    // https://finnhub.io/api/v1/stock/symbol?exchange=US
    const queryStockFn = () => queryFinnHubFn<StockSymbol[]>(`/stock/symbol?exchange=${exchange}`);
    return useQuery({
        queryKey: ['finhub', 'stock', exchange],
        queryFn: queryStockFn,
        select: filter,
    });
};

interface Candle {
    c: number[];
    h: number[];
    l: number[];
    o: number[];
    t: number[]; // date in ms since epoch
    v: number[];
    s: 'ok';
}

let count = 0;
export const useFinnHubCandles = ({ symbols, from, to, resolution = 'W' }) => {
    if (typeof symbols === 'undefined') throw Error("useFinnHubCandles: Missing 'symbols' string[]");
    if (typeof from === 'undefined') throw Error("useFinnHubCandles: Missing 'from' date ms");
    if (typeof to === 'undefined') throw Error("useFinnHubCandles: Missing 'to' date ms");
    // https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=1&from=1679476980&to=1679649780
    const queryStockFn = (symbol) =>
        queryFinnHubFn<Candle>(`/stock/candle?symbol=${symbol}&from=${from}&to=${to}&resolution=${resolution}`);

    const result = useQueries({
        queryFn: (...args) => console.log(...args) || queryStockFn(symbol),
        queries: symbols.map((symbol) => {
            return {
                queryKey: ['finhub', 'candle', from, to, resolution, symbol],
                queryFn: (...args) => console.log(...args) || queryStockFn(symbol),
                staleTime: Infinity,
                retry: 1, // Will retry failed requests 10 times before displaying an error
                enabled: symbols && from && to && count < 100, //symbols && symbols.length > 0,
                select: (candles) =>
                    candles.c?.map((c, i) => ({
                        c,
                        h: candles.h[i],
                        l: candles.l[i],
                        o: candles.o[i],
                        t: candles.t[i],
                        v: candles.v[i],
                    })),
            };
        }),
    });
    count++;
    return result;
};
