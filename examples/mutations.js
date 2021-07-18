//@ts-check
import gql from "./graphql-tag";


export const SIGN_IN = gql`
	mutation {
		tokenAuth(username: $username, password: $password) {
			success,
			errors,
			unarchiving,
			token,    
			unarchiving,
			user {
				id,
				username,
			}
		}
	}
`;


export const SIGN_UP = gql`
	mutation {
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
	mutation {
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
	mutation {
		verifyAccount(token: $token) {
			success,
			errors
		}
	}
`;


export const SIGN_OUT = gql`
	mutation {
		revokeToken(
			token: $token
		) {
			success,
			errors
		}
	}
`