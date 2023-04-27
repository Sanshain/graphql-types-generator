

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
    files: object,
    value: string
}

export type likeApplyArgs = {
    postId: number
}

export type friendshipApplyArgs = {
    userId: number
}

export type userSettingsMutationArgs = {
    id: number,
    firstName: string,
    lastName?: string,
    birthday?: string,
    sex?: boolean,
    placeId?: number,
    placeType: number
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