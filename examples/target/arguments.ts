/* Screen types: */

declare const __brand: unique symbol
type ScreenType<T, B=never> = T & { [__brand]?: B }

type JSONstring = ScreenType<string, "JSONstring">
type ID = ScreenType<number, "ID">
/** yyyy-mm-dd */
type DateString = ScreenType<string>



/* Mutation Arguments types:*/

export type registerArgs = {
    email: any,
    username: any,
    password1: any,
    password2: any
}

export type verifyAccountArgs = {
    token: any
}

export type tokenAuthArgs = {
    password: any,
    email: string,
    username: string
}

export type updateAccountArgs = {
    firstName: string,
    lastName: string
}

export type postCreateArgs = {
    value: string,
    files: JSONstring
}

export type likeApplyArgs = {
    postId: number
}

export type friendshipApplyArgs = {
    userId: number
}

export type userSettingsMutationArgs = {
    id: ID,
    firstName: string,
    lastName: null | string,
    birthday: null | DateString,
    sex: null | boolean,
    placeId: null | number,
    placeType: null | ID
}

export type userSettingsArgs = {
    id: number
}

export type userArgs = {
    id: number
}

export type postsArgs = {
    user: number
}

export type dialogArgs = {
    id: number
}


export type ArgTypes = {
    undefined: never,

}