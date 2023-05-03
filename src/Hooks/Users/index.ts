import type { ChangeEvent } from 'react'

import { useUserStateContext } from '../../Providers/UserStateProvider'
import type { FormFieldNameOptions, UserStatType, UserType } from '../../Types/User'
import { fetcher, useDebounce } from '../../utils'
import { users } from '../Apis'
import { useHandleUserResponses } from './handleResponses'

export type EventChoiceTypes =
	| ChangeEvent<HTMLInputElement>
	| ChangeEvent<HTMLSelectElement>
	| ChangeEvent<HTMLTextAreaElement>

export const useCreateUser = (): {
	createNewUser: () => Promise<void>
	sendPasswordResetLinkToEmail: () => Promise<void>
	saveUpdatedPassword: ({ resetToken }: { resetToken: string }) => Promise<void>
} => {
	const { userDispatch, formFields } = useUserStateContext()
	const { handleCreateUserResponse } = useHandleUserResponses()

	const createNewUser = async (): Promise<void> => {
		const { email, first_name, last_name, password, password_2, legal } = formFields
		const allDefined = [email, password, password_2, first_name, last_name].every(
			(field) => field !== undefined && field !== null
		)
		if (allDefined) {
			if (legal !== undefined) {
				const newUserObject = {
					email,
					password,
					password_2,
					first_name,
					last_name,
					legal
				}

				try {
					const { data } = await fetcher(users.create.url, {
						method: users.create.method,
						body: newUserObject
					})

					handleCreateUserResponse(data)
				} catch (error: any) {
					if (error?.message !== undefined) {
						userDispatch({ type: 'setUserError', payload: error.message })
						throw new Error(error.message)
					} else if (error?.code_error !== undefined) {
						userDispatch({ type: 'setUserError', payload: error.code_error })
						throw new Error(error.error_code)
					} else {
						throw new Error(error)
					}
				}
			} else {
				userDispatch({
					type: 'setUserError',
					payload: `You must agree to the SundayPeak privacy policy.`
				})
				throw new Error(`You must agree to the SundayPeak privacy policy.`)
			}
		} else {
			userDispatch({
				type: 'setUserError',
				payload: 'All fields are required. Please complete the form.'
			})
			throw new Error('All fields are required. Please complete the form.')
		}
	}

	const sendPasswordResetLinkToEmail = async (): Promise<void> => {
		try {
			await fetcher(users.sendPasswordResetLink.url, {
				method: users.sendPasswordResetLink.method,
				body: { email: formFields.email }
			})
		} catch (error) {
			userDispatch({ type: 'setUserError', payload: 'error sending reset email' })
			throw error
		}
	}

	// save the new password entered by the user
	const saveUpdatedPassword = async ({ resetToken }: { resetToken: string }): Promise<void> => {
		try {
			await fetcher(users.createNewPassword.url, {
				method: users.createNewPassword.method,
				body: { password: formFields.password, reset_token: resetToken }
			})
		} catch (error) {
			userDispatch({ type: 'setUserError', payload: 'saving the new password failed' })
			throw error
		}
	}

	return {
		createNewUser,
		sendPasswordResetLinkToEmail,
		saveUpdatedPassword
	}
}

