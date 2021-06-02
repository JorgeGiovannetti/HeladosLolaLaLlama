import useSWR from 'swr';
import axiosClient from '../providers/AxiosClient';

const fetcher = url => axiosClient.get(url).then(res => res.data);

const useStats = () => {
    const { data: lastMonth, error: lastMonthError } = useSWR('/orders/lastMonthOrders', fetcher);
    const { data: lastMonthPaid, error: lastMonthPaidError } = useSWR('/orders/lastMonthPaidOrders', fetcher);
    const { data: lastMonthProfits, error: lastMonthProfitsError} = useSWR('/orders/profitsLastMonth', fetcher);
    const { data: numberPaidOrdersLastMonth, error: numberPaidOrdersLastMonthError } = useSWR('/orders/numberPaidOrdersLastMonth', fetcher);

    const data = {
        lastMonth,
        lastMonthPaid,
        lastMonthProfits,
        numberPaidOrdersLastMonth,
    }
    const error = lastMonthError || lastMonthPaidError || lastMonthProfitsError || numberPaidOrdersLastMonthError


    return {
        data: data,
        isLoading: !data && !error,
        error: error
    }
}


export default useStats;