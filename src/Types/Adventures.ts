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

export type AdventureList = {
	type: 'FeatureCollection'
	features: AdventureFeature[]
}

type BasicAdventureType = {
	adventure_name: string
	adventure_type: AdventureChoiceType
	bio?: string
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

type SkiAdventureType = BasicAdventureType & {
	aspect?: string
	avg_angle?: number
	max_angle?: number
	base_elevation?: number
	summit_elevaiton?: number
	exposure?: number
	season?: string
	path?: TrailPath
	elevations?: ElevationCoordinates
	ski_approach_id?: number
}

type SkiApproachType = BasicAdventureType & {
	distance?: number
	summit_elevation?: number
	base_elevation?: number
	gear?: string
	path?: TrailPath
	elevations?: ElevationCoordinates
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

type HikeAdventureType = BasicAdventureType & {
	base_elevation?: number
	summit_elevation?: number
	distance?: number
	season?: string
	path?: TrailPath
	elevations?: ElevationCoordinates
}

type BikeAdventureType = BasicAdventureType & {
	base_elevation?: number
	summit_elevation?: number
	distance?: number
	season?: string
	path?: TrailPath
	climb?: number
	descent?: number
	elevations?: ElevationCoordinates
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
	longitude: number
	latitude: number
	zoom: number
}

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

type ChangeAdventureEditState = {
	type: 'switchIsAdventureEditable'
}

type SetAdventureError = {
	type: 'setAdventureError'
	payload: string
}

type SetDeletePageState = {
	type: 'switchIsDeletePageOpen'
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
	payload: AdventureChoiceType
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
}

type UpdateTrailPath = {
	type: 'updateTrailPath'
	payload: TrailPath
}

type SetTrailPath = {
	type: 'setTrailPath'
	payload: TrailPath
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
}

type ClearTrailPath = {
	type: 'clearTrailPath'
}

type MoveAdventureMarker = {
	type: 'moveAdventureMarker'
}

export type PathCoordinates = [number, number]
type ElevationCoordinate = [number, number]

export type TrailPath = PathCoordinates[]
export type ElevationCoordinates = ElevationCoordinate[]

export type AdventureAction =
	| SetAllAdventuresType
	| SetNewAdventureView
	| MapDoubleClickEnabled
	| SetCurrentAdventure
	| CloseAdventureView
	| EditAdventure
	| ChangeAdventureEditState
	| SetAdventureError
	| SetDeletePageState
	| DeleteAdventure
	| AdventureTypeView
	| NewAdventureProcess
	| UpdateStartPosition
	| SetInitialValues
	| UpdateAdventureImages
	| DeleteAdventureImageType
	| TogglePathEdit
	| UpdateTrailPath
	| SetTrailPath
	| SetCloseAdventures
	| SetAdventuresList
	| ToggleMatchPath
	| ClearTrailPath
	| MoveAdventureMarker

export type AdventureState = {
	allAdventures: AdventureList | null
	closeAdventures: CloseAdventureObject[] | null
	adventuresList: CloseAdventureObject[] | null
	adventureAddState: boolean
	currentAdventure: AdventureType | null
	adventureEditState: boolean
	adventureError: null | string
	isPathEditOn: boolean
	startPosition: {
		latitude: number
		longitude: number
		zoom: number
	} | null
	isDeletePageOpen: boolean
	globalAdventureType: AdventureChoiceType | null
	workingPath: TrailPath
	matchPath: boolean
}

export type AdventureContext = AdventureState & { adventureDispatch: Dispatch<AdventureAction> }
