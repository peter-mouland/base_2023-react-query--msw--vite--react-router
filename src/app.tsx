import * as React from 'react';
import { Chart } from 'react-charts';

import { cn } from 'src/lib/utils';
import { SymbolsComboBox, useSymbols } from './components/symbols-combo-box';
import { Card, CardContent, CardHeader, CardTitle } from './design-system/ui/card';
import { CalendarDateRangePicker } from './components/date-range-picker.tsx';
import { useDate } from './components/date-range-picker.utils.ts';
import { useFinnHubCandles, useFinnHubSymbols } from './services/finhub';

function MyChart({ data }: { data: array }) {
    const primaryAxis = React.useMemo(() => ({ getValue: (datum) => new Date(datum.t) }), []);
    const secondaryAxes = React.useMemo(() => [{ getValue: (datum) => datum.c, elementType: 'line' }], []);

    return (
        <Chart
            options={{
                data,
                primaryAxis,
                secondaryAxes,
            }}
        />
    );
}

function App() {
    const { filterFunction, params, updateSymbol } = useSymbols();
    const { params: dates } = useDate();
    const dateRange = {
        from: new Date(dates.dateFrom).getTime(),
        to: new Date(dates.dateTo).getTime(),
    };

    // "Fetch data at page level" vs "within components"
    // Decision: Page level, which forces more upfront thinking about interactions, but long-term simplicity is achieved
    // Reason: keeping component dumb for as long as possible makes extending capabilities easier
    // Revisit: When it becomes prohibitive. Whiteboard problem to reduce complexity before undoing
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
                            const chartData = {
                                label: 'Candles',
                                data: [
                                    {
                                        data: candle.data,
                                        label: params.symbol[i] + ' Close Price',
                                    },
                                ],
                            };
                            return (
                                <React.Fragment key={params.symbol[i]}>
                                    <div className="grow p-4">
                                        <Card>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">
                                                    Stocks: {params.symbol[i]}
                                                </CardTitle>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    className="h-4 w-4 text-muted-foreground"
                                                >
                                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                                </svg>
                                            </CardHeader>
                                            <CardContent>
                                                <div style={{ height: 500 }}>
                                                    {candle?.data?.length > 0 ? (
                                                        <MyChart data={chartData.data} />
                                                    ) : candle?.isError ? (
                                                        <span>Error: {candle?.error?.message}</span>
                                                    ) : candle?.isLoading ? (
                                                        <span>Loading...</span>
                                                    ) : (
                                                        <span>
                                                            Please select a stock <em>and</em> a date range ...
                                                        </span>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
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

export default App;
