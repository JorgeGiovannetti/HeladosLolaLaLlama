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
	Badge,
	Textarea,
	Input,
	InputLeftElement,
	InputGroup,
	Alert,
	AlertIcon,
} from '@chakra-ui/react'
import Navbar from '../../components/general/Navbar'
import { useSetRecoilState, useRecoilState } from 'recoil'
import cartState from './recoil/cart'
import { HiPhone, HiOutlineMail } from 'react-icons/hi'

const Checkout = () => {
	const cart = useRecoilState(cartState)

	const setCart = useSetRecoilState(cartState)

	let total = 0

	const placeOrder = () => {
		setCart([])
	}

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
					m={4}
				>
					{size === 'sm' ? 'Chico' : size === 'md' ? 'Med' : 'Grande'}
				</Badge>
			)
			total += numberOfPints * price
			return (
				<>
					<Center key={id}>
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
										{sizeBadge}
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
				<Box w='100%'>
					<Text fontSize={'3xl'} mt={16} ml={8}>
						Tu pedido
					</Text>
					<Stack
						direction={{ sm: 'column', lg: 'row' }}
						spacing={8}
						align='flex-start'
						w='100%'
						p={8}
					>
						{/* Input fields */}
						<Box w={{ sm: '100%', lg: '50%' }}>
							<Text fontSize='xl' mb={4}>
								Especificaciones
							</Text>
							<Textarea placeholder='Agrega aquí cualquier especificación adicional...' />
							<Divider my={8} />
							<Text fontSize='xl' mb={4}>
								Detalles de entrega
							</Text>
							<Stack
								direction={{ sm: 'column', lg: 'row' }}
								spacing={8}
								align='center'
							>
								<Stack direction='column' spacing={2} w='100%'>
									<Text fontSize='md'>Nombre</Text>
									<Input placeholder='Nombre' />
								</Stack>
								<Stack direction='column' spacing={2} w='100%'>
									<Text fontSize='md'>Apellido</Text>
									<Input placeholder='Apellido' />
								</Stack>
							</Stack>
							<Stack
								direction={{ sm: 'column', lg: 'row' }}
								spacing={8}
								align='center'
								my={8}
							>
								<Stack direction='column' spacing={2} w='100%'>
									<Text fontSize='md'>Teléfono</Text>
									<InputGroup>
										<InputLeftElement
											pointerEvents='none'
											children={<HiPhone color='gray.300' />}
										/>
										<Input type='tel' placeholder='Teléfono' />
									</InputGroup>
								</Stack>
								<Stack direction='column' spacing={2} w='100%'>
									<Text fontSize='md'>Correo electrónico</Text>
									<InputGroup>
										<InputLeftElement
											pointerEvents='none'
											children={<HiOutlineMail color='gray.300' />}
										/>
										<Input type='tel' placeholder='Correo electrónico' />
									</InputGroup>
								</Stack>
							</Stack>
							<Stack direction='column' spacing={2} w='100%'>
								<Text fontSize='md'>Dirección</Text>
								<Input placeholder='Calle y número' />
							</Stack>
							<Stack
								direction={{ sm: 'column', lg: 'row' }}
								spacing={8}
								align='center'
								my={8}
							>
								<Stack direction='column' spacing={2} w='100%'>
									<Text fontSize='md'>Municipio</Text>
									<Input placeholder='Municipio' />
								</Stack>
								<Stack direction='column' spacing={2} w='100%'>
									<Text fontSize='md'>Código postal</Text>
									<Input placeholder='Código postal' />
								</Stack>
							</Stack>
							<Alert status='warning' borderRadius='md'>
								<AlertIcon />
								<i>Solo se permiten pedidos en el área de Tlaxcala 🇲🇽</i>
							</Alert>
						</Box>
						{/* Order details */}
						<Stack w={{ sm: '100%', lg: '50%' }}>
							<Box borderWidth='1px' borderRadius='lg' p={8}>
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
							<Flex mt={8}>
								<Link
									w='100%'
									m={8}
									rounded={'md'}
									_hover={{
										textDecoration: 'none',
									}}
									color={'white'}
									colorScheme={'black'}
									onClick={placeOrder}
								>
									<Center
										bg={'gray.800'}
										borderRadius='md'
										w={'100%'}
										padding={'3'}
										justifyContent={'center'}
									>
										<Text fontSize={'lg'} fontWeight={'bold'}>
											REALIZAR PEDIDO
										</Text>
									</Center>
								</Link>
							</Flex>
						</Stack>
					</Stack>
				</Box>
			)}
		</>
	)
}

export default Checkout
