import React from 'react'
import { useParams } from 'react-router-dom'
import { Box, Center, Spinner } from '@chakra-ui/react'
import Navbar from '../../components/general/Navbar'
import useProduct from './hooks/useProduct'

const ProductDetail = () => {
	const { id } = useParams()
	const { product, isLoading, error } = useProduct(id)

	if (error) {
		console.log('Error fetching product')
		console.log(error)
	}
	console.log('product info')
	console.log(product)

	return (
		<>
			<Navbar />
			<Box>
				{isLoading ? (
					<Center>
						<Spinner size='xl' color={'gray'} />
					</Center>
				) : null}
				Detail for product with id: {id}
			</Box>
		</>
	)
}

export default ProductDetail
