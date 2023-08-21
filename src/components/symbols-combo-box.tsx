import * as React from 'react';
import { useParams, useSearchParams, generatePath, useNavigate } from 'react-router-dom';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from 'src/lib/utils';
import { Button } from 'src/design-system/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from 'src/design-system/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from 'src/design-system/ui/popover';
import type { StockSymbol } from '../services/finhub';

type Options = StockSymbol[];

export function useSymbols() {
    const { symbol = '' } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const symbolFilter = searchParams.get('symbolFilter')?.toUpperCase();
    const symbols = symbol.split(':').filter(Boolean);

    // "return a filter Function" vs "return a filter String"
    // Decision: Return Function, which increases flexibility, but also increases complexity (but only slightly).
    // Reason: 'useFinnHubSymbols' should be reusable and extensible without increasing API footprint
    // Revisit: When more filter functions are _too_ complex.
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
        // setSearchParams({ symbolFilter: symbolFilter, symbol: newSelection });
    };

    return { params: { symbolFilter, symbol: symbols }, filterFunction, updateSymbolFilter, updateSymbol };
}

export function SymbolsComboBox({ options }: { options: Options }) {
    const [open, setOpen] = React.useState(false);
    const { params, updateSymbol, updateSymbolFilter } = useSymbols(); // dog food our public API
    const emptyLabel = options.data?.length === 0 ? 'No Symbol found.' : 'Too many Symbols, please filter further';
    const label = 'Select Symbol...';

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                    {params.symbol.length ? params.symbolFilter : label}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command shouldFilter={false}>
                    <CommandInput placeholder={label} value={params.symbolFilter} onValueChange={updateSymbolFilter} />
                    <CommandList>
                        <CommandEmpty>{emptyLabel}</CommandEmpty>
                        <CommandGroup key={params.symbolFilter}>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.symbol}
                                    onSelect={(currentValue) => {
                                        updateSymbol(currentValue.toUpperCase());
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            params.symbol.find((value) => value === option.symbol)
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                        )}
                                    />
                                    {option.displaySymbol}
                                    {/*<strong>{option.displaySymbol}</strong>: {option.description}*/}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
