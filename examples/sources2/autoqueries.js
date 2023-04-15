import gql from "./graphql-tag";

export const verifyAccount = gql`
    mutation VerifyAccount {
        verifyAccount(token: $token){
            success,
            errors
        }
    }
`;

export const postCreate = gql`
    mutation PostMutation {
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

export const likeApply = gql`
    mutation LikeMutation {
        likeApply(postId: $postId){
            increased
        }
    }
`;

export const friendshipApply = gql`
    mutation FriendshipMutation {
        friendshipApply(userId: $userId){
            added
        }
    }
`;

export const userSettingsMutation = gql`
    mutation SettingsMutationPayload {
        userSettingsMutation(birthday: $birthday, sex: $sex, placeId: $placeId, placeTypeId: $placeTypeId){
            profile{
                id,
                username,
                firstName,
                lastName,
                dateJoined,
                placeId
            },
            errors,
            settings{
                firstName
            },
            clientMutationId
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

export const userType = gql`
    query UserType {
        user (id: $id) {
            id,
            lastLogin,
            username,
            firstName,
            lastName,
            dateJoined,
            avatar,
            sex,
            placeId,
            name,
            image,
            friendshipState
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



