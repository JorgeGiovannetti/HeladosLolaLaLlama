import { Box, Image, Badge, Text, Icon, Link } from '@chakra-ui/react'
import { HiCurrencyDollar } from 'react-icons/hi'

const getCategoryColor = (name) => {
	switch (name) {
		case 'Tradicionales':
			return 'red'
		case 'PREMIUM':
			return 'yellow'
		case `HERSHEY's`:
			return 'blue'
		default:
			return 'orange'
	}
}

const Product = ({ categories, flavor, id, product }) => {
	const imageURL = product.fotos[0].foto

	const categoriesBadges = categories.map(({ id, name }) => (
		<Badge
			borderRadius='full'
			px='2'
			colorScheme={getCategoryColor(name)}
			key={id}
		>
			{name}
		</Badge>
	))

	return (
		<Link
			href={`products/${id}`}
			_hover={{
				textDecoration: 'none',
			}}
		>
			<Box borderWidth='1px' borderRadius='md' overflow='hidden'>
				<Image src={imageURL} alt={'Helado de ' + flavor} />

				<Box p='6'>
					<Box d='flex' alignItems='baseline'>
						{categoriesBadges}
						<Box
							color='gray.500'
							fontWeight='semibold'
							letterSpacing='wide'
							fontSize='xs'
							textTransform='uppercase'
							ml='2'
						>
							{flavor}
						</Box>
					</Box>

					<Box
						mt='1'
						fontWeight='semibold'
						as='h1'
						lineHeight='tight'
						isTruncated
					>
						<Text fontSize={'2xl'}>{product.name}</Text>
					</Box>

					<Box>{product.description}</Box>

					<Box d='flex' mt='2' alignItems='left'>
						<Box as='span' color='gray.600' fontSize='sm'>
							{product.precios[0] ? (
								<>
									<Icon w={5} h={5} color='green.400' as={HiCurrencyDollar} />
									{product.precios[0].price}
									{'  '}
								</>
							) : null}
							{product.precios[1] ? (
								<>
									<Icon w={5} h={5} color='yellow.400' as={HiCurrencyDollar} />
									{product.precios[1].price}
									{'  '}
								</>
							) : null}
							{product.precios[2] ? (
								<>
									<Icon w={5} h={5} color='pink.400' as={HiCurrencyDollar} />
									{product.precios[2].price}
								</>
							) : null}
						</Box>
					</Box>
				</Box>
			</Box>
		</Link>
	)
}

export default Product
