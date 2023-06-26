import { ProfileInfo, DialogInfo, PaginatedUsers, UserSettingsType, uploadMessages } from '../target/queries'

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
	userArgs,
	paginatedUsersArgs,
	postsArgs,
	dialogArgs 
} from '../target/arguments'




export declare const queryArgs: unique symbol
export declare const queryType: unique symbol
type QueryString<T, A=never> = `
    ${'mutation'|'query'} ${string}` & {[queryArgs]?: A} & {[queryType]?: T}


/**
 * dialog list initialization
 * 
 * =- firstName,
 */

export let GetProfileInfo: QueryString<ProfileInfo> = `
    query `

/**
 * just one dialog initial
 */

export const get_DialogInit: QueryString<DialogInfo>;

/**
 * paginatedUsers(filter:"{'exclude' : $exclude, 'icontains': '$icontains', 'only_friends': $only_friends}")
 * paginatedUsers(filter:$filter)
 * 
 * @using
 * filter:"{'exclude' : {'id__in': [1,2,5]}, 'icontains': 'Bob1', 'only_friends': 1}"
 */

export const getPaginatedUsers: QueryString<PaginatedUsers>;


export const userSettingsType: QueryString<UserSettingsType>;


export const getMessages: QueryString<uploadMessages> = `
	query `;