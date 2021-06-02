import useSWR from 'swr';
import axiosClient from '../providers/AxiosClient';

const fetcher = url => axiosClient.get(url).then(res => res.data)


const useOrders = () => {
    const { data, error } = useSWR('/orders', fetcher)

    return {
        orders: data,
        isLoading: !error && !data,
        isError: error,
    }
}


export default useOrders;