import type { Dispatch } from 'react'
import type { URLType } from './Cards'

export type AdventureChoiceType = 'ski' | 'climb' | 'hike' | 'bike' | 'skiApproach'

type CompletedUserType = {
	adventure_id: number
	email: string
	display_name: string
	profile_picture_url: string | null
	user_id: number
}

type TodoUserType = {
	display_name: string
	email: string
	profile_picture_url: string | null
	user_id: number
}

type AdventureFeature = {
	type: 'Feature'
	geometry: {
		type: 'Point'
		coordinates: number[]
	}
	properties: {
		adventure_name: string
		adventure_type: AdventureChoiceType
		id: number
		public: boolean
	}
}

export type AdventureSearchElement = {
	adventure_id: number
	adventure_name: string
	adventure_type: AdventureChoiceType
	nearest_city: string
}

export type AdventureList = {
	type: 'FeatureCollection'
	features: AdventureFeature[]
}

export type BreadcrumbElement = {
	id: number
	name: string
	category_type: 'adventure' | 'zone'
}

type BasicAdventureType = {
	adventure_name: string
	adventure_type: AdventureChoiceType
	bio?: string
	breadcrumb?: BreadcrumbElement[]
	completed_users?: CompletedUserType[]
	todo_users?: TodoUserType[]
	coordinates: {
		lat: number
		lng: number
	}
	creator_email?: string
	creator_id?: number
	creator_name?: string
	date_created?: string
	id?: number
	images?: string[]
	nearest_city: string
	public: boolean
	difficulty?: string
	rating?: string
}

export type ZoneType = {
	adventure_type: AdventureChoiceType
	zone_name: string
	bio?: string
	creator_email?: string
	creator_id?: number
	creator_name?: string
	date_created?: string
	id?: number
	images?: string[]
	nearest_city: string
	public: boolean
	coordinates: {
		lat: number
		lng: number
	}
}

type PathAdventureType = {
	points?: TrailPath
	path?: TrailPath
	elevations?: ElevationCoordinates
	summit_elevation?: number
	base_elevation?: number
}

type SkiAdventureType = BasicAdventureType &
	PathAdventureType & {
		aspect?: string
		avg_angle?: number
		max_angle?: number
		exposure?: number
		season?: string
		ski_approach_id?: number
	}

type SkiApproachType = BasicAdventureType &
	PathAdventureType & {
		distance?: number
		gear?: string
	}

type ClimbAdventureType = BasicAdventureType & {
	distance?: number
	approach: string
	climb_type: string
	first_ascent: string
	pitches: number
	protection: string
	season: string
}

type HikeAdventureType = BasicAdventureType &
	PathAdventureType & {
		distance?: number
		season?: string
	}

type BikeAdventureType = BasicAdventureType &
	PathAdventureType & {
		distance?: number
		season?: string
		climb?: number
		descent?: number
	}

type CloseAdventureObject = {
	id: number
	adventure_name: string
	difficulty: string
	rating: string
	nearest_city: string
	bio: string
}

export type AdventureType =
	| SkiAdventureType
	| SkiApproachType
	| ClimbAdventureType
	| HikeAdventureType
	| BikeAdventureType

export type MapPosition = {
	lng: number
	lat: number
	zoom: number
}

export type PathCoordinates = [number, number] | [0]
type ElevationCoordinate = [number, number]

export type TrailPath = PathCoordinates[]
export type ElevationCoordinates = ElevationCoordinate[]

type SetAllAdventuresType = {
	type: 'setAllAdventures'
	payload: AdventureList
}

type SetNewAdventureView = {
	type: 'addNewAdventure'
	payload: {
		adventures: AdventureList
		currentAdventure: AdventureType
	}
}

type MapDoubleClickEnabled = {
	type: 'enableMapDoubleClick'
}

type SetCurrentAdventure = {
	type: 'setCurrentAdventure'
	payload: AdventureType
}

type CloseAdventureView = {
	type: 'closeAdventureView'
}

type EditAdventure = {
	type: 'editAdventure'
	payload: {
		name: string
		value: string
	}
}

type SetAdventureError = {
	type: 'setAdventureError'
	payload: string
}

type ToggleDeletePage = {
	type: 'toggleIsDeletePageOpen'
	payload?: boolean
}

type DeleteAdventure = {
	type: 'deleteAdventure'
}

type UpdateStartPosition = {
	type: 'updateStartPosition'
	payload: MapPosition
}

type AdventureTypeView = {
	type: 'setGlobalAdventureType'
	payload: AdventureChoiceType
}

type SetInitialValues = {
	type: 'setInitialValues'
	payload: {
		startPosition: MapPosition
		globalAdventureType: AdventureChoiceType
	}
}

type NewAdventureProcess = {
	type: 'startNewAdventureProcess'
	payload: { type: AdventureChoiceType; isZone: boolean }
}

type UpdateAdventureImages = {
	type: 'updateAdventureImages'
	payload: URLType
}

type DeleteAdventureImageType = {
	type: 'deleteAdventureImage'
	payload: URLType
}

type TogglePathEdit = {
	type: 'togglePathEdit'
	payload?: boolean
}

type UpdateTrailPath = {
	type: 'updateTrailPath'
	payload: {
		path?: TrailPath
		points?: TrailPath
		elevations?: ElevationCoordinates
		maxEl?: number
		minEl?: number
	}
}

type SetCloseAdventures = {
	type: 'setCloseAdventures'
	payload: CloseAdventureObject[]
}

type SetAdventuresList = {
	type: 'setAdventuresList'
	payload: CloseAdventureObject[]
}

type ToggleMatchPath = {
	type: 'toggleMatchPath'
	payload?: boolean
}

type ClearTrailPath = {
	type: 'clearTrailPath'
}

type ToggleAdventureAddState = {
	type: 'toggleAdventureAddState'
	payload: false | 'zone' | 'adventure'
}

export type AdventureAction =
	| SetAllAdventuresType
	| SetNewAdventureView
	| MapDoubleClickEnabled
	| SetCurrentAdventure
	| CloseAdventureView
	| EditAdventure
	| SetAdventureError
	| ToggleDeletePage
	| DeleteAdventure
	| AdventureTypeView
	| NewAdventureProcess
	| UpdateStartPosition
	| SetInitialValues
	| UpdateAdventureImages
	| DeleteAdventureImageType
	| TogglePathEdit
	| UpdateTrailPath
	| SetCloseAdventures
	| SetAdventuresList
	| ToggleMatchPath
	| ClearTrailPath
	| ToggleAdventureAddState

export type AdventureState = {
	allAdventures: AdventureList | null
	closeAdventures: CloseAdventureObject[] | null
	adventureAddState: false | 'zone' | 'adventure'
	currentAdventure: AdventureType | null
	adventureError: null | string
	isPathEditOn: boolean
	startPosition: {
		lat: number
		lng: number
		zoom: number
	} | null
	isDeletePageOpen: boolean
	globalAdventureType: AdventureChoiceType | null
	workingPath: {
		path: TrailPath
		elevations: ElevationCoordinates
		points: TrailPath
		maxEl: number
		minEl: number
	}
	matchPath: boolean
}

export type AdventureContext = AdventureState & { adventureDispatch: Dispatch<AdventureAction> }
