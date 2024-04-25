import type { CardAction, CardState } from '../../Types/Cards'
import { getScreenType } from '../../utils'

export const initialCardState: CardState = {
	galleryImage: null,
	showAlert: false,
	alertContent: '',
	imageList: null,
	screenType: getScreenType(),
	isMenuOpen: false
}

export const cardReducer = (state: CardState, action: CardAction): CardState => {
	switch (action.type) {
		case 'closeCardMessage':
			return {
				...state,
				showAlert: true,
				alertContent: action.payload
			}
		case 'setGalleryImage':
			return { ...state, galleryImage: action.payload }
		case 'openAlert':
			return { ...state, showAlert: true, alertContent: action.payload }
		case 'closeAlert':
			return { ...state, showAlert: false, alertContent: '' }
		case 'setIsMenuOpen':
			return { ...state, isMenuOpen: !state.isMenuOpen }
		case 'setImageList':
			return { ...state, imageList: action.payload.list, galleryImage: action.payload.index }
		default:
			return state
	}
}
