import React from 'react'
import {
	Box,
	Flex,
	HStack,
	Link,
	IconButton,
	useDisclosure,
	useColorModeValue,
	Stack,
	Icon,
	Text,
} from '@chakra-ui/react'
import { HiShoppingCart } from 'react-icons/hi'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'

const NavLink = ({ link, children }) => (
	<Link
		px={2}
		py={1}
		rounded={'md'}
		_hover={{
			textDecoration: 'none',
			bg: useColorModeValue('yellow.100', 'yellow.200'),
		}}
		href={`/${link}`}
		color={'gray.800'}
	>
		{children}
	</Link>
)

const Navbar = ({ home = false }) => {
	const { isOpen, onOpen, onClose } = useDisclosure()

	return (
		<Box position={'fixed'} top={'0'} left={'0'}>
			<Box
				// bg={useColorModeValue('yellow.100', 'yellow.200')}
				px={4}
				minW={'100vw'}
			>
				<Flex
					h={16}
					alignItems={'center'}
					justifyContent={'space-between'}
					w={'full'}
				>
					<IconButton
						size={'md'}
						colorScheme='yellow'
						icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
						aria-label={'Open Menu'}
						display={{ md: !isOpen ? 'none' : 'inherit' }}
						onClick={isOpen ? onClose : onOpen}
					/>
					<HStack spacing={8} alignItems={'center'} w={'full'}>
						<Flex
							as={'nav'}
							spacing={4}
							display={{ base: 'none', md: 'flex' }}
							justifyContent={'space-between'}
							w={'full'}
							alignItems={'center'}
						>
							<NavLink key={'helados'} link={'Products'}>
								Helados
							</NavLink>
							{home ? null : (
								<Link
									px={2}
									py={1}
									rounded={'md'}
									href={'Landing'}
									color={'gray.800'}
									_hover={{
										textDecoration: 'none',
									}}
								>
									<Text fontSize={'3xl'}>Helados Lola La Llama</Text>
								</Link>
							)}

							<NavLink key={'carrito'} link={'Cart'}>
								<Icon w={6} h={6} color='gray.800' as={HiShoppingCart}></Icon>
							</NavLink>
						</Flex>
					</HStack>
				</Flex>

				{isOpen ? (
					<Box pb={4}>
						<Stack as={'nav'} spacing={4}>
							<NavLink key={'helados'} link={'Products'}>
								Helados
							</NavLink>
							<NavLink key={'home'} link={'Landing'}>
								Helados Lola La Llama
							</NavLink>
							<NavLink key={'carrito'} link={'Cart'}>
								<Icon w={6} h={6} color='gray.800' as={HiShoppingCart}></Icon>
							</NavLink>
						</Stack>
					</Box>
				) : null}
			</Box>
		</Box>
	)
}

export default Navbar
