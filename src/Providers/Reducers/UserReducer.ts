import { Storage } from '../../config'
import type { UserAction, UserState, UserType } from '../../Types/User'

export const initialUserState: UserState = {
	userError: null,
	workingUser: null,
	loggedInUser: null,
	formFields: {},
	userEditState: false,
	statView: 'completed', // the toggle between friends and stats view
	searchList: null,
	images: []
}

export const userReducer = (state: UserState, action: UserAction): UserState => {
	switch (action.type) {
		case 'setWorkingUser':
			return { ...state, workingUser: action.payload }
		case 'setUserEditFields':
			return {
				...state,
				loggedInUser: {
					...(state.loggedInUser as UserType),
					[action.payload.name]: action.payload.value
				},
				workingUser: {
					...(state.workingUser as UserType),
					[action.payload.name]: action.payload.value
				},
				formFields: {
					...state.formFields,
					[action.payload.name]: action.payload.value
				}
			}
		case 'setLoggedInUser':
			return {
				...state,
				loggedInUser: action.payload,
				workingUser: action.payload,
				userError: null,
				formFields: {}
			}
		case 'logout':
			Storage.clear()
			return { ...state, loggedInUser: null }
		case 'setUserError':
			return { ...state, userError: action.payload }
		case 'setFormFields':
			return {
				...state,
				formFields: { ...state.formFields, [action.payload.name]: action.payload.value },
				userError: null
			}
		case 'clearForm':
			return { ...state, userError: null, formFields: {} }
		case 'switchIsUserEditable':
			return { ...state, userEditState: !state.userEditState }
		case 'changeStatView':
			return { ...state, statView: action.payload }
		default:
			return state
	}
}
