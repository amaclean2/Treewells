import type { Dispatch } from 'react'

type SetTokenState = {
	type: 'setTokens'
	payload: {
		mapboxToken: string
		mapboxStyleKey: string
	}
}

type SetTokenError = {
	type: 'setTokenError'
	payload: string
}

export type TokenAction = SetTokenState | SetTokenError

export type TokenState = {
	mapboxToken: string | null
	mapboxStyleKey: string | null
	tokenError: string | null
}

export type TokenContext = TokenState & { tokenDispatch: Dispatch<TokenAction> }
