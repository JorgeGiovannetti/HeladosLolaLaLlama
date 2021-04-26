import React from 'react'
import {
	Box,
	Center,
	Stack,
	Heading,
	Text,
	Flex,
	Divider,
	Image,
	Link,
} from '@chakra-ui/react'
import Navbar from '../../components/general/Navbar'
import { useSetRecoilState, useRecoilState } from 'recoil'
import cartState from './recoil/cart'

const Checkout = () => {
	const cart = useRecoilState(cartState)

	const setCart = useSetRecoilState(cartState)

	let total = 0

	const products = cart[0].map(
		({ name, imageURL, size, numberOfPints, id, price }) => {
			total += numberOfPints * price
			return (
				<>
					<Center>
						<Flex
							justify='space-between'
							key={id}
							w='80%'
							align='center'
							my={2}
						>
							<Link
								href={`products/${id}`}
								_hover={{
									textDecoration: 'none',
								}}
							>
								<Stack direction='row' spacing={8} align='center'>
									<Image src={imageURL} alt={name} rounded='md' ml={4} w={12} />
									<Text fontSize='lg'>
										{name} <b>x{numberOfPints}</b>
									</Text>
								</Stack>
							</Link>
							<Text fontSize='lg'>${numberOfPints * price}</Text>
						</Flex>
					</Center>
					<Divider />
				</>
			)
		}
	)

	return (
		<>
			<Navbar />
			{cart[0].length === 0 ? (
				<Center>
					<Heading as='h3' size='lg'>
						Tu carrito está vacio...
					</Heading>
				</Center>
			) : (
				<Stack
					direction={{ sm: 'column', lg: 'row' }}
					spacing={8}
					align='center'
					w='100%'
					p={8}
				>
					{/* Input fields */}
					<Box w={{ sm: '100%', lg: '50%' }}>
						<Text fontSize='xl' mb={4}>
							Detalles de entrega
						</Text>
					</Box>
					{/* Order details */}
					<Box
						borderWidth='1px'
						borderRadius='lg'
						p={8}
						w={{ sm: '100%', lg: '50%' }}
					>
						<Text fontSize='xl' mb={4}>
							Tu orden
						</Text>
						<Center>
							<Flex justify='space-between' w='80%'>
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
									Total
								</Text>
							</Flex>
						</Center>
						<Divider />
						{products}
						<Center>
							<Stack
								direction='row'
								justify='flex-end'
								w='80%'
								spacing={8}
								align='center'
								mt={8}
							>
								<Text
									color='gray.500'
									fontWeight='semibold'
									letterSpacing='wide'
									textTransform='uppercase'
									fontSize='sm'
								>
									Total
								</Text>
								<Text fontSize='lg'>${total}</Text>
							</Stack>
						</Center>
					</Box>
				</Stack>
			)}
		</>
	)
}

export default Checkout
