

export type ProfileInfo = {
    users: {
        id: number,
        username: any,
        name: string,
        lastName: string,
        image: any,
    } [],
    dialogs: {
        id: number,
        title: string,
        founder: {
            id: number,
            name: string,
            image: any,
        },
        talkersAmount: any,
        lastMessage: {
            author: any,
            value: any,
        },
    } [],
    me: {
        id: number,
        username: string,
        firstName: string,
        lastName: string,
    },
};

export type DialogInfo = {

    __typename: "DialogInfo",

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
            image: any,
        } [],
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
            likesCount: number,
            rated: any,
        } [],
    },
};

export type PaginatedUsers = {
    paginatedUsers: {
        username: any,
        firstName: string,
    } [],
};

export type UserSettingsType = {

    __typename: "UserSettingsType",

    userSettings: {
        username: string,
        firstName: string,
        lastName: string,
        sex: string,
        birthday: string,
        placeId: number,
        country: string,
        city: string,
    },
};

export type Register = {

    __typename: "Register",

    register: {
        success: boolean,
        errors: any,
        token: string,
    },
};

export type SignInfo = {

    __typename: "SignInfo",

    tokenAuth: {
        success: boolean,
        errors: any,
        unarchiving: boolean,
        token: string,
        user: {
            id: number,
            username: string,
        },
    },
};

export type SignUpInfo = {

    __typename: "SignUpInfo",

    register: {
        success: boolean,
        errors: any,
        token: string,
    },
};

export type PassResetInfo = {
    passwordReset: {
        success: any,
        errors: any,
    },
};

export type AccountVerifyingInfo = {

    __typename: "AccountVerifyingInfo",

    verifyAccount: {
        success: boolean,
        errors: any,
    },
};

export type SignOutInfo = {
    revokeToken: {
        success: any,
        errors: any,
    },
};

export type VerifyAccount = {

    __typename: "VerifyAccount",

    verifyAccount: {
        success: boolean,
        errors: any,
    },
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
        increased: boolean,
    },
};

export type FriendshipMutation = {

    __typename: "FriendshipMutation",

    friendshipApply: {
        added: boolean,
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
        },
        clientMutationId: string,
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

    posts: {
        id: number,
        time: string,
        value: string,
        files: object,
        likesCount: number,
        rated: boolean,
    } [],
};

export type DialogType = {

    __typename: "DialogType",

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

/*
* `QueryTypes` - may be need for more flexible types management on client side 
*
* (optional: controlled by `matchTypeNames` option)
*/
export type QueryTypes = {
    ProfileInfo: ProfileInfo
    DialogInfo: DialogInfo
    PaginatedUsers: PaginatedUsers
    UserSettingsType: UserSettingsType
    Register: Register
    SignInfo: SignInfo
    SignUpInfo: SignUpInfo
    PassResetInfo: PassResetInfo
    AccountVerifyingInfo: AccountVerifyingInfo
    SignOutInfo: SignOutInfo
    VerifyAccount: VerifyAccount
    PostMutation: PostMutation
    LikeMutation: LikeMutation
    FriendshipMutation: FriendshipMutation
    SettingsMutationPayload: SettingsMutationPayload
    UserNode: UserNode
    UserType: UserType
    PostType: PostType
    DialogType: DialogType
}
