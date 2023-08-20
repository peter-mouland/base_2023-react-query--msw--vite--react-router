import { cn } from 'src/lib/utils';
import { SymbolsComboBox, useSymbols } from './components/symbols-combo-box';
import { Card, CardContent, CardHeader, CardTitle } from './design-system/ui/card';
import { CalendarDateRangePicker } from './design-system/ui/date-range-picker.tsx';
import { useFinnHubSymbols } from './services/finhub';

function App() {
    const { filterFunction, params, updateSymbol } = useSymbols();

    // "Fetch data at page level" vs "within components"
    // Decision: Page level, which forces more upfront thinking about interactions, but long-term simplicity is achieved
    // Reason: keeping component dumb for as long as possible makes extending capabilities easier
    // Revisit: When it becomes prohibitive. Whiteboard problem to reduce complexity before undoing
    const results = useFinnHubSymbols({ exchange: 'US', filter: filterFunction });
    const options = results.data?.length > 10 ? [] : results.data;
    const emptySlots = Array(Math.max(3 - params.symbol.length)).fill('empy');
    return (
        <>
            <div className="flex-col md:flex">
                <div className="border-b">
                    <div className="flex h-16 items-center px-4">
                        <div className={cn('flex items-center space-x-4 lg:space-x-6')}>
                            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        </div>

                        <div className="ml-auto flex items-center space-x-4">
                            {results.data ? <SymbolsComboBox options={options} /> : 'loading...'}
                        </div>
                    </div>
                </div>
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="flex items-center justify-between space-y-2">
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
                        <div className="flex items-center space-x-2">
                            <CalendarDateRangePicker />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Active Now</CardTitle>
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
                                    <div className="text-2xl font-bold">+573</div>
                                    <p className="text-xs text-muted-foreground">+201 since last hour</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
