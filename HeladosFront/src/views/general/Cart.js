import React from 'react'
import { useSetRecoilState, useRecoilState } from 'recoil'
import {
	Box,
	Text,
	IconButton,
	Divider,
	Flex,
	Center,
	Image,
	Stack,
	Link,
	Badge,
	Heading,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
} from '@chakra-ui/react'
import Navbar from '../../components/general/Navbar'
import cartState from './recoil/cart'
import { HiOutlineX } from 'react-icons/hi'

const Cart = () => {
	const cart = useRecoilState(cartState)

	const setCart = useSetRecoilState(cartState)
	let total = 0

	const products = cart[0].map(
		({ name, imageURL, size, numberOfPints, id, price }) => {
			const setNewNumberOfPints = (newNumOfPints) => {
				setCart((oldCart) => {
					let newCart = [...oldCart]
					const index = newCart.findIndex((product) => product.id === id)
					newCart[index] = {
						name,
						imageURL,
						size,
						numberOfPints: newNumOfPints,
						id,
						price,
					}
					return newCart
				})
			}

			total += numberOfPints * price

			const removeProduct = () => {
				setCart((oldCart) => [
					...oldCart.filter((product) => product.id !== id),
				])
			}

			const sizeBadge = (
				<Badge
					borderRadius='full'
					px='2'
					colorScheme={
						size === 'sm' ? 'green' : size === 'md' ? 'yellow' : 'pink'
					}
					key={id}
					mr={4}
				>
					{size === 'sm' ? 'Chico' : size === 'md' ? 'Med' : 'Grande'}
				</Badge>
			)
			return (
				<Box key={id} w='100%'>
					<Flex justify='space-around' w='100%' align='center' m={4}>
						<Link
							href={`products/${id.slice(0, id.length - 2)}`}
							_hover={{
								textDecoration: 'none',
							}}
						>
							<Stack
								direction={{ sm: 'column', lg: 'row' }}
								spacing={8}
								align='center'
							>
								<Image src={imageURL} alt={name} rounded='md' ml={4} w={24} />
								<Text fontSize='lg'>{name}</Text>
							</Stack>
						</Link>
						{sizeBadge}
						<Box w={{ sm: '16', lg: '32' }} mx={{ sm: '0', lg: '12' }}>
							<NumberInput
								defaultValue={numberOfPints}
								min={1}
								max={25}
								size='md'
								onChange={setNewNumberOfPints}
							>
								<NumberInputField />
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
						</Box>

						<Stack
							direction='row'
							align='center'
							spacing={{ sm: '4', lg: '16' }}
						>
							<Text fontSize='md'>${price}</Text>
							<IconButton
								aria-label='Delete product'
								icon={<HiOutlineX />}
								variant='unstyled'
								onClick={removeProduct}
							/>
						</Stack>
					</Flex>
					<Divider />
				</Box>
			)
		}
	)

	return (
		<>
			<Navbar />
			<Box w='100%' p={8} justifyContent='center'>
				{cart[0].length === 0 ? (
					<Center>
						<Heading as='h3' size='lg'>
							Tu carrito está vacio...
						</Heading>
					</Center>
				) : (
					<>
						<Text fontSize={'3xl'} m={8}>
							Carrito
						</Text>
						<Center>
							<Flex justify='space-between' w='75%'>
								<Text
									color='gray.500'
									fontWeight='semibold'
									letterSpacing='wide'
									textTransform='uppercase'
									fontSize='sm'
								>
									Producto
								</Text>
								<Text
									color='gray.500'
									fontWeight='semibold'
									letterSpacing='wide'
									textTransform='uppercase'
									fontSize='sm'
								>
									Tamaño
								</Text>
								<Text
									color='gray.500'
									fontWeight='semibold'
									letterSpacing='wide'
									textTransform='uppercase'
									fontSize='sm'
								>
									Cantidad
								</Text>
								<Text
									color='gray.500'
									fontWeight='semibold'
									letterSpacing='wide'
									textTransform='uppercase'
									fontSize='sm'
								>
									Precio
								</Text>
							</Flex>
						</Center>
						<Divider />
						<Center flexDir='column'>{products}</Center>

						<Box
							w={{ sm: '100%', lg: '40%' }}
							float='right'
							mt={8}
							pr={{ sm: '0', lg: '98' }}
						>
							<Flex dir='row' justify='space-between'>
								<Text
									color='gray.500'
									fontWeight='semibold'
									letterSpacing='wide'
									textTransform='uppercase'
									fontSize='sm'
								>
									Subtotal
								</Text>
								<Text fontSize='lg'>${total}</Text>
							</Flex>
							<Link
								w='100%'
								m={8}
								rounded={'md'}
								_hover={{
									textDecoration: 'none',
								}}
								color={'white'}
								colorScheme={'black'}
								href='Checkout'
							>
								<Center
									bg={'gray.800'}
									borderRadius='md'
									w={'100%'}
									padding={'3'}
									justifyContent={'center'}
								>
									<Text fontSize={'lg'} fontWeight={'bold'}>
										CHECKOUT
									</Text>
								</Center>
							</Link>
						</Box>
					</>
				)}
			</Box>
		</>
	)
}

export default Cart
