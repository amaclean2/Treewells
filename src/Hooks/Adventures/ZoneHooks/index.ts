import { useAdventureStateContext } from '../../../Providers/AdventureStateProvider'
import { useZoneStateContext } from '../../../Providers/ZoneStateProvider'
import type { AdventureChoiceType } from '../../../Types/Adventures'
import { fetcher, useDebounce } from '../../../utils'
import { zonesApi } from '../../Apis'
import type { EventChoiceTypes } from '../../Users'
import type {
	AddAdventureToZone,
	AddChildZone,
	EditCoordiantes,
	EditZone,
	GetNearbyZones,
	GetZone
} from './types'

export const useGetZones = (): {
	getNearbyZones: GetNearbyZones
	getZone: GetZone
} => {
	const { globalAdventureType } = useAdventureStateContext()
	const { zoneDispatch } = useZoneStateContext()
	const getNearbyZones = async ({
		type,
		coordinates,
		count = 10,
		parentId
	}: {
		type: AdventureChoiceType
		coordinates: { lat: number; lng: number }
		count?: number
		parentId?: number
	}): Promise<void> => {
		try {
			const parentZoneBlock = parentId !== undefined ? `&parent=${parentId}` : ''
			const {
				data: { zones: closeZones }
			} = await fetcher(
				`${zonesApi.getZonesByDistance.url}?adventure_type=${
					type ?? globalAdventureType
				}&coordinates_lat=${coordinates.lat}&coordinates_lng=${
					coordinates.lng
				}&count=${count}${parentZoneBlock}`,
				{ method: zonesApi.getZonesByDistance.method }
			)

			zoneDispatch({ type: 'setCloseZones', payload: closeZones })
		} catch (error) {
			console.log(error)
		}
	}

	const getZone = async ({ id }: { id: number }): Promise<void> => {
		if (id === undefined) zoneDispatch({ type: 'setZoneError', payload: 'id field is required' })

		try {
			const {
				data: { zone }
			} = await fetcher(`${zonesApi.getZoneDetails.url}?zone_id=${id}`, {
				method: zonesApi.getZoneDetails.method
			})

			zoneDispatch({ type: 'setCurrentZone', payload: zone })
		} catch (error) {
			zoneDispatch({
				type: 'setZoneError',
				payload: 'error fetching adventure, please try again or do some other stuff...'
			})

			throw error
		}
	}

	return {
		getNearbyZones,
		getZone
	}
}

export const useSaveZones = (): {
	editZone: EditZone
	editCoordinates: EditCoordiantes
	addAdventureToZone: AddAdventureToZone
	addChildZone: AddChildZone
} => {
	const { currentZone, zoneDispatch } = useZoneStateContext()
	const saveEditZone = useDebounce(
		async ({ name, value }: { name: string; value: string | number }): Promise<void> => {
			try {
				return await fetcher(zonesApi.editZone.url, {
					method: zonesApi.editZone.method,
					body: {
						field: {
							field_name: name,
							field_value: value,
							zone_id: currentZone?.id
						}
					}
				})
			} catch (error) {
				zoneDispatch({ type: 'setZoneError', payload: 'could not edit zone' })
				throw error
			}
		}
	)

	const editZone = async (event: EventChoiceTypes): Promise<void> => {
		// event is the adventure value
		zoneDispatch({
			type: 'editZone',
			payload: {
				zoneProperty: event.target.name,
				zoneValue: event.target.value
			}
		})

		await saveEditZone({ name: event.target.name, value: event.target.value })
	}

	const editCoordinates = async (coordinates: { lat: number; lng: number }): Promise<void> => {
		zoneDispatch({
			type: 'editZone',
			payload: {
				zoneProperty: 'coordiantes',
				zoneValue: JSON.stringify([coordinates.lng, coordinates.lat])
			}
		})

		const {
			data: { all_zones: payload }
		} = await fetcher(zonesApi.editZone.url, {
			method: zonesApi.editZone.method,
			body: {
				field: {
					field_name: 'coordinates',
					field_value: coordinates,
					zone_id: currentZone?.id
				}
			}
		})

		zoneDispatch({ type: 'setAllZones', payload })
	}

	const addAdventureToZone = async ({
		parentId,
		adventureId
	}: {
		parentId: number
		adventureId: number
	}): Promise<void> => {
		try {
			const {
				data: { zone }
			} = await fetcher(zonesApi.addChild.url, {
				method: zonesApi.addChild.method,
				body: {
					child_type: 'adventure',
					parent_zone_id: parentId,
					adventure_id: adventureId
				}
			})

			zoneDispatch({ type: 'setCurrentZone', payload: zone })
		} catch (error) {
			console.log(error)
		}
	}

	const addChildZone = async ({
		parentId,
		childId
	}: {
		parentId: number
		childId: number
	}): Promise<void> => {
		try {
			const {
				data: { zone }
			} = await fetcher(zonesApi.addChild.url, {
				method: zonesApi.addChild.method,
				body: {
					child_type: 'zone',
					parent_zone_id: parentId,
					child_zone_id: childId
				}
			})

			zoneDispatch({ type: 'setCurrentZone', payload: zone })
		} catch (error) {
			console.log(error)
		}
	}

	return {
		editZone,
		editCoordinates,
		addAdventureToZone,
		addChildZone
	}
}
