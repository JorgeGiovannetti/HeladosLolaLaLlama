import React, { useState } from 'react'
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
	Button,
	FormControl,
	FormLabel,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
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

	// Validate functions
	function validateName(value) {
		let error
		if (!value) {
			error = 'Name is required'
		}
		return error
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
				<Box key={id} w='100%'>
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
										{sizeBadge}
									</Text>
								</Stack>
							</Link>
							<Text fontSize='lg'>${numberOfPints * price}</Text>
						</Flex>
					</Center>
					<Divider />
				</Box>
			)
		}
	)

	const [name, setName] = useState('')
	const [lastName, setLastName] = useState('')
	const [phoneNumber, setPhoneNumber] = useState('')
	const [email, setEmail] = useState('')
	const [address, setAddress] = useState('')
	const [town, setTown] = useState('')
	const [zipCode, setZipCode] = useState('')

	const { isOpen, onOpen, onClose } = useDisclosure()

	const handleSubmit = (event) => {
		event.preventDefault()
		onOpen()
	}

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
							<form onSubmit={handleSubmit}>
								<Stack
									direction={{ sm: 'column', lg: 'row' }}
									spacing={8}
									align='center'
								>
									<Stack direction='column' spacing={2} w='100%'>
										<FormControl isRequired>
											<FormLabel>Nombre</FormLabel>
											<Input
												placeholder='Nombre'
												size='lg'
												onChange={(event) => setName(event.currentTarget.value)}
											/>
										</FormControl>
									</Stack>
									<Stack direction='column' spacing={2} w='100%'>
										<FormControl isRequired>
											<FormLabel>Apellido</FormLabel>
											<Input
												placeholder='Apellido'
												size='lg'
												onChange={(event) =>
													setLastName(event.currentTarget.value)
												}
											/>
										</FormControl>
									</Stack>
								</Stack>
								<Stack
									direction={{ sm: 'column', lg: 'row' }}
									spacing={8}
									align='center'
									my={8}
								>
									<Stack direction='column' spacing={2} w='100%'>
										<FormControl isRequired>
											<FormLabel>Teléfono</FormLabel>
											<InputGroup>
												<InputLeftElement
													pointerEvents='none'
													children={<HiPhone color='gray.300' />}
												/>
												<Input
													type='tel'
													placeholder='Teléfono'
													size='lg'
													onChange={(event) =>
														setPhoneNumber(event.currentTarget.value)
													}
												/>
											</InputGroup>
										</FormControl>
									</Stack>
									<Stack direction='column' spacing={2} w='100%'>
										<FormControl isRequired>
											<FormLabel>Correo electrónico</FormLabel>
											<InputGroup>
												<InputLeftElement
													pointerEvents='none'
													children={<HiOutlineMail color='gray.300' />}
												/>
												<Input
													type='email'
													placeholder='Correo electrónico'
													size='lg'
													onChange={(event) =>
														setEmail(event.currentTarget.value)
													}
												/>
											</InputGroup>
										</FormControl>
									</Stack>
								</Stack>
								<Stack direction='column' spacing={2} w='100%'>
									<FormControl isRequired>
										<FormLabel>Dirección</FormLabel>
										<Input
											placeholder='Calle y número'
											size='lg'
											onChange={(event) =>
												setAddress(event.currentTarget.value)
											}
										/>
									</FormControl>
								</Stack>
								<Stack
									direction={{ sm: 'column', lg: 'row' }}
									spacing={8}
									align='center'
									my={8}
								>
									<Stack direction='column' spacing={2} w='100%'>
										<FormControl isRequired>
											<FormLabel>Municipio</FormLabel>
											<Input
												placeholder='Municipio'
												size='lg'
												onChange={(event) => setTown(event.currentTarget.value)}
											/>
										</FormControl>
									</Stack>
									<Stack direction='column' spacing={2} w='100%'>
										<FormControl isRequired>
											<FormLabel>Código postal</FormLabel>
											<Input
												type='number'
												placeholder='Código postal'
												size='lg'
												onChange={(event) =>
													setZipCode(event.currentTarget.value)
												}
											/>
										</FormControl>
									</Stack>
								</Stack>
								<Alert status='warning' borderRadius='md' my={4}>
									<AlertIcon />
									<i>Solo se permiten pedidos en el área de Tlaxcala 🇲🇽</i>
								</Alert>
								<Button variant='unstyled' type='submit' width='full'>
									<Center
										bg={'gray.800'}
										borderRadius='md'
										w={'100%'}
										padding={'3'}
										justifyContent={'center'}
									>
										<Text fontSize={'lg'} fontWeight={'bold'} color='white'>
											REALIZAR PEDIDO
										</Text>
									</Center>
								</Button>
							</form>
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
						</Stack>
					</Stack>
					<Modal isOpen={isOpen} onClose={onClose}>
						<ModalOverlay />
						<ModalContent>
							<ModalHeader>¡Tu orden fue registrada!</ModalHeader>
							<ModalBody>
								Gracias por realizar un pedido de Lola La Llama. Revisa tu
								correo electrónico donde te llegará una confirmación de tu
								pedido.
							</ModalBody>
							<ModalFooter>
								<Button colorScheme='blue' mr={3} onClick={onClose}>
									Cerrar
								</Button>
							</ModalFooter>
						</ModalContent>
					</Modal>
				</Box>
			)}
		</>
	)
}

export default Checkout
