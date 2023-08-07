import {  } from '../target/queries'

import {
	registerArgs,
	verifyAccountArgs,
	tokenAuthArgs,
	updateAccountArgs,
	postCreateArgs,
	likeApplyArgs,
	friendshipApplyArgs,
	userSettingsMutationArgs,
	userSettingsArgs,
	dialogArgs,
	messagesArgs,
	userArgs,
	paginatedUsersArgs,
	postsArgs 
} from '../target/arguments'


export declare const queryArgs: unique symbol
export declare const queryType: unique symbol
type QueryString<T, A=never> = `
    ${'mutation'|'query'} ${string}` & {[queryArgs]?: A} & {[queryType]?: T}

