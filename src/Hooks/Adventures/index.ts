import * as turf from '@turf/turf'

import { useAdventureStateContext } from '../../Providers/AdventureStateProvider'
import { useCardStateContext } from '../../Providers/CardStateProvider'
import type { AdventureChoiceType, AdventureType, TrailPath } from '../../Types/Adventures'
import { fetcher, useDebounce } from '../../utils'
import { adventures } from '../Apis'
import type { EventChoiceTypes } from '../Users'

export const useGetAdventures = (): {
	getAdventure: ({ id, type }: { id: number; type: AdventureChoiceType }) => Promise<void>
	getAllAdventures: ({ type }: { type: AdventureChoiceType }) => Promise<void>
	searchAdventures: ({ searchQuery }: { searchQuery: string }) => Promise<any>
	changeAdventureType: ({ type }: { type: AdventureChoiceType }) => void
	enableNewAdventureClick: ({ type }: { type: AdventureChoiceType }) => void
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

			if (adventure.path !== undefined) {
				adventureDispatch({ type: 'setTrailPath', payload: adventure.path })
			}
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
		adventureDispatch({ type: 'setGlobalAdventureType', payload: type })
		// I'm replacing getAllAdventures here with a watcher in adventureStateContext
		// that calls getAllAdventures anytime the globalAdventureState changes
	}

	const enableNewAdventureClick = ({ type }: { type: AdventureChoiceType }): void => {
		adventureDispatch({ type: 'startNewAdventureProcess', payload: type })
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
		processCsvAdventures,
		enableNewAdventureClick
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
	togglePathEdit: () => void
	savePath: () => void
	updatePath: (newPath: TrailPath) => void
	deletePath: () => void
} => {
	const { adventureDispatch, currentAdventure, globalAdventureType, workingPath } =
		useAdventureStateContext()

	const saveEditAdventure = useDebounce(
		async ({ name, value }: { name: string; value: string | number }): Promise<void> => {
			try {
				return await fetcher(adventures.editAdventure.url, {
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
		// event is the adventure value
		saveEditAdventure({ name: event.target.name, value: event.target.value })
		adventureDispatch({
			type: 'editAdventure',
			payload: {
				name: event.target.name,
				value: event.target.value
			}
		})
	}

	const savePath = (): void => {
		try {
			saveEditAdventure({ name: 'path', value: workingPath })

			togglePathEdit()
		} catch (error) {
			console.log('Error saving path', error)
		}
	}

	const deletePath = (): void => {
		saveEditAdventure({ name: 'path', value: [] })
		togglePathEdit()
	}

	const updatePath = (newPath: TrailPath): void => {
		adventureDispatch({ type: 'updateTrailPath', payload: newPath })

		if (workingPath.length > 1) {
			const turfLine = turf.lineString(workingPath)
			const lineLength = Math.round(turf.length(turfLine) * 100) / 100

			adventureDispatch({
				type: 'editAdventure',
				payload: { name: 'distance', value: lineLength.toString() }
			})
		} else {
			adventureDispatch({ type: 'editAdventure', payload: { name: 'distance', value: '0' } })
		}
	}

	const togglePathEdit = (): void => {
		adventureDispatch({ type: 'togglePathEdit' })
	}

	const createNewDefaultAdventure = async ({
		longitude,
		latitude
	}: {
		longitude: number
		latitude: number
	}): Promise<AdventureType> => {
		const newDefaultAdventure: AdventureType = {
			adventure_name: 'New Adventure',
			adventure_type: globalAdventureType as AdventureChoiceType,
			public: true,
			nearest_city: 'New City',
			coordinates: {
				lng: longitude,
				lat: latitude
			}
		}

		if (globalAdventureType !== null && ['ski', 'hike', 'bike'].includes(globalAdventureType)) {
			newDefaultAdventure.difficulty = 1
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
		setAdventureError,
		togglePathEdit,
		savePath,
		deletePath,
		updatePath
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
			adventureDispatch({ type: 'deleteAdventure' })
			cardDispatch({
				type: 'openAlert',
				payload: `${adventureName} has been deleted.`
			})

			await fetcher(
				`${adventures.deleteAdventure.url}?adventure_id=${adventureId}&adventure_type=${adventureType}`,
				{ method: adventures.deleteAdventure.method }
			)
			await getAllAdventures({ type: globalAdventureType as AdventureChoiceType })
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
