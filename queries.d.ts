

export type ProfileInfo = {

    __typename: ProfileInfo,

    users: Array<{
        id: number,
        username: any,
        name: string,
        lastName: string,
        image: any,
    }>,
    dialogs: Array<{
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
    }>,
    me: {
        id: number,
        username: any,
        firstName: string,
        lastName: string,
    },
};

export type DialogInfo = {

    __typename: DialogInfo,

    dialog: {
        id: number,
        title: string,
        founder: {
            id: number,
        },
        users: {
            id: number,
            name: string,
            image: any,
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

export type paginatedUsers = {

    __typename: paginatedUsers,

    paginatedUsers: Array<{
        username: any,
        firstName: string,
    }>,
};

export type postCreate = {

    __typename: postCreate,

    postCreate: {
        post: {
            id: number,
            time: string,
            value: any,
            files: any,
        },
    },
};

export type likeApply = {

    __typename: likeApply,

    likeApply: {
        increased: any,
    },
};

export type UserNode = {

    __typename: UserNode,

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

export type PostType = {

    __typename: PostType,

    posts: Array<{
        id: number,
        time: string,
        value: string,
        files: any,
        likesCount: number,
        rated: boolean,
    }>,
};

export type UserType = {

    __typename: UserType,

    user: {
        id: number,
        lastLogin: string,
        username: string,
        firstName: string,
        lastName: string,
        isStaff: boolean,
        dateJoined: string,
        avatar: string,
        sex: boolean,
        placeId: number,
        name: string,
        image: string,
        isFriend: boolean,
    },
};

export type DialogType = {

    __typename: DialogType,

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

    __typename: SignInfo,

    tokenAuth: {
        success: any,
        errors: any,
        unarchiving: any,
        token: any,
        user: {
            id: number,
            username: any,
        },
    },
};

export type SignUpInfo = {

    __typename: SignUpInfo,

    register: {
        success: any,
        errors: any,
        token: any,
    },
};

export type PassResetInfo = {

    __typename: PassResetInfo,

    passwordReset: {
        success: any,
        errors: any,
    },
};

export type AccountVerifyingInfo = {

    __typename: AccountVerifyingInfo,

    verifyAccount: {
        success: any,
        errors: any,
    },
};

export type SignOutInfo = {

    __typename: SignOutInfo,

    revokeToken: {
        success: any,
        errors: any,
    },
};

export type undefined = {

    __typename: undefined,

    tokenAuth: {
        success: any,
        errors: any,
        token: any,
        refreshToken: any,
        unarchiving: any,
        user: {
            id: number,
            username: any,
        },
    },
};