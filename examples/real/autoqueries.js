import gql from "./graphql-tag";

export const postCreate = gql`
    mutation postCreate {
        postCreate(value: $value, files: $files){
            post{
                id,
                time,
                value,
                files
            }
        }
    }
`;

export const likeApply = gql`
    mutation likeApply {
        likeApply(postId: $postId){
            increased
        }
    }
`;

export const userNode = gql`
    query UserNode {
        me (id: $id) {
            id,
            lastLogin,
            username,
            firstName,
            lastName,
            email,
            isStaff,
            isActive,
            dateJoined,
            avatar,
            sex,
            placeId,
            pk,
            archived,
            verified,
            secondaryEmail
        }
    }
`;

export const postType = gql`
    query PostType {
        posts (user: $user) {
            id,
            time,
            value,
            files,
            likesCount,
            rated
        }
    }
`;

export const userType = gql`
    query UserType {
        user (id: $id) {
            id,
            lastLogin,
            username,
            firstName,
            lastName,
            isStaff,
            dateJoined,
            avatar,
            sex,
            placeId,
            name,
            image,
            isFriend
        }
    }
`;

export const dialogType = gql`
    query DialogType {
        dialog (id: $id) {
            id,
            avatar,
            title,
            talkersAmount,
            lastMessage {
                author,
                value,
            }
        }
    }
`;

