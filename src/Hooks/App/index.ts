import { useAdventureStateContext } from '../../Providers/AdventureStateProvider'
import { useCardStateContext } from '../../Providers/CardStateProvider'
import type { MapPosition } from '../../Types/Adventures'
import { type URLType } from '../../Types/Cards'

export const useManipulateFlows = (): {
	switchImage: (index: number) => void
	openAlert: (alert: string) => void
	closeAlert: () => void
	closeCard: (message: string) => void
	updateStartPosition: (startPosition: MapPosition) => void
	setImageList: (imageList: URLType[], index: number) => void
	closeImageList: () => void
} => {
	const { cardDispatch } = useCardStateContext()
	const { adventureDispatch } = useAdventureStateContext()

	const switchImage = (index: number): void => {
		cardDispatch({ type: 'setGalleryImage', payload: index })
	}

	const openAlert = (alert: string): void => {
		cardDispatch({ type: 'openAlert', payload: alert })
	}

	const closeAlert = (): void => {
		cardDispatch({ type: 'closeAlert' })
	}

	const closeCard = (message: string): void => {
		cardDispatch({ type: 'closeCardMessage', payload: message })
	}

	const updateStartPosition = (startPosition: MapPosition): void => {
		adventureDispatch({ type: 'updateStartPosition', payload: startPosition })
	}

	const setImageList = (imageList: URLType[], index: number): void => {
		cardDispatch({ type: 'setImageList', payload: { list: imageList, index } })
	}

	const closeImageList = (): void => {
		cardDispatch({ type: 'setImageList', payload: { list: [], index: 0 } })
	}

	return {
		switchImage,
		openAlert,
		closeAlert,
		closeCard,
		updateStartPosition,
		setImageList,
		closeImageList
	}
}
