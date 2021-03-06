import React, { useState } from 'react'
import { useSetRecoilState } from 'recoil'
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
	useToast,
} from '@chakra-ui/react'
import { Redirect } from 'react-router-dom'
import { Flex, Stack } from '@chakra-ui/layout'
import Navbar from '../../components/general/Navbar'
import useProduct from '../../utils/hooks/useProduct'
import { HiShoppingCart } from 'react-icons/hi'
import cartState from './recoil/cart'

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

	const toast = useToast()
	const setCart = useSetRecoilState(cartState)
	const imageURL =
		!isLoading && product !== undefined ? product.product.fotos[0].foto : ''
	const name = !isLoading && product !== undefined ? product.product.name : ''

	const [numberOfPints, setNumberOfPints] = useState('1')
	const [size, setSize] = useState('sm')

	if (error) {
		console.log('Error fetching product')
		console.log(error)
	}

	const categoriesBadges =
		!isLoading && product !== undefined
			? product.categories.map(({ id, name }) => (
					<Badge
						borderRadius='full'
						px='2'
						colorScheme={getCategoryColor(name)}
						key={id}
					>
						{name}
					</Badge>
			  ))
			: null

	const addToCart = () => {
		toast({
			title: '¡Helado agregado!',
			description: 'El helado ha sido agregado a tu carrito exitosamente.',
			status: 'success',
			duration: 9000,
			isClosable: true,
		})

		let price = 0
		if (size === 'sm') {
			price = product.product.precios[0].price
		} else if (size === 'md') {
			price = product.product.precios[1].price
		} else {
			price = product.product.precios[2].price
		}
		const compoundID = id + size

		setCart((oldCart) => [
			...oldCart,
			{ name, imageURL, size, numberOfPints, id: compoundID, price },
		])
	}

	return (
		<Flex minH={"100vh"} w={"100%"} direction={"column"} align={"center"} justify={"center"}>
			{!isLoading && product === undefined ? (
				<Redirect to='/products' />
			) : (
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
									src={imageURL}
									objectFit='contain'
									alt={'Helado de ' + product.flavor}
									w='md'
									rounded='md'
									ml={4}
								/>
								<VStack>
									<Text fontSize='4xl'>{name}</Text>

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
												<Badge
													borderRadius='full'
													px='2'
													colorScheme={'yellow'}
												>
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
											<RadioGroup defaultValue='sm' onChange={setSize}>
												<Stack spacing={5} direction='row'>
													{product.product.precios[0] ? (
														<Radio colorScheme='green' value='sm'>
															Chico
														</Radio>
													) : null}
													{product.product.precios[1] ? (
														<Radio colorScheme='yellow' value='md'>
															Med
														</Radio>
													) : null}
													{product.product.precios[2] ? (
														<Radio colorScheme='pink' value='lg'>
															Grande
														</Radio>
													) : null}
												</Stack>
											</RadioGroup>
											<Box w='32'>
												<NumberInput
													defaultValue={1}
													min={1}
													max={25}
													size='md'
													onChange={setNumberOfPints}
												>
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
			)}
		</Flex>
	)
}

export default ProductDetail
