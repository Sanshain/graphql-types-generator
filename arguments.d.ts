

/* Mutation Arguments types:*/

export type postCreateArgs = {
    files: any,
    value: string
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
    postCreate: postCreateArgs,
    likeApply: likeApplyArgs,
    friendshipApply: friendshipApplyArgs,
    userSettingsMutation: userSettingsMutationArgs,
}