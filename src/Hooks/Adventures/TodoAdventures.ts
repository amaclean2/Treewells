import { useAdventureStateContext } from '../../Providers/AdventureStateProvider'
import type { AdventureChoiceType } from '../../Types/Adventures'
import { fetcher } from '../../utils'
import { adventures } from '../Apis'
import { useHandleAdventureResponses } from './handleResponses'

export const useSaveTodo = (): {
	saveTodo: ({
		adventureId,
		adventureType
	}: {
		adventureId: number
		adventureType: AdventureChoiceType
	}) => Promise<void>
} => {
	const { handleSaveTodo } = useHandleAdventureResponses()
	const { adventureDispatch } = useAdventureStateContext()

	const saveTodo = async ({
		adventureId
	}: {
		adventureId: number
		adventureType: AdventureChoiceType
	}): Promise<void> => {
		try {
			const {
				data: { todo }
			} = await fetcher(adventures.createTodo.url, {
				method: adventures.createTodo.method,
				body: {
					adventure_id: adventureId,
					public: false
				}
			})

			await handleSaveTodo({ todo })
		} catch (error) {
			adventureDispatch({ type: 'setAdventureError', payload: 'cannot save new todo adventure' })
			throw error
		}
	}

	return {
		saveTodo
	}
}
