

export type DialogInfo = {
    dialog: {
        id: number,
        title: string,
        founder: {
            id: number,
            lastLogin: string,
            username: string,
            firstName: string,
            lastName: string,
            dateJoined: string,
            avatar: string,
            sex: boolean,
            birthday: string,
            placeId: number,
            name: string,
            image: string,
            friendshipState: number,
        },
        users: {
            id: number,
            name: string,
            image: string,
        }[],
        messages: {
            id: number,
            author: any,
            time: string,
            value: any,
            files: any,
            replyTo: {
                id: number,
                time: string,
                value: any,
                files: any,
                author: any,
            },
            likesCount: any,
            rated: any,
        }[],
    },
};

/*
* `QueryTypes` - may be need for more flexible types management on client side 
*
* (optional: controlled by `matchTypeNames` option)
*/
export type QueryTypes = {
    DialogInfo: DialogInfo
}
