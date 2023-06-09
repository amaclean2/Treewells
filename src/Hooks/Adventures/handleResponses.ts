import { useGetAdventures } from '.'
import { useAdventureStateContext } from '../../Providers/AdventureStateProvider'
import { useUserStateContext } from '../../Providers/UserStateProvider'
import type { AdventureChoiceType, AdventureType } from '../../Types/Adventures'
import type { TodoAdventureForUserType, UserType } from '../../Types/User'

type HandleSaveTodoProps = {
	todo: {
		adventure_todo_field: {
			display_name: string
			email: string
			profile_picture_url: string | null
			user_id: number
		}
		user_todo_field: {
			adventure_name: string
			adventure_type: AdventureChoiceType
			adventure_id: number
			nearest_city: string
		}
	}
}

export const useHandleAdventureResponses = (): {
	handleSaveTodo: ({ todo }: HandleSaveTodoProps) => Promise<void>
} => {
	const { userDispatch, loggedInUser } = useUserStateContext()
	const { adventureDispatch, currentAdventure } = useAdventureStateContext()
	const { getAdventure } = useGetAdventures()

	const handleSaveTodo = async ({ todo }: HandleSaveTodoProps): Promise<void> => {
		userDispatch({
			type: 'setLoggedInUser',
			payload: {
				...(loggedInUser as UserType),
				todo_adventures: [
					...(loggedInUser?.todo_adventures as TodoAdventureForUserType[]),
					todo.user_todo_field
				]
			}
		})

		adventureDispatch({
			type: 'setCurrentAdventure',
			payload: {
				...(currentAdventure as AdventureType),
				todo_users:
					currentAdventure?.todo_users !== undefined
						? [...currentAdventure.todo_users, todo.adventure_todo_field]
						: [todo.adventure_todo_field]
			}
		})

		await getAdventure({
			id: todo.user_todo_field.adventure_id,
			type: todo.user_todo_field.adventure_type
		})
	}
	return {
		handleSaveTodo
	}
}
