import { useParams, useSearchParams, generatePath, useNavigate } from 'react-router-dom';

export function useSymbols() {
    const { symbol = '' } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const symbolFilter = searchParams.get('symbolFilter')?.toUpperCase();
    const symbols = symbol.split(':').filter(Boolean).slice(0, 3); // max 3 symbols

    const filterFunction = (stocks) => stocks.filter((stock) => stock.symbol?.toUpperCase().startsWith(symbolFilter));

    const updateSymbolFilter = (value) => {
        setSearchParams((prev) => ({ ...Object.fromEntries(prev), symbolFilter: value.toUpperCase() }));
    };

    const updateSymbol = (value) => {
        const newSelection = symbols.find((c) => c === value)
            ? symbols.filter((c) => c !== value)
            : [...new Set([...symbols, value].filter(Boolean).sort())]; // sot to reduce url combinations and make it more predictable
        const path = generatePath('/:symbol/' + location.search, { symbol: newSelection.join(':') });
        navigate(path);
    };

    return { params: { symbolFilter, symbol: symbols }, filterFunction, updateSymbolFilter, updateSymbol };
}
