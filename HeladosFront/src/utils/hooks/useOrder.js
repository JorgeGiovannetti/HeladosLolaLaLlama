import useSWR from 'swr'
import axiosClient from '../providers/AxiosClient'

const fetcher = (url) => axiosClient.get(url).then((res) => res.data)

const useOrder = (id) => {
	const { data, error } = useSWR(`/orders/${id}`, fetcher)

	return {
		order: data,
		isLoading: !error && !data,
		isError: error,
	}
}

export default useOrder
