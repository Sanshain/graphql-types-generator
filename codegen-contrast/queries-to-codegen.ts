/// for compareing:

//@ts-ignore
export const get_DialogInit = gql`
	query DialogInfo {
		dialog(id: 0){
			id,
			title,
			founder {
				id
			},			
			users{
				id,			
				name,
				image,     
			},
			messages{
				id,
				author,				
				time,
				value,
				files,
				replyTo{
					id,
					time,					
					value,					
					files,
					author
				},
				likesCount,	
				rated,
			}
		}
	}
`;

//@ts-ignore
export const SIGN_OUT = gql`
	mutation SignOutInfo {
		revokeToken(
			token: ''
		) {
			success,
			errors
		}
	}
`
