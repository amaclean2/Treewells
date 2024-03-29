import { Connections, Storage } from '../../config'
import { useMessagingStateContext } from '../../Providers/MessageStateProvider'
import { fetcher } from '../../utils'
import { conversations } from '../Apis'

export const useMessages = (): {
	initiateConnection: () => void
	setDeviceToken: ({ deviceToken }: { deviceToken: string }) => void
	addConversation: ({ userId }: { userId: number }) => void
	getConversation: ({ conversationId }: { conversationId: number }) => void
	openConversationWithFriend: ({ userId }: { userId: number }) => Promise<void>
	sendMessage: ({
		messageBody,
		conversationId,
		senderName
	}: {
		messageBody: string
		conversationId: number
		senderName: string
	}) => void
	closeConnection: (reason: string) => void
} => {
	const { messageDispatch, websocket, apnsDeviceToken } = useMessagingStateContext()

	const initiateConnection = (): void => {
		if (websocket !== null) {
			return
		}

		const localWebSocket = new WebSocket(Connections.websocketUrl)
		localWebSocket.binaryType = 'blob'

		localWebSocket.onopen = async (): Promise<void> => {
			console.log('Websocket connection established')
			if (apnsDeviceToken === null && Connections.platform === 'native') {
				console.error('Device token must be present before creating a websocket connection')
				localWebSocket.close(
					1008,
					"device token is not present when trying to create a connection. Please restart the app and try again. If this doesn't work, file a bug report."
				)
			}
			Storage.getItem('token').then((token) =>
				localWebSocket.send(
					JSON.stringify({
						type: 'verifyUser',
						token,
						...(Connections.platform === 'native' && { deviceToken: apnsDeviceToken })
					})
				)
			)
		}

		localWebSocket.onmessage = ({ data }) => {
			const response = JSON.parse(data)
			if (response.connected !== undefined) {
				Storage.getItem('token').then((token) =>
					localWebSocket.send(JSON.stringify({ type: 'getAllConversations', token }))
				)
			} else if (response.conversations !== undefined) {
				messageDispatch({ type: 'setConversations', payload: response.conversations })
			} else if (response.messages !== undefined) {
				messageDispatch({ type: 'setMessages', payload: response.messages })
			} else if (response.conversation !== undefined) {
				if (response.conversation.last_message !== '') {
					Storage.getItem('token').then(
						(token) =>
							localWebSocket?.send(
								JSON.stringify({
									type: 'getConversation',
									conversationId: response.conversation.conversation_id,
									token
								})
							)
					)
				} else {
					messageDispatch({
						type: 'addNewConversation',
						payload: response.conversation
					})
				}
			} else if (response.message !== undefined) {
				messageDispatch({ type: 'receiveMessage', payload: response.message })
			}
		}

		localWebSocket.onerror = (error) => {
			console.log({ error })
		}

		localWebSocket.onclose = (event) => {
			console.log({ event })
			console.log('The web socket has been closed')
			messageDispatch({ type: 'closeConnection' })
		}

		messageDispatch({ type: 'initiateConnection', payload: localWebSocket })
	}

	const setDeviceToken = ({ deviceToken }: { deviceToken: string }): void => {
		return messageDispatch({ type: 'setDeviceToken', payload: deviceToken })
	}

	const addConversation = ({ userId }: { userId: number }): void => {
		Storage.getItem('token').then(
			(token) =>
				websocket?.send(JSON.stringify({ type: 'createNewConversation', userIds: [userId], token }))
		)
	}

	const openConversationWithFriend = async ({ userId }: { userId: number }): Promise<void> => {
		try {
			const {
				data: { conversation }
			} = await fetcher(`${conversations.create.url}`, {
				method: conversations.create.method,
				body: {
					user_ids: [userId]
				}
			})

			messageDispatch({ type: 'addNewConversation', payload: conversation })
			getConversation({ conversationId: conversation.conversation_id })
		} catch (error) {
			console.log(error)
		}
	}

	const sendMessage = ({
		messageBody,
		conversationId,
		senderName
	}: {
		messageBody: string
		conversationId: number
		senderName: string
	}): void => {
		Storage.getItem('token').then(
			(token) =>
				websocket?.send(
					JSON.stringify({ type: 'sendMessage', messageBody, conversationId, token, senderName })
				)
		)
	}

	const getConversation = ({ conversationId }: { conversationId: number }): void => {
		// set the current conversation id and send a message to the websocket that we'd like all the messages
		// for that conversation
		messageDispatch({ type: 'setCurrentConversation', payload: conversationId })
		Storage.getItem('token').then(
			(token) => websocket?.send(JSON.stringify({ type: 'getConversation', conversationId, token }))
		)
	}

	const closeConnection = (reason: string): void => {
		websocket?.close(1000, `Conversation window was closed: ${reason}`)
		messageDispatch({ type: 'closeConnection' })
	}

	return {
		initiateConnection,
		addConversation,
		getConversation,
		openConversationWithFriend,
		sendMessage,
		closeConnection,
		setDeviceToken
	}
}
