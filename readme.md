
*This is a project written by a fan in a hurry to help in the development of the frontend.*

# Why graphql-types-generator?

Today, the solution for generating ts types for the client based on graphml types declared on the server is quite popular (in particular, such [such] (https://www.graphql-code-generator.com/). But at the front, we usually face the fact that we have to write complex queries for many types, and in this case we have to manually write complex types based on the basic ones. Sometimes this task becomes quite routine. **graphml-types-generator** is an alternative solution that generates exact types individually for each query, which completely avoids writing types manually on the front. 

Restriction: Type generation for migrations is not supported yet (in progress)

Note: To work correctly, you need a running graphql server, otherwise the types will be generated based on the naming of the fields (as you will see a warning in the console)

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
- [documentation](https://www.graphql-code-generator.com/docs/getting-started/programmatic-usage) over programming usage of graphql-code-generator

PS: 

- use `npm run generate` for graphql types generation from backend. See more detail [here](https://www.graphql-code-generator.com/docs/getting-started/installation).
