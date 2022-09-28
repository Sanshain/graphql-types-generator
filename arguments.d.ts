

/* Mutation Arguments types:*/

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


export type ArgTypes = {

    undefined: any,
    PostMutation: postCreateArgs,
    LikeMutation: likeApplyArgs,
    FriendshipMutation: friendshipApplyArgs,
    SettingsMutationPayload: userSettingsMutationArgs,
}