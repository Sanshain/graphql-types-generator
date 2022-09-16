

export type ProfileInfo = {
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
    paginatedUsers: Array<{
        username: any,
        firstName: string,
    }>,
};

export type postCreate = {
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
    likeApply: {
        increased: any,
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

export type UserType = {
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
            username: any,
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
            username: any,
        },
    },
};