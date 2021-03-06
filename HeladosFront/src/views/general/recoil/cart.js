import { atom } from 'recoil'

const localStorageEffect = (key) => ({ setSelf, onSet }) => {
	const savedValue = localStorage.getItem(key)
	if (savedValue != null) {
		setSelf(JSON.parse(savedValue))
	}

	onSet((newValue) => {
		if (newValue.length === 0) {
			localStorage.removeItem(key)
		} else {
			// Update local storage with products
			localStorage.setItem(key, JSON.stringify(newValue))
		}
	})
}

const cartState = atom({
	key: 'cartState',
	default: [],
	effects_UNSTABLE: [localStorageEffect('cart')],
})

export default cartState
