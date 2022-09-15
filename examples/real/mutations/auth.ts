import gql from "../graphql-tag";


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

// refreshToken (это регистрация)
export const SIGN_UP = gql`
	mutation SignUpInfo {
		register(
			email: $email,
			username: $username,
			password1: $password1,
			password2: $password2,
		) {
			success,
			errors,
			token			
		}
	}
`;


export const PASS_RESET = gql`
	mutation PassResetInfo {
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
	mutation AccountVerifyingInfo {
		verifyAccount(token: $token) {
			success,
			errors
		}
	}
`;


export const SIGN_OUT = gql`
	mutation SignOutInfo {
		revokeToken(
			token: $token
		) {
			success,
			errors
		}
	}
`

// # username or email
// # email: "skywalker@email.com"

// запрашивает новый токен в случае истечении срока текущего токена:
export const REFRESH_TOKEN = gql`
	mutation {
		tokenAuth(
			username: $username,
			password: $password
		) {
			success,
			errors,
			token,
			refreshToken,
			unarchiving,
			user {
				id,
				username
			}
		}
	}
`