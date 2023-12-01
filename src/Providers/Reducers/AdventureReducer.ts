import { Storage } from '../../config'
import type { AdventureAction, AdventureState, AdventureType } from '../../Types/Adventures'
import type { URLType } from '../../Types/Cards'

export const initialAdventureState = {
	allAdventures: null,
	closeAdventures: null,
	adventuresList: null,
	adventureAddState: false,
	currentAdventure: null,
	adventureEditState: false,
	adventureError: null,
	startPosition: null,
	isDeletePageOpen: false,
	globalAdventureType: null,
	isPathEditOn: false,
	workingPath: []
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
		case 'setCloseAdventures':
			return {
				...state,
				closeAdventures: action.payload
			}
		case 'setAdventuresList':
			// the list of adventures to show near the user in the app
			return {
				...state,
				adventuresList: action.payload
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
		case 'setCurrentAdventure':
			return { ...state, currentAdventure: action.payload }
		case 'closeAdventureView':
			return {
				...state,
				adventureAddState: false,
				currentAdventure: null,
				adventureEditState: false,
				isDeletePageOpen: false,
				workingPath: []
			}
		case 'editAdventure':
			return {
				...state,
				currentAdventure: {
					...(state.currentAdventure as AdventureType),
					[action.payload.name]: action.payload.value
				}
			}
		/**
		 * startNewAdventureProcess is triggered when the adventure type is selected
		 * from the dropdown on creating a new adventure.
		 * It's also enabled when the toggle of adventure types is selected, so I'm not sure this is the best place for
		 * adventureAddState to be changed
		 */
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
		case 'togglePathEdit':
			return {
				...state,
				isPathEditOn: !state.isPathEditOn
			}
		case 'updateTrailPath':
			return {
				...state,
				workingPath: action.payload
			}
		case 'setTrailPath':
			return {
				...state,
				workingPath: action.payload ?? []
			}
		default:
			return state
	}
}
