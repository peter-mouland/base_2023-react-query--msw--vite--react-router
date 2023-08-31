import { cn } from '../design-system/lib/utils.ts';
import { useFinnHubCandles, useFinnHubSymbols } from '../services/finhub';
import { SymbolsComboBox } from '../components/symbols-combo-box';
import { useSymbols } from '../components/symbols-combo-box/utils.ts';
import { CalendarDateRangePicker } from '../components/date-range-picker';
import { useDate } from '../components/date-range-picker/utils.ts';
import { ChartCard } from '../components/chart-card';
import { Slots } from '../components/slots';

const MAX_SLOTS = 3;

function Dashboard() {
    const { filterFunction, params, updateSymbol } = useSymbols();
    const { params: dates } = useDate();
    const dateRange = {
        from: dates.dateFrom ? new Date(dates.dateFrom).getTime() : null,
        to: dates.dateTo ? new Date(dates.dateTo).getTime() : null,
    };

    const allSymbols = useFinnHubSymbols({ exchange: 'US', filter: filterFunction });
    const candles = useFinnHubCandles({ symbols: params.symbol, ...dateRange });
    const emptySlots = MAX_SLOTS - params.symbol.length;
    return (
        <div className="flex-col md:flex">
            <div className="border-b">
                <div className="flex h-16 items-center px-4">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                </div>
            </div>
            <div className="border-b">
                <div className="flex h-16 items-center px-4">
                    <div className="space-x-4" style={{ minWidth: '230px' }}>
                        {emptySlots === 0 ? (
                            <span className="text-slate-500">[max symbols selected]</span>
                        ) : allSymbols.data && emptySlots > 0 ? (
                            <SymbolsComboBox options={allSymbols.data?.length > 10 ? [] : allSymbols.data} />
                        ) : (
                            'loading...'
                        )}
                    </div>
                    <div className={cn('flex items-center space-x-4 lg:space-x-6')}>
                        <Slots slots={params.symbol} onClick={updateSymbol} maxSlots={MAX_SLOTS} />
                    </div>
                    <div className="ml-auto flex items-center space-x-4">
                        <CalendarDateRangePicker />
                    </div>
                </div>
            </div>
            <div className="flex flex-row">
                {candles.map((candle, i) => (
                    <div className="grow p-4" key={params.symbol[i]}>
                        <ChartCard
                            symbol={params.symbol[i]}
                            data={candle.data}
                            error={candle.error}
                            isLoading={candle.isLoading}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
