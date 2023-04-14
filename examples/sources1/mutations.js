//@ts-check
import gql from "./graphql-tag";


export const SIGN_IN = gql`
	mutation SignInfo {
		tokenAuth(username: $username, password: $password) {
			success,
			errors,
			unarchiving,
			token,    
			user {
				id,
				username,
			}
		}
	}
`;

export const SIGN_UP = gql`
	mutation SignupInfo {
		register(
			email: $email,
			username: $username,
			password1: $password1,
			password2: $password2,
		) {
			success,
			errors,
			token,
			refreshToken
		}
	}
`;


export const PASS_RESET = gql`
	mutation ResetAction {
		passwordReset(
			token: $token,
			newPassword1: $password1,
			newPassword2: $password2
		) {
			success,
			errors
		}
	}
`;


/**
 *  $token - verifying token
 */
export const ACCOUNT_VERIFY = gql`
	mutation VerifyInfo {
		verifyAccount(token: $token) {
			success,
			errors
		}
	}
`;


export const SIGN_OUT = gql`
	mutation SignoutAction {
		revokeToken(
			token: $token
		) {
			success,
			errors
		}
	}
`