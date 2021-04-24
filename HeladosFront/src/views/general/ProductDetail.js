import React from 'react'
import { useParams } from 'react-router-dom'
import {
	Box,
	Center,
	HStack,
	Spinner,
	Image,
	Badge,
	Text,
	VStack,
} from '@chakra-ui/react'
import { Stack } from '@chakra-ui/layout'
import Navbar from '../../components/general/Navbar'
import useProduct from './hooks/useProduct'

const getCategoryColor = (name) => {
	switch (name) {
		case 'Tradicionales':
			return 'red'
		case 'PREMIUM':
			return 'yellow'
		case `HERSHEY's`:
			return 'blue'
		default:
			return 'orange'
	}
}

const ProductDetail = () => {
	const { id } = useParams()
	const { product, isLoading, error } = useProduct(id)

	if (error) {
		console.log('Error fetching product')
		console.log(error)
	}
	console.log('product info')
	console.log(product)

	const categoriesBadges = isLoading
		? null
		: product.categories.map(({ id, name }) => (
				<Badge
					borderRadius='full'
					px='2'
					colorScheme={getCategoryColor(name)}
					key={id}
				>
					{name}
				</Badge>
		  ))

	return (
		<>
			<Navbar />
			<Box mt={12}>
				{isLoading ? (
					<Center>
						<Spinner size='xl' color={'gray'} />
					</Center>
				) : (
					<Stack direction={{ sm: 'column', lg: 'row' }} spacing={16}>
						<Image
							src={product.product.fotos[0].foto}
							alt={'Helado de ' + product.flavor}
							w='md'
							rounded='md'
						/>
						<VStack>
							<Text fontSize='4xl'>{product.product.name}</Text>

							<HStack>
								{categoriesBadges}
								<Box
									color='gray.500'
									fontWeight='semibold'
									letterSpacing='wide'
									fontSize='xs'
									textTransform='uppercase'
									ml='2'
								>
									{product.flavor}
								</Box>
							</HStack>
							<Text fontSize='xl'>{product.product.description}</Text>

							<Stack direction={{ sm: 'column', lg: 'row' }}>
								{product.product.precios[0] ? (
									<Box>
										<Badge borderRadius='full' px='2' colorScheme={'green'}>
											Chico
										</Badge>{' '}
										${product.product.precios[0].price}
									</Box>
								) : null}
								{product.product.precios[1] ? (
									<Box>
										<Badge borderRadius='full' px='2' colorScheme={'yellow'}>
											Med
										</Badge>{' '}
										${product.product.precios[1].price}
									</Box>
								) : null}
								{product.product.precios[2] ? (
									<Box>
										<Badge borderRadius='full' px='2' colorScheme={'pink'}>
											Grande
										</Badge>{' '}
										${product.product.precios[2].price}
									</Box>
								) : null}
							</Stack>
						</VStack>
					</Stack>
				)}
			</Box>
		</>
	)
}

export default ProductDetail
