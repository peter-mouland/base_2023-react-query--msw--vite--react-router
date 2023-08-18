import { useQuery } from '@tanstack/react-query';

type ValueOf<T> = T[keyof T];

const stock = { symbols: 'stock-symbols', candles: 'stock-candles' };
type Stock = ValueOf<stock>;

const queryFn = (url: string) => {
    const res = await fetch(url);
    return res.json();
};

// re-usable core hook to be re-used for all FinnHub api integrations
export const useQueryFinnHub = ({ stock }: { stock: Stock }) => {
    const queryFinHubFn = queryFn('https://finnhub.io/docs/api#' + stock);
    return useQuery({ queryKey: ['finhub', stock], queryFn: queryFinHubFn });
};

export const useFinnHubSymbols = () => {
    return useQueryFinnHub({ stock: stock.symbols });
};
export const useFinnHubCandles = () => {
    return useQueryFinnHub({ stock: stock.candles });
};
