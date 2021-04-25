import React from 'react'
import { Box, Text, IconButton, Divider, Flex, Center } from '@chakra-ui/react'
import Navbar from '../../components/general/Navbar'
import { useRecoilState } from 'recoil'
import cartState from './recoil/cart'

const Cart = () => {
	const cart = useRecoilState(cartState)
	console.log('reading cart')
	console.log(cart)
	// localStorage.removeItem('cart')

	const products = <Text>HIII</Text>

	return (
		<>
			<Navbar />
			<Box w='100%' p={8} justifyContent='center'>
				<Text fontSize={'3xl'} m={8}>
					Carrito
				</Text>
				<Center>
					<Flex justify='space-between' w='70%'>
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
				{products}
				<Divider />
			</Box>
		</>
	)
}

export default Cart
