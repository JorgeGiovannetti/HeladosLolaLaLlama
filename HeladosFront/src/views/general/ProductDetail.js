import React from 'react'
import { useParams } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import Navbar from '../../components/general/Navbar'

const ProductDetail = () => {
	const { id } = useParams()

	return (
		<>
			<Navbar />
			<Box>Detail for product with id: {id}</Box>
		</>
	)
}

export default ProductDetail
