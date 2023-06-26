import { Register, SignInfo, SignUpInfo, PassResetInfo, AccountVerifyingInfo, SignOutInfo } from '../../target/queries'

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
} from '../../target/arguments'




export declare const queryArgs: unique symbol
export declare const queryType: unique symbol
type QueryString<T, A=never> = `
    ${'mutation'|'query'} ${string}` & {[queryArgs]?: A} & {[queryType]?: T}



export const register: QueryString<Register>;


export const SIGN_IN: QueryString<SignInfo>;


export const SIGN_UP: QueryString<SignUpInfo>;


export const PASS_RESET: QueryString<PassResetInfo>;

/**
 *  $token - verifying token
 */

export const ACCOUNT_VERIFY: QueryString<AccountVerifyingInfo>;


export const SIGN_OUT: QueryString<SignOutInfo>;
