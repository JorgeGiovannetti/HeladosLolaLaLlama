import React from 'react'
import { Box } from '@chakra-ui/react'
import Navbar from '../../components/general/Navbar'
import { useRecoilState } from 'recoil'
import cartState from './recoil/cart'

const Cart = () => {
	const cart = useRecoilState(cartState)
	console.log('reading cart')
	console.log(cart)
	// localStorage.removeItem('cart')

	return (
		<>
			<Navbar />
			<Box>Cart</Box>
		</>
	)
}

export default Cart
