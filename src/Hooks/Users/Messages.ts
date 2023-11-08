import { Connections, Storage } from '../../config'
import { useMessagingStateContext } from '../../Providers/MessageStateProvider'
import { fetcher } from '../../utils'
import { conversations } from '../Apis'

export const useMessages = (): {
	initiateConnection: () => void
	addConversation: ({ userId }: { userId: number }) => void
	getConversation: ({ conversationId }: { conversationId: number }) => void
	openConversationWithFriend: ({ userId }: { userId: number }) => Promise<void>
	sendMessage: ({
		messageBody,
		conversationId
	}: {
		messageBody: string
		conversationId: number
	}) => void
	closeConnection: (reason: string) => void
} => {
	const { messageDispatch, websocket } = useMessagingStateContext()

	const initiateConnection = (): void => {
		if (websocket !== null) {
			websocket.close()
		}

		console.log(`Opening connection to ${Connections.websocketUrl}`)
		const localWebSocket = new WebSocket(Connections.websocketUrl)
		localWebSocket.binaryType = 'blob'

		localWebSocket.onopen = async (): Promise<void> => {
			console.log('Websocket connection established')
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

		localWebSocket.onerror = (error) => {
			console.log({ error })
		}

		localWebSocket.onclose = (event) => {
			console.log({ event })
			console.log('The web socket has been closed')
		}

		messageDispatch({ type: 'initiateConnection', payload: localWebSocket })
	}

	const addConversation = ({ userId }: { userId: number }): void => {
		websocket?.send(JSON.stringify({ type: 'createNewConversation', userIds: [userId] }))
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
		} catch (error) {
			console.log(error)
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

	const closeConnection = (reason: string): void => {
		websocket?.close(1000, `Conversation window was closed because ${reason}`)
	}

	return {
		initiateConnection,
		addConversation,
		getConversation,
		openConversationWithFriend,
		sendMessage,
		closeConnection
	}
}
