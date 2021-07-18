

export type profileInfo = {
    users: Array<{
        username: any,
        firstName: string,
    }>,
    dialogs: Array<{
        id: number,
        title: string,
    }>,
};

export type undefined = {
    dialog: {
        id: number,
        title: string,
        users: {
            id: number,
            name: string,
            image: any,
        }[],
        messages: {
            author: any,
            time: string,
            value: any,
            files: any,
        }[],
    },
};