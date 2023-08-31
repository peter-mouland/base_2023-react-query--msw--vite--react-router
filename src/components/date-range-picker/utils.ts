import { useSearchParams } from 'react-router-dom';
import type { DateRange } from 'react-day-picker';

export function useDate() {
    const [searchParams, setSearchParams] = useSearchParams();
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const updateDateFilter = (value: DateRange | undefined) => {
        setSearchParams((prev) => ({
            ...Object.fromEntries(prev),
            dateFrom: value?.from ? value?.from.getTime() : '',
            dateTo: value?.to ? value?.to.getTime() : '',
        }));
    };

    return {
        params: {
            dateFrom: dateFrom ? new Date(parseInt(dateFrom, 10)) : undefined,
            dateTo: dateTo ? new Date(parseInt(dateTo, 10)) : undefined,
        },
        updateDateFilter,
    };
}
