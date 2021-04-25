import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import AuthProvider from './providers/AuthProvider'
import { RecoilRoot } from 'recoil'

const theme = extendTheme({
	colors: {
		// Lola La Llama's color scheme
	},
})

ReactDOM.render(
	<React.StrictMode>
		<ChakraProvider theme={theme}>
			<AuthProvider>
				<RecoilRoot>
					<App />
				</RecoilRoot>
			</AuthProvider>
		</ChakraProvider>
	</React.StrictMode>,
	document.getElementById('root')
)
