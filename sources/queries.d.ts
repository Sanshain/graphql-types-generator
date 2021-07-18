

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

export type SignupInfo = {
    register: {
        success: any,
        errors: any,
        token: any,
        refreshToken: any,
    },
};

export type ResetAction = {
    passwordReset: {
        success: any,
        errors: any,
    },
};

export type VerifyInfo = {
    verifyAccount: {
        success: any,
        errors: any,
    },
};

export type SignoutAction = {
    revokeToken: {
        success: any,
        errors: any,
    },
};