import React from 'react'
import { Box } from '@chakra-ui/react'
import Navbar from '../../components/general/Navbar'
import { SimpleGrid } from '@chakra-ui/layout'
import useProducts from './hooks/useProducts'
import Product from '../../components/general/Product'

const Products = () => {
	const { products, isLoading, error } = useProducts()
	if (error) {
		console.log('recevied error')
	}
	if (isLoading) {
		console.log('is loading')
	}
	if (products) {
		console.log('recevied products')
		console.log(products)
	}

	// const product = {
	// 	categories: {
	// 		name,
	// 		id,
	// 	},
	// 	flavor,
	// 	id,
	// 	name,
	// 	description,
	// 	imageURL,
	// }

	const componentsChild = !products ? (
		<Box></Box>
	) : (
		products.map((product) => <Product />)
	)

	return (
		<>
			<Navbar />

			<SimpleGrid minChildWidth='360px' gap={12} w='100%' p='8' mt={12}>
				{componentsChild}
			</SimpleGrid>
		</>
	)
}

export default Products