export const useGetUser = (): {
	getNonLoggedInUser: ({ userId }: { userId: number }) => Promise<void>
	loginUser: () => Promise<void>
	setUserError: (userError: string) => void
	searchForUsers: ({ search }: { search: string }) => Promise<UserType[]>
	searchForFriends: ({ search }: { search: string }) => Promise<UserType[]>
	setWorkingUserToCurrentUser: () => void
	logoutUser: () => void
} => {
	const { userDispatch, formFields, loggedInUser } = useUserStateContext()
	const { handleLoginUserResponse } = useHandleUserResponses()

	// fetch a user's information that isn't the logged in user
	const getNonLoggedInUser = async ({ userId }: { userId: number }): Promise<void> => {
		try {
			const {
				data: { user }
			} = await fetcher(`${users.getById.url}?id=${userId}`, { method: users.getById.method })
			userDispatch({ type: 'setWorkingUser', payload: user })
		} catch (error) {
			userDispatch({ type: 'setUserError', payload: 'could not get user' })
			throw error
		}
	}

	const searchForUsers = async ({ search }: { search: string }): Promise<UserType[]> => {
		try {
			const {
				data: { users: responseUsers }
			} = await fetcher(`${users.searchForUser.url}?search=${search}`, {
				method: users.searchForUser.method
			})

			return responseUsers
		} catch (error) {
			userDispatch({ type: 'setUserError', payload: 'could not find users' })
			throw error
		}
	}

	const searchForFriends = async ({ search }: { search: string }): Promise<UserType[]> => {
		try {
			const {
				data: { users: responseUsers }
			} = await fetcher(`${users.searchForFriend.url}?search=${search}`, {
				method: users.searchForFriend.method
			})

			return responseUsers
		} catch (error) {
			userDispatch({ type: 'setUserError', payload: 'could not find friends' })
			throw error
		}
	}

	const loginUser = async (): Promise<void> => {
		const loginBody = {
			email: formFields.email,
			password: formFields.password
		}

		if (formFields.email !== undefined && formFields.password !== undefined) {
			try {
				const { data } = await fetcher(users.login.url, {
					method: users.login.method,
					body: loginBody
				})

				handleLoginUserResponse(data)
			} catch (error: any) {
				const { error: errorBody } = error
				if (errorBody?.message !== undefined) {
					userDispatch({ type: 'setUserError', payload: errorBody.message })
				}
				throw new Error(error)
			}
		} else {
			userDispatch({
				type: 'setUserError',
				payload: 'Email and Password fields are required. Please try again.'
			})
		}
	}

	const setUserError = (userError: string): void => {
		userDispatch({ type: 'setUserError', payload: userError })
	}

	const setWorkingUserToCurrentUser = (): void => {
		userDispatch({ type: 'setWorkingUser', payload: loggedInUser as UserType })
	}

	const logoutUser = (): void => {
		userDispatch({ type: 'logout' })
	}

	return {
		getNonLoggedInUser,
		loginUser,
		setUserError,
		searchForUsers,
		searchForFriends,
		setWorkingUserToCurrentUser,
		logoutUser
	}
}

export const useEditUser = (): {
	editUser: (event: EventChoiceTypes) => Promise<void>
	editFormFields: (field: { name: FormFieldNameOptions; value: string | number | boolean }) => void
	changeUserStatView: (newUserStatView: UserStatType) => void
	toggleUserEditState: () => void
} => {
	const { userDispatch } = useUserStateContext()

	const handleEditRequest = useDebounce(
		async ({ name, value }: { name: string; value: string }): Promise<void> => {
			try {
				await fetcher(users.edit.url, {
					method: users.edit.method,
					body: { field: { name, value } }
				})
			} catch (error) {
				userDispatch({ type: 'setUserError', payload: 'user edit request failed' })
				throw error
			}
		}
	)

	const editUser = async (event: EventChoiceTypes): Promise<void> => {
		userDispatch({
			type: 'setUserEditFields',
			payload: { name: event.target.name, value: event.target.value }
		})
		handleEditRequest({ name: event.target.name, value: event.target.value })
	}

	const changeUserStatView = (newUserStatView: UserStatType): void => {
		userDispatch({ type: 'changeStatView', payload: newUserStatView })
	}

	const editFormFields = (field: {
		name: FormFieldNameOptions
		value: string | number | boolean
	}): void => {
		userDispatch({ type: 'setFormFields', payload: field })
	}

	const toggleUserEditState = (): void => {
		userDispatch({ type: 'switchIsUserEditable' })
	}

	return {
		editUser,
		editFormFields,
		changeUserStatView,
		toggleUserEditState
	}
}

export const useFollowUser = (): {
	friendUser: ({ leaderId }: { leaderId: number }) => Promise<void>
} => {
	const { userDispatch } = useUserStateContext()

	const friendUser = async ({ leaderId }: { leaderId: number }): Promise<void> => {
		try {
			const {
				data: { user }
			} = await fetcher(`${users.followUser.url}?leader_id=${leaderId}`, {
				method: users.followUser.method
			})

			userDispatch({ type: 'setLoggedInUser', payload: user })
		} catch (error) {
			userDispatch({ type: 'setUserError', payload: 'failed to follow user' })
			throw error
		}
	}

	return { friendUser }
}
