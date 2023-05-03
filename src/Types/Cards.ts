import type { Dispatch } from 'react'

type URLSuffixs = '.com' | '.net' | '.co.uk' | '.org' | '.gov' | '.cz' | ''
export type URLType = `${'http://' | 'https://' | 'ws://'}${string}${URLSuffixs}`

type CloseMessage = {
	type: 'closeCardMessage'
	payload: string
}

type SetGalleryImage = {
	type: 'setGalleryImage'
	payload: number
}

type OpenAlert = {
	type: 'openAlert'
	payload: string
}

type CloseAlert = {
	type: 'closeAlert'
}

type SetImageList = {
	type: 'setImageList'
	payload: {
		list: URLType[]
		index: number
	}
}

export type CardAction = CloseMessage | SetGalleryImage | OpenAlert | CloseAlert | SetImageList

export type CardState = {
	galleryImage: number | null
	showAlert: boolean
	alertContent: string
	imageList: URLType[] | null
	screenType: {
		mobile: boolean
		tablet: boolean
		browser: boolean
	}
}

export type CardContext = CardState & { cardDispatch: Dispatch<CardAction> }
