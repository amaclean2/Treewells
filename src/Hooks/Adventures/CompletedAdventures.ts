import { useGetAdventures } from '.'
import { useAdventureStateContext } from '../../Providers/AdventureStateProvider'
import { useUserStateContext } from '../../Providers/UserStateProvider'
import type { AdventureChoiceType } from '../../Types/Adventures'
import type {
	CompletedAdventureForUserType,
	TodoAdventureForUserType,
	UserType
} from '../../Types/User'
import { fetcher } from '../../utils'
import { adventures } from '../Apis'

export const useSaveCompletedAdventure = (): {
	saveCompletedAdventure: ({
		adventureId,
		adventureType,
		difficulty,
		rating
	}: {
		adventureId: number
		adventureType: AdventureChoiceType
		difficulty: string
		rating: string
	}) => Promise<void>
} => {
	const { loggedInUser, userDispatch } = useUserStateContext()
	const { getAdventure } = useGetAdventures()
	const { adventureDispatch } = useAdventureStateContext()

	const saveCompletedAdventure = async ({
		adventureId,
		adventureType,
		rating,
		difficulty
	}: {
		adventureId: number
		adventureType: AdventureChoiceType
		rating: string
		difficulty: string
	}): Promise<void> => {
		try {
			const {
				data: {
					completed: { user_completed_field }
				}
			} = await fetcher(adventures.completeAdventure.url, {
				method: adventures.completeAdventure.method,
				body: {
					adventure_id: adventureId,
					public: true,
					rating,
					difficulty
				}
			})

			userDispatch({
				type: 'setLoggedInUser',
				payload: {
					...(loggedInUser as UserType),
					completed_adventures: [
						...(loggedInUser?.completed_adventures as CompletedAdventureForUserType[]),
						user_completed_field
					],
					todo_adventures: loggedInUser?.todo_adventures.filter(
						(adventure) => adventure.adventure_id !== user_completed_field.adventure_id
					) as TodoAdventureForUserType[]
				}
			})

			await getAdventure({ id: adventureId, type: adventureType })
		} catch (error) {
			adventureDispatch({
				type: 'setAdventureError',
				payload: 'cannot save the completed adventure'
			})
			throw error
		}
	}

	return { saveCompletedAdventure }
}
