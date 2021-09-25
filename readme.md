
*This is a project written by a fan in a hurry to help in the development of the frontend.*

# Why graphql-types-generator?

The generally accepted method and considered correct is the generation of typescript types from graphql types. [graphql-code-generator](https://www.graphql-code-generator.com/) does something like this. But this does not get rid of writing the queries themselves. This alternative solution, which was born in the pet project, is based on the most common variable names of certain types (to some extent similar to the Hungarian notation). For example, fields including `title` or  `name` are almost always of the string type, fields starting with `is` are almost always ` boolean`, `id` is almost always a number, and so on

## Installation

```
npm i graphql-types-generator -D
```

## Programmatic usage: 


```js
//@ts-check

const typesGenerate = require('./sources/main');

async function main() {
	await typesGenerate({
		filename: './examples/mutations.js'
	});	
}

main();
```

## Terminal usage:

```bash
npm run init -s "examples/queries.js"
```

# How it works?


### source: 

```js
export const GET_DIALOGS_INIT = gql`
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
```

### results: 

```ts
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
```

# usefull links: 

- [npm repo](https://www.npmjs.com/package/graphql-types-generator) of the graphql-types-generator
- [github repo](https://github.com/dotansimha/graphql-code-generator) of graphql-code-generator
- [documentation](https://www.graphql-code-generator.com/docs/getting-started/programmatic-usage) over programming usage of graphql-code-generator as alternative

PS: 

- use `npm run generate` for graphql types generation from backend. See more detail [here](https://www.graphql-code-generator.com/docs/getting-started/installation).
