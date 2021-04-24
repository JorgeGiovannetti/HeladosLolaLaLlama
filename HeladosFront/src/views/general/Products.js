import React from 'react'
import { Spinner } from '@chakra-ui/react'
import Navbar from '../../components/general/Navbar'
import { Center, SimpleGrid } from '@chakra-ui/layout'
import useProducts from './hooks/useProducts'
import Product from '../../components/general/Product'

const Products = () => {
	const { products, isLoading, error } = useProducts()

	if (error) {
		console.log('Error fetching products')
		console.log(error)
	}

	const componentsChild = isLoading ? (
		<Center>
			<Spinner size='xl' color={'gray'} />
		</Center>
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
