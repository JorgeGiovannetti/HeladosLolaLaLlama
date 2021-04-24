import React from 'react'
import { Box } from '@chakra-ui/react'
import Navbar from '../../components/general/Navbar'
import { SimpleGrid } from '@chakra-ui/layout'
import useProducts from './hooks/useProducts'
import Product from '../../components/general/Product'

const Products = () => {
	const { products, isLoading, error } = useProducts()

	if (error) {
		console.log('Error fetching data')
		console.log(error)
	}

	const componentsChild = isLoading ? (
		<Box></Box>
	) : (
		products.map(({ categories, flavor, id, product }) => (
			<Product
				categories={categories}
				flavor={flavor}
				product={product}
				id={id}
				key={id}
			/>
		))
	)

	return (
		<>
			<Navbar />
			<SimpleGrid minChildWidth='360px' gap={12} w='100%' p='12' mt={12}>
				{componentsChild}
			</SimpleGrid>
		</>
	)
}

export default Products
