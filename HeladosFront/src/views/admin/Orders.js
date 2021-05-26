import React from 'react'
import { Spinner } from '@chakra-ui/react'
import Navbar from '../../components/admin/Navbar'
import { Center, SimpleGrid } from '@chakra-ui/layout'
import useOrders from '../../utils/hooks/useOrders'

const Orders = () => {
  const { orders, isLoading, error } = useOrders()

  if (error) {
    console.log('Error fetching orders', error)
  }

  const componentsChild = isLoading ? (
    <Center>
      <Spinner size='xl' color={'gray'} />
    </Center>
  ) : (
    orders.map((order) => (
      <div>{order.client?.name}</div>
    ))
  )

  return (
    <>
      <Navbar />
      <SimpleGrid minChildWidth='360px' gap={12} w='100%' p='12' mt={12}>
        {componentsChild}
      </SimpleGrid>
    </>
  )
}

export default Orders;
