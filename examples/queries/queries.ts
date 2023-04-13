

export type PostMutation = {

    __typename: "PostMutation",

    postCreate: {
        post: {
            id: number,
            time: string,
            value: any,
            files: any,
        },
    },
};

export type LikeMutation = {

    __typename: "LikeMutation",

    likeApply: {
        increased: any,
    },
};

export type FriendshipMutation = {

    __typename: "FriendshipMutation",

    friendshipApply: {
        added: any,
    },
};

export type SettingsMutationPayload = {

    __typename: "SettingsMutationPayload",

    userSettingsMutation: {
        profile: {
            id: number,
            username: any,
            firstName: string,
            lastName: string,
            dateJoined: string,
            placeId: number,
        },
        errors: any,
        settings: {
            firstName: string,
        }[],
        clientMutationId: number,
    },
};

export type UserNode = {
    me: {
        id: number,
        lastLogin: string,
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        isStaff: boolean,
        isActive: boolean,
        dateJoined: string,
        avatar: string,
        sex: boolean,
        placeId: number,
        pk: number,
        archived: boolean,
        verified: boolean,
        secondaryEmail: string,
    },
};

export type UserType = {

    __typename: "UserType",

    user: {
        id: number,
        lastLogin: string,
        username: string,
        firstName: string,
        lastName: string,
        dateJoined: string,
        avatar: string,
        sex: boolean,
        placeId: number,
        name: string,
        image: string,
        friendshipState: number,
    },
};

export type PostType = {

    __typename: "PostType",

    posts: Array<{
        id: number,
        time: string,
        value: string,
        files: any,
        likesCount: number,
        rated: boolean,
    }>,
};

export type DialogType = {

    __typename: "DialogType",

    dialog: {
        id: number,
        avatar: string,
        title: string,
        talkersAmount: number,
        lastMessage: {
            author: any,
            value: any,
        },
    },
};

/*
* `QueryTypes` - may be need for more flexible types management on client side 
*
* (optional: controlled by `matchTypeNames` option)
*/
export type QueryTypes = {
    PostMutation: PostMutation
    LikeMutation: LikeMutation
    FriendshipMutation: FriendshipMutation
    SettingsMutationPayload: SettingsMutationPayload
    UserNode: UserNode
    UserType: UserType
    PostType: PostType
    DialogType: DialogType
}
