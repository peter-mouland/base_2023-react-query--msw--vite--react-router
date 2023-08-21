import * as React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';

import { cn } from 'src/lib/utils';
import { Button } from 'src/design-system/ui/button';
import { Calendar } from 'src/design-system/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from 'src/design-system/ui/popover';
import { useDate } from './date-range-picker.utils.ts';

// eslint-disable-next-line react/prop-types
export function CalendarDateRangePicker({ className }: React.HTMLAttributes<HTMLDivElement>) {
    const { params, updateDateFilter } = useDate(); // dog food our public API
    return (
        <div className={cn('grid gap-2', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={'outline'}
                        className={cn(
                            'w-[260px] justify-start text-left font-normal',
                            !params && 'text-muted-foreground',
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {params?.dateFrom ? (
                            params.dateTo ? (
                                <>
                                    {format(params.dateFrom, 'LLL dd, y')} - {format(params.dateTo, 'LLL dd, y')}
                                </>
                            ) : (
                                format(params.dateFrom, 'LLL dd, y')
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={params?.dateFrom}
                        selected={{ from: params?.dateFrom, to: params?.dateTo }}
                        onSelect={updateDateFilter}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
