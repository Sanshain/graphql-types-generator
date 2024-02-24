// import gql from "graphql-tag";
import gql from "./graphql-tag";


export const postCreate = gql`
    mutation postCreate {
        postCreate(files: $files, value: $value){
            post{
                id,
                time,
                value,
                files
            }
        }
    }
`;

/**
 * dialog list initialization
 */
export const get_DialogsInit = gql`
	query profileInfo {
		users {
			username,
			firstName
		},
		dialogs{
			id,
			title
		}
	}
`;


/**
 * just one dialog initial 
 */
export const get_DialogInit = gql`
	query get_DialogInit {
		dialog(id: $id){
			id,
			title,
			users{
				id,			
				name,
				image,     
			},
			messages{
				author,
				time,
				value,
				files
			}
		}
	}
`;


export const uploadMessages = gql`
	query MessagesInfo{
		messages(id: $id, up: $up, by: $by){
			id,
			authorId,
			author{
				name
			}
			time,
			value,
			files,
			replyTo{
				id,
				time,
				value,
				files,
				authorId,
				author{
					name
				}				
			},
			likesCount,	
			rated,
		}	
	}
`;