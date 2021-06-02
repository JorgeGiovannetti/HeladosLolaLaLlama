import React from 'react'
import { useParams } from 'react-router-dom'
import {
	Box,
	Heading,
	Text,
	Tag,
	HStack,
	VStack,
	Center,
} from '@chakra-ui/react'
import Navbar from '../../components/admin/Navbar'
import useOrder from '../../utils/hooks/useOrder'

const OrderDetails = () => {
	const { id } = useParams()

	const { order, isLoading, error } = useOrder(id)

	let orderDate, total, paid, client, dateOfOrder
	if (order && !isLoading) {
		total = order.total
		paid = order.paid
		client = order.client
		dateOfOrder = order.dateOfOrder
		orderDate = new Date(dateOfOrder)
	}

	return (
		<>
			<Navbar />
			<Box
				mt={16}
				p={'10'}
				w={'100%'}
				flexDirection={'column'}
				justifyContent={'center'}
				alignContent={'center'}
			>
				<Center>
					<Heading mb={5}>Detalles de orden</Heading>
				</Center>
				{isLoading ? null : (
					<VStack>
						<Text fontSize='xs' color='gray.500' pb={12}>
							{id}
						</Text>
						<HStack>
							<Box
								fontWeight='semibold'
								letterSpacing='wide'
								fontSize='s'
								textTransform='uppercase'
								ml='2'
							>
								Nombre de cliente
							</Box>
							<Text fontSize='s'>{client.name}</Text>
						</HStack>
						<HStack>
							<Box
								fontWeight='semibold'
								letterSpacing='wide'
								fontSize='s'
								textTransform='uppercase'
								ml='2'
							>
								Teléfono de cliente
							</Box>
							<Text fontSize='s'>{client.phone}</Text>
						</HStack>
						<HStack>
							<Box
								fontWeight='semibold'
								letterSpacing='wide'
								fontSize='s'
								textTransform='uppercase'
								ml='2'
							>
								Correo de cliente
							</Box>
							<Text fontSize='s'>{client.email}</Text>
						</HStack>
						<HStack>
							<Box
								fontWeight='semibold'
								letterSpacing='wide'
								fontSize='s'
								textTransform='uppercase'
								ml='2'
							>
								Dirección
							</Box>
							<Text fontSize='s'>{client.address}</Text>
						</HStack>
						<HStack>
							<Box
								fontWeight='semibold'
								letterSpacing='wide'
								fontSize='s'
								textTransform='uppercase'
								ml='2'
							>
								Fecha de órden
							</Box>
							<Text fontSize='s'>{orderDate.toLocaleDateString()}</Text>
						</HStack>

						<HStack pt={12}>
							<Box
								fontWeight='semibold'
								letterSpacing='wide'
								fontSize='s'
								textTransform='uppercase'
								ml='2'
							>
								Total
							</Box>
							<Text fontSize='s'>${total}</Text>
						</HStack>
						<HStack>
							<Text fontSize='s'>
								<Tag
									size='md'
									variant='solid'
									colorScheme={paid ? 'green' : 'red'}
								>
									{paid ? 'Pagado' : 'Pendiente'}
								</Tag>
							</Text>
						</HStack>
					</VStack>
				)}
			</Box>
		</>
	)
}

export default OrderDetails
