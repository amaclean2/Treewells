import { Connections, Storage } from '../../config'
import { useMessagingStateContext } from '../../Providers/MessageStateProvider'
import { useUserStateContext } from '../../Providers/UserStateProvider'

export const useMessages = (): {
	initiateConnection: () => void
	addConversation: ({ userId, name }: { userId: number; name: string }) => void
	getConversation: ({ conversationId }: { conversationId: number }) => void
	sendMessage: ({
		messageBody,
		conversationId
	}: {
		messageBody: string
		conversationId: number
	}) => void
	closeConnection: () => void
} => {
	const { messageDispatch, websocket, conversations } = useMessagingStateContext()
	const { loggedInUser } = useUserStateContext()

	const initiateConnection = (): void => {
		if (websocket !== null) {
			websocket.close()
		}

		const localWebSocket = new WebSocket(Connections.websocketUrl)

		localWebSocket.onopen = async (): Promise<void> => {
			const token = await Storage.getItem('token')
			localWebSocket.send(JSON.stringify({ type: 'verifyUser', token }))
		}

		localWebSocket.onmessage = ({ data }) => {
			const response = JSON.parse(data)
			if (response.connected !== undefined) {
				localWebSocket.send(JSON.stringify({ type: 'getAllConversations' }))
			} else if (response.conversations !== undefined) {
				messageDispatch({ type: 'setConversations', payload: response.conversations })
			} else if (response.messages !== undefined) {
				messageDispatch({ type: 'setMessages', payload: response.messages })
			} else if (response.conversation !== undefined) {
				messageDispatch({
					type: 'addNewConversation',
					payload: response.conversation
				})
			} else if (response.message !== undefined) {
				messageDispatch({ type: 'receiveMessage', payload: response.message })
			}
		}

		localWebSocket.onclose = () => {
			console.log('The web socket has been closed')
		}

		messageDispatch({ type: 'initiateConnection', payload: localWebSocket })
	}

	const checkIfConversationExists = (userIds: number[]): false | number => {
		if (conversations === null) {
			return false
		}

		// sort the userIds and turn the list into a string
		const userIdString = userIds.sort((a, b) => a - b).join(',')

		let matchingConversation: number = -1

		// sort the userIds of each conversation and turn them into a string
		const conversationIdMap = Object.values(conversations).map((conversation) => ({
			id: conversation.conversation_id,
			users: conversation.users
				.map((user) => user.user_id)
				.sort((a, b) => a - b)
				.join(',')
		}))

		// see if any of the userIds in the conversations match the one provided
		const conversationMatch = conversationIdMap.some((conversation) => {
			const isMatch = userIdString === conversation.users

			if (isMatch) {
				matchingConversation = conversation.id
				return true
			}

			return false
		})

		return conversationMatch ? matchingConversation : false
	}

	const addConversation = ({ userId, name }: { userId: number; name?: string }): void => {
		const conversationExists = checkIfConversationExists([userId, loggedInUser?.id as number])

		if (conversationExists === false) {
			websocket?.send(JSON.stringify({ type: 'createNewConversation', userIds: [userId], name }))
		} else {
			messageDispatch({ type: 'setCurrentConversation', payload: conversationExists })
		}
	}

	const sendMessage = ({
		messageBody,
		conversationId
	}: {
		messageBody: string
		conversationId: number
	}): void => {
		websocket?.send(JSON.stringify({ type: 'sendMessage', messageBody, conversationId }))
	}

	const getConversation = ({ conversationId }: { conversationId: number }): void => {
		// set the current conversation id and send a message to the websocket that we'd like all the messages
		// for that conversation
		messageDispatch({ type: 'setCurrentConversation', payload: conversationId })
		websocket?.send(JSON.stringify({ type: 'getConversation', conversationId }))
	}

	const closeConnection = (): void => {
		websocket?.close(1000, 'Conversation window was closed')
	}

	return {
		initiateConnection,
		addConversation,
		getConversation,
		sendMessage,
		closeConnection
	}
}
