// import gql from "graphql-tag";
import gql, { join } from "./graphql-tag";



/**
 * dialog list initialization
 * 
 * =- firstName,
 */
export const GetProfileInfo = gql`
	query ProfileInfo {
		users {
			id,
			username,			
			name,
			lastName,
			image
		},
		dialogs{
			id,
			title,
			founder{
				id,
				name,
				image				
			},
			talkersAmount,
			lastMessage{
				author,
        		value
			}
		},
		me{
			id,
			username,
			firstName,
			lastName			
		}			
	}
`;

// todo lastMessage.time


/**
 * just one dialog initial
 */
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


/**
 * paginatedUsers(filter:"{'exclude' : $exclude, 'icontains': '$icontains', 'only_friends': $only_friends}")
 * paginatedUsers(filter:$filter)
 * 
 * @using
 * filter:"{'exclude' : {'id__in': [1,2,5]}, 'icontains': 'Bob1', 'only_friends': 1}"
 */
export const GET_PaginatedUsers = gql`
	query paginatedUsers {
		paginatedUsers(filter:$filter)
		{
			username,
			firstName
		}    
	}
`


/**
 * via relay variation:
 */


// export const GET_friends_LIST = gql`
// 	query friendList {
// 		users {
// 			id,
// 			username,
// 			name,
// 			lastName,
// 			image
// 		}
// 	}
// `;


// export const paginatedFriends = gql`
// 	query paginatedUsers {
// 		paginatedUsers(first: 3, last: 2){
// 			pageInfo{
// 				startCursor,
// 				endCursor,
// 				hasNextPage,
// 				hasPreviousPage
// 			},
// 			edges{
// 				cursor,
// 				node{
// 					id,
// 					username
// 				}
// 			}
// 		}    
// 	}
// `


// edges {
// 	node {
//       reply {