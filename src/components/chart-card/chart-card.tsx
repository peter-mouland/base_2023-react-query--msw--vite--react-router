import * as React from 'react';
import { Chart } from 'react-charts';
import type { DefaultError } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '../../design-system/ui/card.tsx';
import type { Candles } from '../../services/finhub';

export function LineChart({ data }: { data: Candles[] }) {
    const primaryAxis = React.useMemo(() => ({ getValue: (datum: Candles) => new Date(datum.t) }), []);
    const secondaryAxes = React.useMemo(() => [{ getValue: (datum: Candles) => datum.c }], []);

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

interface ChartCardProps {
    data?: Candles[];
    symbol: string;
    error: DefaultError | null;
    isLoading?: boolean;
}

export function ChartCard({ symbol, data, error, isLoading }: ChartCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stocks: {symbol}</CardTitle>
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
                    {data?.length > 0 ? (
                        <LineChart
                            data={[
                                {
                                    data,
                                    label: symbol + ' Close Price',
                                },
                            ]}
                        />
                    ) : error ? (
                        <span>Error: {error.message}</span>
                    ) : isLoading ? (
                        <span>Loading...</span>
                    ) : (
                        <span>
                            Please select a stock <em>and</em> a date range ...
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
