import { useQuery } from '@tanstack/react-query';

const FINNHUB_KEY = 'cjg7469r01qohhhj96dgcjg7469r01qohhhj96e0';

export function queryFinnHubFn<T>(url: string): Promise<T> {
    if (typeof url === 'undefined') throw Error('queryFinnHubFn: Missing URL for fetch function');
    return fetch('https://finnhub.io/api/v1' + url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Finnhub-Token': FINNHUB_KEY,
        },
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

interface Stock {
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
export const useFinnHubSymbols = ({ exchange }: { exchange: string }) => {
    if (typeof exchange === 'undefined') throw Error('useFinnHubSymbols: Missing "exchange" string');
    // https://finnhub.io/api/v1/stock/symbol?exchange=US
    const queryStockFn = () => queryFinnHubFn<Stock>(`/stock/symbol?exchange=${exchange}`);
    return useQuery({ queryKey: ['finhub', 'stock', exchange], queryFn: queryStockFn });
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
export const useFinnHubCandles = ({ symbol, from, to, resolution = 1 }) => {
    if (typeof symbol === 'undefined') throw Error("useFinnHubCandles: Missing 'symbol' string");
    if (typeof from === 'undefined') throw Error("useFinnHubCandles: Missing 'from' date ms");
    if (typeof to === 'undefined') throw Error("useFinnHubCandles: Missing 'to' date ms");
    // https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=1&from=1679476980&to=1679649780
    const queryStockFn = () =>
        queryFinnHubFn<Candle>(`/stock/candle?symbol=${symbol}&from=${from}&to=${to}&resolution=${resolution}`);
    return useQuery({ queryKey: ['finhub', 'candle', symbol, from, to, resolution], queryFn: queryStockFn });
};
