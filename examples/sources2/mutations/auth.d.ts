type QueryString<T extends string> = `
    ${'mutation'|'query'} ${T}${string}`



export const SIGN_IN: QueryString<'SignInfo'>;


export const SIGN_UP: QueryString<'SignUpInfo'>;


export const PASS_RESET: QueryString<'PassResetInfo'>;

/**
 *  $token - verifying token
 */

export const ACCOUNT_VERIFY: QueryString<'AccountVerifyingInfo'>;


export const SIGN_OUT: QueryString<'SignOutInfo'>;


export const REFRESH_TOKEN: QueryString<'undefined'>;
