import React from 'react'
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
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
} from '@chakra-ui/react'
import Navbar from '../../components/general/Navbar'
import { useRecoilState } from 'recoil'
import cartState from './recoil/cart'
import { HiOutlineX } from 'react-icons/hi'

const Cart = () => {
	const cart = useRecoilState(cartState)
	console.log('reading cart')
	console.log(cart)
	// localStorage.removeItem('cart')

	const products = cart[0].map(
		({ name, imageURL, size, numberOfPints, id, price }) => {
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
				<>
					<Flex justify='space-around' key={id} w='100%' align='center' m={4}>
						<Link
							href={`products/${id}`}
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
								<Text fontSize='md'>{name}</Text>
							</Stack>
						</Link>
						{sizeBadge}
						<Box w={{ sm: '16', lg: '32' }} mx={{ sm: '0', lg: '12' }}>
							<NumberInput
								defaultValue={numberOfPints}
								min={1}
								max={25}
								size='md'
								// onChange={setNumberOfPints}
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
							/>
						</Stack>
					</Flex>
					<Divider />
				</>
			)
		}
	)

	console.log(products)

	return (
		<>
			<Navbar />
			<Box w='100%' p={8} justifyContent='center'>
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
				<Divider />
			</Box>
		</>
	)
}

export default Cart
