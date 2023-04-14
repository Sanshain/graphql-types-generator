export const get_DialogInit = gql`
	query DialogInfo {
		dialog(id: $id){
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