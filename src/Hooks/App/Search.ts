import type { AdventureSearchElement } from '../../Types/Adventures'
import type { UserSearchElement } from '../../Types/User'
import type { ZoneSearchElement } from '../../Types/Zones'
import { fetcher } from '../../utils'
import { searchApi } from '../Apis'

type SearchUserDef = ({
	userId,
	searchText,
	amongFriends
}: {
	userId: number
	searchText: string
	amongFriends: boolean
}) => Promise<UserSearchElement[]>

type SearchAdventureDef = ({
	parentZoneId,
	searchText
}: {
	parentZoneId: number
	searchText: string
}) => Promise<AdventureSearchElement[]>

type SearchZoneDef = ({
	parentZoneId,
	searchText
}: {
	parentZoneId: number
	searchText: string
}) => Promise<ZoneSearchElement[]>

export const useSearch = (): {
	searchUsers: SearchUserDef
	searchAdventures: SearchAdventureDef
	searchZones: SearchZoneDef
} => {
	const searchUsers = async ({
		userId,
		searchText,
		amongFriends = false
	}: {
		userId: number
		searchText: string
		amongFriends: boolean
	}): Promise<UserSearchElement[]> => {
		try {
			const {
				data: { searchResults }
			} = await fetcher(
				`${
					searchApi.searchForUser.url
				}?id=${userId}&friends=${amongFriends.toString()}&q=${searchText}`,
				{
					method: searchApi.searchForUser.method
				}
			)

			return searchResults
		} catch (error) {
			console.log(error)
			return [] as UserSearchElement[]
		}
	}

	const searchAdventures = async ({
		parentZoneId,
		searchText
	}: {
		parentZoneId: number
		searchText: string
	}): Promise<AdventureSearchElement[]> => {
		try {
			const parentZoneBlock = parentZoneId !== undefined ? `&id=${parentZoneId}` : ''
			const {
				data: { searchResults }
			} = await fetcher(`${searchApi.searchForAdventure.url}?q=${searchText}${parentZoneBlock}`)

			return searchResults
		} catch (error) {
			console.log(error)
			return [] as AdventureSearchElement[]
		}
	}

	const searchZones = async ({
		parentZoneId,
		searchText
	}: {
		parentZoneId: number
		searchText: string
	}): Promise<ZoneSearchElement[]> => {
		try {
			const parentZoneBlock = parentZoneId !== undefined ? `&id=${parentZoneId}` : ''
			const {
				data: { searchResults }
			} = await fetcher(`${searchApi.searchForZone.url}?q=${searchText}${parentZoneBlock}`)

			return searchResults
		} catch (error) {
			console.log(error)
			return [] as ZoneSearchElement[]
		}
	}

	return {
		searchUsers,
		searchAdventures,
		searchZones
	}
}
