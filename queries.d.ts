

export type ProfileInfo = {
    users: Array<{
        id: number,
        username: string,
        name: string,
        lastName: string,
        image: string,
    }>,
    dialogs: Array<{
        id: number,
        title: string,
        founder: {
            id: number,
            lastLogin: string,
            username: string,
            firstName: string,
            lastName: string,
            dateJoined: string,
            avatar: string,
            sex: boolean,
            birthday: string,
            placeId: number,
            name: string,
            image: string,
            friendshipState: number,
        },
        talkersAmount: number,
        lastMessage: {
            author: string,
            value: string,
        },
    }>,
    me: {
        id: number,
        username: string,
        firstName: string,
        lastName: string,
    },
};

export type DialogInfo = {
    dialog: {
        id: number,
        title: string,
        founder: {
            id: number,
            lastLogin: string,
            username: string,
            firstName: string,
            lastName: string,
            dateJoined: string,
            avatar: string,
            sex: boolean,
            birthday: string,
            placeId: number,
            name: string,
            image: string,
            friendshipState: number,
        },
        users: {
            id: number,
            name: string,
            image: string,
        }[],
        messages: {
            id: number,
            author: any,
            time: string,
            value: any,
            files: any,
            replyTo: {
                id: number,
                time: string,
                value: any,
                files: any,
                author: any,
            },
            likesCount: any,
            rated: any,
        }[],
    },
};

export type PaginatedUsers = {
    paginatedUsers: Array<{
        username: any,
        firstName: string,
    }>,
};

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
    dialog: {
        id: number,
        avatar: string,
        title: string,
        talkersAmount: number,
        lastMessage: {
            author: string,
            value: string,
        },
    },
};

export type SignInfo = {
    tokenAuth: {
        success: any,
        errors: any,
        unarchiving: any,
        token: any,
        user: {
            id: number,
            username: string,
        },
    },
};

export type SignUpInfo = {
    register: {
        success: any,
        errors: any,
        token: any,
    },
};

export type PassResetInfo = {
    passwordReset: {
        success: any,
        errors: any,
    },
};

export type AccountVerifyingInfo = {
    verifyAccount: {
        success: any,
        errors: any,
    },
};

export type SignOutInfo = {
    revokeToken: {
        success: any,
        errors: any,
    },
};

export type undefined = {
    tokenAuth: {
        success: any,
        errors: any,
        token: any,
        refreshToken: any,
        unarchiving: any,
        user: {
            id: number,
            username: string,
        },
    },
};

/*
* `QueryTypes` - may be need for more flexible types management on client side 
*
* (optional: controlled by `matchTypeNames` option)
*/
type QueryTypes = {
    ProfileInfo: ProfileInfo
    DialogInfo: DialogInfo
    PaginatedUsers: PaginatedUsers
    PostMutation: PostMutation
    LikeMutation: LikeMutation
    FriendshipMutation: FriendshipMutation
    SettingsMutationPayload: SettingsMutationPayload
    UserNode: UserNode
    UserType: UserType
    PostType: PostType
    DialogType: DialogType
    SignInfo: SignInfo
    SignUpInfo: SignUpInfo
    PassResetInfo: PassResetInfo
    AccountVerifyingInfo: AccountVerifyingInfo
    SignOutInfo: SignOutInfo
    undefined: undefined
}
