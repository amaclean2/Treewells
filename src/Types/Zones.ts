import type { Dispatch } from 'react'
import type { AdventureChoiceType, AdventureType, BreadcrumbElement } from './Adventures'

export type ZoneState = {
	allZones: ZoneGeoJSONObj | null
	closeZones: MinimalZone[] | null
	currentZone: FullZone | null
	zoneError: string | null
}

type ZoneGeoJSONGeometry = {
	type: 'Point'
	coordinates: number[]
}

type ZoneGeoJSONFeature = {
	type: 'Feature'
	properties: Record<string, undefined>
	geometry: ZoneGeoJSONGeometry
}

export type ZoneGeoJSONObj = {
	type: 'FeatureCollection'
	features: ZoneGeoJSONFeature[]
}

export type ZoneSearchElement = {
	zone_id: number
	zone_name: string
	adventure_type: AdventureChoiceType
	nearest_city: string
}

type SetAllZones = {
	type: 'setAllZones'
	payload: ZoneGeoJSONObj
}

type SetCloseZones = {
	type: 'setCloseZones'
	payload: MinimalZone[]
}

type SetCurrentZone = {
	type: 'setCurrentZone'
	payload: FullZone
}

type EditZone = {
	type: 'editZone'
	payload: {
		zoneProperty: string
		zoneValue: string | number
	}
}

type AddAdventure = {
	type: 'addAdventure'
	payload: {
		adventure: AdventureType
	}
}

type AddSubzone = {
	type: 'addSubzone'
	payload: {
		zone: MinimalZone
	}
}

type RemoveAdventure = {
	type: 'removeAdventure'
	payload: AdventureType[]
}

type RemoveSubzone = {
	type: 'removeSubzone'
	payload: MinimalZone[]
}

type SetZoneError = {
	type: 'setZoneError'
	payload: string
}

export type MinimalZone = {
	bio?: string
	approach?: string
	zone_name: string
	adventure_type: AdventureChoiceType
	id?: number
	zone_id?: number
	coordinates: {
		lat: number
		lng: number
	}
}

export type FullZone = MinimalZone & {
	adventures?: AdventureType[]
	zones?: MinimalZone[]
	images?: string[]
	breadcrumb?: BreadcrumbElement[]
	creator_id?: number
	creator_name?: string
	creator_email?: string
}

export type ZoneAction =
	| SetAllZones
	| SetCloseZones
	| SetCurrentZone
	| SetZoneError
	| EditZone
	| AddAdventure
	| AddSubzone
	| RemoveAdventure
	| RemoveSubzone

export type ZoneContext = ZoneState & { zoneDispatch: Dispatch<ZoneAction> }
