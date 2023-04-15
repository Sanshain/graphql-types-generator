

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
    files: any
}

export type likeApplyArgs = {
    postId: number
}

export type friendshipApplyArgs = {
    userId: number
}

export type userSettingsMutationArgs = {
    birthday: string,
    sex: boolean,
    placeId: number,
    placeTypeId: number
}

export type userArgs = {
    id: number
}

export type userSettingsArgs = {
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