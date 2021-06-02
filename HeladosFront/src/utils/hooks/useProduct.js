import useSWR from "swr";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

function useProduct(id) {
  const { data, error } = useSWR(
    `https://lolalallama.herokuapp.com/api/helados/${id}`,
    fetcher
  );

  return {
    product: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export default useProduct;
