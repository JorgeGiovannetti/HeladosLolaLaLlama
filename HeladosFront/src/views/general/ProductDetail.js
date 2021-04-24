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
	RadioGroup,
	Radio,
	Icon,
	Link,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
} from '@chakra-ui/react'
import { Stack } from '@chakra-ui/layout'
import Navbar from '../../components/general/Navbar'
import useProduct from './hooks/useProduct'
import { HiShoppingCart } from 'react-icons/hi'

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

	const addToCart = () => {
		console.log('add to cart')
	}

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
							ml={4}
						/>
						<VStack>
							<Text fontSize='4xl'>{product.product.name}</Text>

							<HStack pb={8}>
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

							{/* Prices */}
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
							{/* Add to cart */}
							<Box pt={16}>
								<Stack
									direction={{ sm: 'column', lg: 'row' }}
									align='center'
									spacing={4}
								>
									<RadioGroup defaultValue='1'>
										<Stack spacing={5} direction='row'>
											{product.product.precios[0] ? (
												<Radio colorScheme='green' value='1'>
													Chico
												</Radio>
											) : null}
											{product.product.precios[1] ? (
												<Radio colorScheme='yellow' value='2'>
													Med
												</Radio>
											) : null}
											{product.product.precios[2] ? (
												<Radio colorScheme='pink' value='3'>
													Grande
												</Radio>
											) : null}
										</Stack>
									</RadioGroup>
									<Box w='32'>
										<NumberInput defaultValue={1} min={1} max={25} size='md'>
											<NumberInputField />
											<NumberInputStepper>
												<NumberIncrementStepper />
												<NumberDecrementStepper />
											</NumberInputStepper>
										</NumberInput>
									</Box>
								</Stack>
								<Link
									w='100%'
									m={8}
									rounded={'md'}
									_hover={{
										textDecoration: 'none',
									}}
									color={'white'}
									colorScheme={'black'}
									onClick={() => addToCart()}
								>
									<Center
										bg={'gray.800'}
										borderRadius='md'
										w={'100%'}
										padding={'3'}
										justifyContent={'center'}
									>
										<Text fontSize={'lg'} fontWeight={'bold'}>
											<Icon
												w={5}
												h={5}
												color='white'
												as={HiShoppingCart}
												mr={4}
											/>
											AGREGAR A CARRITO
										</Text>
									</Center>
								</Link>
							</Box>
						</VStack>
					</Stack>
				)}
			</Box>
		</>
	)
}

export default ProductDetail
