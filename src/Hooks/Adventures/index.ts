import { useAdventureStateContext } from '../../Providers/AdventureStateProvider'
import { useCardStateContext } from '../../Providers/CardStateProvider'
import type { AdventureChoiceType, AdventureType } from '../../Types/Adventures'
import { fetcher, useDebounce } from '../../utils'
import { adventures } from '../Apis'
import type { EventChoiceTypes } from '../Users'

export const useGetAdventures = (): {
	getAdventure: ({ id, type }: { id: number; type: AdventureChoiceType }) => Promise<void>
	getAllAdventures: ({ type }: { type: AdventureChoiceType }) => Promise<void>
	searchAdventures: ({ searchQuery }: { searchQuery: string }) => Promise<any>
	changeAdventureType: ({ type }: { type: AdventureChoiceType }) => void
	processCsvAdventures: ({ csvString }: { csvString: string }) => Promise<AdventureType[]>
} => {
	const { globalAdventureType, adventureDispatch } = useAdventureStateContext()

	const getAdventure = async ({
		id,
		type
	}: {
		id: number
		type: AdventureChoiceType
	}): Promise<void> => {
		if (id === undefined || type === undefined)
			adventureDispatch({ type: 'setAdventureError', payload: 'id and type fields are required' })

		try {
			const {
				data: { adventure }
			} = await fetcher(`${adventures.getAdventureDetails.url}?id=${id}&type=${type}`, {
				method: adventures.getAdventureDetails.method
			})

			adventureDispatch({ type: 'setCurrentAdventure', payload: adventure })
		} catch (error) {
			adventureDispatch({
				type: 'setAdventureError',
				payload: 'error fetching adventure, please try again or do some other stuff...'
			})

			throw error
		}
	}

	// const shareAdventure = ({ id }: { id: number }) => {
	// 	const url = window.location.href
	// 	const domain = url.includes('/adventure')
	// 		? url.split('/adventure')[0]
	// 		: url.split('/discover')[0]

	// 	const newDomain = `${domain}/adventure/${id}`
	// 	navigator.clipboard.writeText(newDomain)
	// 	cardDispatch({ type: 'openAlert', payload: 'Your adventure has been copied to the clipboard' })
	// }

	const changeAdventureType = ({ type }: { type: AdventureChoiceType }): void => {
		adventureDispatch({ type: 'startNewAdventureProcess', payload: type })
		// I'm replacing getAllAdventures here with a watcher in adventureStateContext
		// that calls getAllAdventures anytime the globalAdventureState changes
	}

	const getAllAdventures = async ({ type }: { type: AdventureChoiceType }): Promise<void> => {
		try {
			const {
				data: { adventures: responseAdventures }
			} = await fetcher(`${adventures.getAllAdventures.url}?type=${type ?? globalAdventureType}`, {
				method: adventures.getAllAdventures.method
			})

			adventureDispatch({ type: 'setAllAdventures', payload: responseAdventures })
		} catch (error) {
			adventureDispatch({ type: 'setAdventureError', payload: 'failed fetching adventures' })
			throw error
		}
	}

	const searchAdventures = async ({
		searchQuery
	}: {
		searchQuery: string
	}): Promise<AdventureType[]> => {
		try {
			const { data } = await fetcher(
				`${adventures.searchForAdventures.url}?search=${searchQuery}`,
				{ method: adventures.searchForAdventures.method }
			)
			return data.adventures
		} catch (error) {
			adventureDispatch({ type: 'setAdventureError', payload: 'could not get searched adventures' })
			throw error
		}
	}

	const processCsvAdventures = async ({
		csvString
	}: {
		csvString: string
	}): Promise<AdventureType[]> => {
		try {
			const { data } = await fetcher(adventures.processAdventureCSV.url, {
				method: adventures.processAdventureCSV.method,
				body: { csvString }
			})

			return data.adventures
		} catch (error) {
			adventureDispatch({ type: 'setAdventureError', payload: 'could not process csv data' })
			throw error
		}
	}

	return {
		getAdventure,
		getAllAdventures,
		searchAdventures,
		changeAdventureType,
		processCsvAdventures
	}
}

