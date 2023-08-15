

/* Mutation Arguments types:*/

export type userSettingsArgs = {
    id: number
}

export type dialogArgs = {
    first: number
    id: number
}

export type messagesArgs = {
    id: number,
    to: number
}

export type userArgs = {
    id: number
}

export type paginatedUsersArgs = {
    filter: string
}

export type postsArgs = {
    user: number
}

export type registerArgs = {
    email: string,
    username: string,
    password1: string,
    password2: string
}

export type verifyAccountArgs = {
    token: string
}

export type tokenAuthArgs = {
    password: string,
    email: string,
    username: string
}

export type updateAccountArgs = {
    firstName: string,
    lastName: string
}

export type postCreateArgs = {
    files: JSONstring,
    value: string
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


export type ArgTypes = {
    undefined: never,

    DialogInfo: dialogArgs,
    PaginatedUsers: paginatedUsersArgs,
    
    UserSettingsType: userSettingsArgs,
    UploadMessages: messagesArgs,
    
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