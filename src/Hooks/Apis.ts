type ApiObject = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE'
	url: string
}

type UserObject = {
	create: ApiObject
	login: ApiObject
	getLoggedIn: ApiObject
	getById: ApiObject
	edit: ApiObject
	searchForUser: ApiObject
	searchForFriend: ApiObject
	followUser: ApiObject
	sendPasswordResetLink: ApiObject
	createNewPassword: ApiObject
	delete: ApiObject
}

type TokenObject = {
	getInitialCall: ApiObject
}

type AdventureObject = {
	create: ApiObject
	getAllAdventures: ApiObject
	getAdventureDetails: ApiObject
	getAdventuresByDistance: ApiObject
	searchForAdventures: ApiObject
	editAdventure: ApiObject
	processAdventureCSV: ApiObject
	builkImport: ApiObject
	deleteAdventure: ApiObject
	createTodo: ApiObject
	completeAdventure: ApiObject
}

type PicturesObject = {
	upload: ApiObject
	delete: ApiObject
	deleteProfilePicture: ApiObject
	changeProfilePicture: ApiObject
}

type ConversationsObject = {
	create: ApiObject
	getConversations: ApiObject
	addUserToConversation: ApiObject
}

export const users: UserObject = {
	create: {
		url: '/users',
		method: 'POST'
	},
	login: {
		url: '/users/login',
		method: 'POST'
	},
	getLoggedIn: {
		url: '/users/loggedIn',
		method: 'GET'
	},
	getById: {
		url: '/users/id',
		method: 'GET'
	},
	edit: {
		url: '/users',
		method: 'PUT'
	},
	searchForUser: {
		url: '/users/search',
		method: 'GET'
	},
	searchForFriend: {
		url: '/users/friendSearch',
		method: 'GET'
	},
	followUser: {
		url: '/users/follow',
		method: 'GET'
	},
	sendPasswordResetLink: {
		url: '/users/passwordResetLink',
		method: 'POST'
	},
	createNewPassword: {
		url: '/users/newPassword',
		method: 'POST'
	},
	delete: {
		url: '/users',
		method: 'DELETE'
	}
}

export const tokens: TokenObject = {
	getInitialCall: {
		url: '/services/initial',
		method: 'GET'
	}
}

export const adventures: AdventureObject = {
	create: {
		url: '/adventures',
		method: 'POST'
	},
	getAllAdventures: {
		url: '/adventures/all',
		method: 'GET'
	},
	getAdventureDetails: {
		url: '/adventures/details',
		method: 'GET'
	},
	getAdventuresByDistance: {
		url: '/adventures/distance',
		method: 'GET'
	},
	searchForAdventures: {
		url: '/adventures/search',
		method: 'GET'
	},
	editAdventure: {
		url: '/adventures',
		method: 'PUT'
	},
	processAdventureCSV: {
		url: '/adventures/processCsv',
		method: 'POST'
	},
	builkImport: {
		url: '/adventures/bulkImport',
		method: 'POST'
	},
	deleteAdventure: {
		url: '/adventures',
		method: 'DELETE'
	},
	createTodo: {
		url: '/adventures/todo',
		method: 'POST'
	},
	completeAdventure: {
		url: '/adventures/complete',
		method: 'POST'
	}
}

export const pictures: PicturesObject = {
	upload: {
		url: '/pictures',
		method: 'POST'
	},
	delete: {
		url: '/pictures/delete',
		method: 'PUT'
	},
	changeProfilePicture: {
		url: '/pictures/changeProfilePicture',
		method: 'PUT'
	},
	deleteProfilePicture: {
		url: '/pictures/deleteProfilePicture',
		method: 'PUT'
	}
}

export const conversations: ConversationsObject = {
	getConversations: {
		url: '/conversations',
		method: 'GET'
	},
	create: {
		url: '/conversations',
		method: 'POST'
	},
	addUserToConversation: {
		url: '/conversations/addUser',
		method: 'POST'
	}
}
