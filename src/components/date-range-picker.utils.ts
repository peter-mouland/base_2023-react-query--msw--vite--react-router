import { useSearchParams } from 'react-router-dom';

export function useDate() {
    const [searchParams, setSearchParams] = useSearchParams();
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    const updateDateFilter = (value) => {
        setSearchParams((prev) => ({
            ...Object.fromEntries(prev),
            dateFrom: value?.from ? new Date(value?.from).getTime() : '',
            dateTo: value?.to ? new Date(value?.to).getTime() : '',
        }));
    };

    return {
        params: {
            dateFrom: dateFrom ? new Date(parseInt(dateFrom, 10)) : null,
            dateTo: dateTo ? new Date(parseInt(dateTo, 10)) : null,
        },
        updateDateFilter,
    };
}
