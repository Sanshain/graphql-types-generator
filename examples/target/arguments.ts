/* Branded types: */

declare const __brand: unique symbol
type Branded<T, B=never> = T & { [__brand]?: B }

type JSONstring = Branded<string, "JSONstring">
type ID = Branded<number, "ID">
/** yyyy-mm-dd */
type DateString = Branded<string>

let s: string = ''
let a: DateString = s

let f: {a: ID} = {a: 1}

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

    DialogInfo: dialogArgs,
    
    UserSettingsType: userSettingsArgs,
    
    Register: registerArgs,
    SignInfo: tokenAuthArgs,
    
    SignUpInfo: registerArgs,
    AccountVerifyingInfo: verifyAccountArgs,
    VerifyAccount: verifyAccountArgs,
    PostMutation: postCreateArgs,
    LikeMutation: likeApplyArgs,
    FriendshipMutation: friendshipApplyArgs,
    SettingsMutationPayload: userSettingsMutationArgs,
    UserType: userArgs,
    PostType: postsArgs,
    DialogType: dialogArgs,
}