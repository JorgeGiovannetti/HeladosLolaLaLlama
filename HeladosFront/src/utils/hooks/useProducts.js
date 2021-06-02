import useSWR from 'swr'
const fetcher = (...args) => fetch(...args).then((res) => res.json())

function useProducts() {
	const { data, error } = useSWR(
		'https://lolalallama.herokuapp.com/api/helados',
		fetcher
	)

	return {
		products: data,
		isLoading: !error && !data,
		isError: error,
	}
}

export default useProducts