export const useSaveAdventure = (): {
	editAdventure: (event: EventChoiceTypes) => void
	createNewDefaultAdventure: ({
		longitude,
		latitude
	}: {
		longitude: number
		latitude: number
	}) => Promise<AdventureType>
	insertBulkAdventures: ({
		adventuresObject
	}: {
		adventuresObject: AdventureType[]
	}) => Promise<void>
	setAdventureError: (adventureError: string) => void
} => {
	const { adventureDispatch, currentAdventure, globalAdventureType } = useAdventureStateContext()

	const saveEditAdventure = useDebounce(
		({ name, value }: { name: string; value: string | number }): void => {
			try {
				fetcher(adventures.editAdventure.url, {
					method: adventures.editAdventure.method,
					body: {
						field: {
							name,
							value,
							adventure_id: currentAdventure?.id,
							adventure_type: currentAdventure?.adventure_type
						}
					}
				})
			} catch (error) {
				adventureDispatch({ type: 'setAdventureError', payload: 'could not edit adventure' })
				throw error
			}
		}
	)

	const editAdventure = (event: EventChoiceTypes): void => {
		saveEditAdventure({ name: event.target.name, value: event.target.value })
		adventureDispatch({
			type: 'editAdventure',
			payload: {
				name: event.target.name,
				value: event.target.value
			}
		})
	}

	const createNewDefaultAdventure = async ({
		longitude,
		latitude
	}: {
		longitude: number
		latitude: number
	}): Promise<AdventureType> => {
		const newDefaultAdventure = {
			adventure_name: 'New Adventure',
			adventure_type: globalAdventureType,
			public: true,
			nearest_city: 'New City',
			coordinates: {
				lng: longitude,
				lat: latitude
			}
		}

		try {
			const { data } = await fetcher(adventures.create.url, {
				method: adventures.create.method,
				body: newDefaultAdventure
			})

			const { adventure, all_adventures } = data
			adventureDispatch({
				type: 'addNewAdventure',
				payload: {
					adventures: all_adventures,
					currentAdventure: adventure
				}
			})

			return adventure
		} catch (error) {
			adventureDispatch({ type: 'setAdventureError', payload: 'could not create a new adventure' })
			throw error
		}
	}

	const insertBulkAdventures = async ({
		adventuresObject
	}: {
		adventuresObject: AdventureType[]
	}): Promise<void> => {
		try {
			fetcher(adventures.builkImport.url, {
				method: adventures.builkImport.method,
				body: { adventures: adventuresObject }
			})
		} catch (error) {
			adventureDispatch({ type: 'setAdventureError', payload: 'could not create bulk adventrues' })
			throw error
		}
	}

	const setAdventureError = (adventureError: string): void => {
		adventureDispatch({ type: 'setAdventureError', payload: adventureError })
	}

	return {
		editAdventure,
		createNewDefaultAdventure,
		insertBulkAdventures,
		setAdventureError
	}
}

export const useDeleteAdventure = (): {
	deleteAdventure: ({
		adventureId,
		adventureType,
		adventureName
	}: {
		adventureId: number
		adventureType: AdventureChoiceType
		adventureName: string
	}) => Promise<void>
	toggleDeletePage: () => void
} => {
	const { getAllAdventures } = useGetAdventures()
	const { adventureDispatch, globalAdventureType } = useAdventureStateContext()
	const { cardDispatch } = useCardStateContext()

	const deleteAdventure = async ({
		adventureId,
		adventureType,
		adventureName
	}: {
		adventureId: number
		adventureType: AdventureChoiceType
		adventureName: string
	}): Promise<void> => {
		try {
			await fetcher(
				`${adventures.deleteAdventure.url}?adventure_id=${adventureId}&adventure_type=${adventureType}`,
				{ method: adventures.deleteAdventure.method }
			)

			await getAllAdventures({ type: globalAdventureType as AdventureChoiceType })
			adventureDispatch({ type: 'deleteAdventure' })
			cardDispatch({
				type: 'openAlert',
				payload: `${adventureName} has been deleted.`
			})
		} catch (error) {
			adventureDispatch({ type: 'setAdventureError', payload: 'could not delete adventure' })
			throw error
		}
	}

	const toggleDeletePage = (): void => {
		adventureDispatch({ type: 'switchIsDeletePageOpen' })
	}

	return { deleteAdventure, toggleDeletePage }
}
