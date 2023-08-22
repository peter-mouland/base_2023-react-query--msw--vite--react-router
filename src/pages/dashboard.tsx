import * as React from 'react';

import { cn } from '../design-system/lib/utils.ts';
import { SymbolsComboBox } from '../components/symbols-combo-box.tsx';
import { useSymbols } from '../components/symbols-combo-box.utils.ts';
import { CalendarDateRangePicker } from '../components/date-range-picker.tsx';
import { useDate } from '../components/date-range-picker.utils.ts';
import { useFinnHubCandles, useFinnHubSymbols } from '../services/finhub';
import { ChartCard } from '../components/chart-card.tsx';

function Dashboard() {
    const { filterFunction, params, updateSymbol } = useSymbols();
    const { params: dates } = useDate();
    const dateRange = {
        from: new Date(dates.dateFrom).getTime(),
        to: new Date(dates.dateTo).getTime(),
    };

    const allSymbols = useFinnHubSymbols({ exchange: 'US', filter: filterFunction });
    const candles = useFinnHubCandles({ symbols: params.symbol, ...dateRange });
    const emptySlots = Array(Math.max(3 - params.symbol.length)).fill('empty');
    return (
        <div className="flex-col md:flex">
            <div className="border-b">
                <div className="flex h-16 items-center px-4">
                    <div className={cn('flex items-center space-x-4 lg:space-x-6')}>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    </div>
                </div>
            </div>
            <div className="border-b">
                <div className="flex h-16 items-center px-4">
                    <div className="space-x-4" style={{ minWidth: '230px' }}>
                        {emptySlots.length === 0 ? (
                            <span className="text-slate-500">[max symbols selected]</span>
                        ) : allSymbols.data && emptySlots.length > 0 ? (
                            <SymbolsComboBox options={allSymbols.data?.length > 10 ? [] : allSymbols.data} />
                        ) : (
                            'loading...'
                        )}
                    </div>
                    <div className={cn('flex items-center space-x-4 lg:space-x-6')}>
                        <div className={cn('flex items-center space-x-4 lg:space-x-6')}>
                            {params.symbol.map((selection) => (
                                <button
                                    key={selection}
                                    className="text-sm font-medium transition-colors hover:text-primary bg-purple-100 rounded px-2"
                                    onClick={() => updateSymbol(selection)}
                                >
                                    <span className="text-slate-500">x</span> {selection}
                                </button>
                            ))}
                            {emptySlots.map((_, i) => (
                                <span
                                    key={i}
                                    className="text-sm font-medium transition-colors hover:text-primary bg-purple-50 rounded px-2"
                                >
                                    <span className="text-slate-300">empty slot</span>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="ml-auto flex items-center space-x-4">
                        <CalendarDateRangePicker />
                    </div>
                </div>
            </div>
            <div className="flex-1 space-y-4 pt-6">
                <div className="space-y-4">
                    <div className="flex">
                        {candles.map((candle, i) => {
                            return (
                                <React.Fragment key={params.symbol[i]}>
                                    <div className="grow p-4">
                                        <ChartCard
                                            symbol={params.symbol[i]}
                                            data={candle.data}
                                            error={candle.error}
                                            isLoading={candle.isLoading}
                                        />
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
