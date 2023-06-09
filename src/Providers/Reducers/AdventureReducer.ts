import { Storage } from '../../config'
import type { AdventureAction, AdventureState, AdventureType } from '../../Types/Adventures'
import type { URLType } from '../../Types/Cards'

export const initialAdventureState = {
	allAdventures: null,
	adventureAddState: false,
	currentAdventure: null,
	adventureEditState: false,
	adventureError: null,
	startPosition: null,
	isDeletePageOpen: false,
	globalAdventureType: null
}

export const adventureReducer = (
	state: AdventureState,
	action: AdventureAction
): AdventureState => {
	switch (action.type) {
		case 'setInitialValues':
			Storage.setItem('startPos', JSON.stringify(action.payload.startPosition))
			return {
				...state,
				startPosition: action.payload.startPosition,
				globalAdventureType: action.payload.globalAdventureType
			}
		case 'updateStartPosition':
			Storage.setItem('startPos', JSON.stringify(action.payload))
			return {
				...state,
				startPosition: action.payload
			}
		case 'setAllAdventures':
			return {
				...state,
				allAdventures: action.payload
			}
		case 'addNewAdventure':
			return {
				...state,
				allAdventures: action.payload.adventures,
				currentAdventure: action.payload.currentAdventure,
				adventureAddState: false
			}
		case 'enableMapDoubleClick':
			// screen for adding a new adventure
			return { ...state, adventureAddState: true }
		case 'setCurrentAdventure':
			return { ...state, currentAdventure: action.payload }
		case 'closeAdventureView':
			return {
				...state,
				adventureAddState: false,
				currentAdventure: null,
				adventureEditState: false,
				isDeletePageOpen: false
			}
		case 'editAdventure':
			return {
				...state,
				currentAdventure: {
					...(state.currentAdventure as AdventureType),
					[action.payload.name]: action.payload.value
				}
			}
		case 'startNewAdventureProcess':
			Storage.setItem('globalAdventureType', action.payload)
			return {
				...state,
				globalAdventureType: action.payload,
				adventureAddState: true
			}
		case 'switchIsAdventureEditable':
			return { ...state, adventureEditState: !state.adventureEditState }
		case 'setAdventureError':
			return { ...state, adventureError: action.payload }
		case 'switchIsDeletePageOpen':
			return { ...state, isDeletePageOpen: !state.isDeletePageOpen }
		case 'deleteAdventure':
			return { ...state, isDeletePageOpen: !state.isDeletePageOpen, currentAdventure: null }
		case 'setGlobalAdventureType':
			Storage.setItem('globalAdventureType', action.payload)
			return { ...state, globalAdventureType: action.payload }
		case 'updateAdventureImages':
			return {
				...state,
				currentAdventure: {
					...(state.currentAdventure as AdventureType),
					images: [...(state.currentAdventure?.images as URLType[]), action.payload]
				}
			}
		case 'deleteAdventureImage':
			return {
				...state,
				currentAdventure: {
					...(state.currentAdventure as AdventureType),
					images: (state.currentAdventure?.images as URLType[])?.filter(
						(image) => image !== action.payload
					)
				}
			}
		default:
			return state
	}
}
