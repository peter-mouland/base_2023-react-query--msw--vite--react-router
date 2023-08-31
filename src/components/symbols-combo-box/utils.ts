import { useParams, useSearchParams, generatePath, useNavigate } from 'react-router-dom';
import { StockSymbol } from '../../services/finhub';

export function useSymbols() {
    const { symbol = '' } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const symbolFilter = searchParams.get('symbolFilter')?.toUpperCase();
    const symbols = symbol.split(':').filter(Boolean).slice(0, 3).sort(); // max 3 symbols

    const filterFunction = (stocks: StockSymbol[]) =>
        stocks.filter((stock: { symbol: string }) => stock.symbol?.toUpperCase().startsWith(symbolFilter ?? ''));

    const updateSymbolFilter = (value: string) => {
        setSearchParams((prev) => ({ ...Object.fromEntries(prev), symbolFilter: value.toUpperCase() }));
    };

    const updateSymbol = (value: string) => {
        const newSelection = symbols.find((c) => c === value)
            ? symbols.filter((c) => c !== value)
            : [...new Set([...symbols, value].filter(Boolean).sort())]; // sot to reduce url combinations and make it more predictable
        const path = generatePath('/:symbol/' + location.search, { symbol: newSelection.join(':') });
        navigate(path);
    };

    return { params: { symbolFilter, symbol: symbols }, filterFunction, updateSymbolFilter, updateSymbol };
}
