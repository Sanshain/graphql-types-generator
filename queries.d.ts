

export type profileInfo = {
    users: Array<{
        username:string,
        firstName:string,
    }>,
    dialogs: Array<{
        id:number,
        title:string,
    }>,
};

export type undefined = {
    dialog: {
        id:number,
        title:string,
        users:any,
        messages:any,
    },
};