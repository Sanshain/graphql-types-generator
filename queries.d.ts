

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
        users:{
            id:number,
            name:string,
            image:string,
        }[],
        messages:{
            author:number,
            time:Date | string,
            value:string,
            files:File[] | object,
        }[],
    },
};