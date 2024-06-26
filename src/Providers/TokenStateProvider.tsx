import React, { createContext, type ReactNode, useContext, useEffect, useReducer } from 'react'
import { tokensApi } from '../Hooks/Apis'
import { type TokenContext } from '../Types/Tokens'
import { fetcher } from '../utils'
import { initialTokenState, tokenReducer } from './Reducers/TokenReducer'

const TokenStateContext = createContext({} as TokenContext)

export const useTokenStateContext = (): TokenContext => {
	const context = useContext(TokenStateContext)

	if (context === undefined) {
		throw new Error('useTokenStateContext must be used within a TokenStateProvider')
	}
	return context
}

export const TokenStateProvider = ({ children }: { children: ReactNode }): JSX.Element => {
	const [tokenState, tokenDispatch] = useReducer(tokenReducer, initialTokenState)

	// get tokens for the app
	useEffect(() => {
		fetcher(tokensApi.getInitialCall.url, { method: tokensApi.getInitialCall.method })
			.then(({ data }: { data: any }) => {
				tokenDispatch({
					type: 'setTokens',
					payload: {
						mapboxToken: data.mapbox_token,
						mapboxStyleKey: data.map_style,
						githubIssueToken: data.github_token
					}
				})
			})
			.catch(console.error)
	}, [])

	return (
		<TokenStateContext.Provider
			value={{
				...tokenState,
				tokenDispatch
			}}
		>
			{children}
		</TokenStateContext.Provider>
	)
}
