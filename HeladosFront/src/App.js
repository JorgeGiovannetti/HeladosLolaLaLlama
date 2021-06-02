import React from 'react'
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import { Flex, useColorModeValue } from '@chakra-ui/react'
import { routes, protectedRoutes } from './views/routes'

const App = () => {
	return (
		<Flex
			minH={'100vh'}
			w={'100%'}
			align={'center'}
			flexDirection={'column'}
			bg={useColorModeValue('gray.50', 'gray.800')}
		>
			<Router>
				<Switch>
					{routes.map((route, key) => (
						<Route key={key} exact path={route.path} component={route.component} />
					))}
					{protectedRoutes.map((route, key) => (
						<PrivateRoute key={key} exact path={route.path} component={route.component} />
					))}
					<Redirect to='/' />
				</Switch>
			</Router>
		</Flex>
	)
}

export default App
