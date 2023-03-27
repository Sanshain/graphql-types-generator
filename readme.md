
*This is a project written by a fan in a hurry to help in the development of the frontend.*

# Why graphql-types-generator?

The generally accepted method and considered correct is the generation of typescript types from graphql types. [graphql-code-generator](https://www.graphql-code-generator.com/) does something like this. But this does not get rid of writing the queries themselves. This alternative solution, which was born in the pet project, is based on the most common variable names of certain types (to some extent similar to the Hungarian notation). For example, fields including `title` or  `name` are almost always of the string type, fields starting with `is` are almost always ` boolean`, `id` is almost always a number, and so on.

### Why not server types?

Why not use server types? This is a good and correct question. And the answer I give to it is to use server types wherever and whenever there is such an opportunity. And graphql-types-generator supports server-based type generation (thpiugh `useServerTypes` option, by default always `true`) using a special `__schema` request to the server. But sometimes it happens (probably due to incomplete implementation) the server gives incomplete information and the developer has to put down the types manually, which does not go well with code generation. Thus, we have to fix different crutches to clarify the types and constantly edit them and or we leave part of the code uncovered by types. `graphql-types-generator` solves the problem.

### Why not codegen/typescript-operations?

`Codegen/typescript` does not know how out of the box, what it can do (generate types from queries) `graphql-types-generator`. The `codegen/typescript-operations` plugin does the most similar work in the `codegen` ecosystem. But how he does it is somewhat different: at the input, he expects the hard-boiled values of the query arguments, which may be a minor problem with simple queries, but very significant - with complex ones. `Graphql-types-generator` does not have this problem. Nevertheless, I find graphql-types-generator easier to configure.

### Should I throw codegen in the trash?

Of course not. The guys who made codegen did a lot of work and - I must admit - that in some cases (not very frequent, in my experience) codegen can better see the type of a particular field. It also has a huge ecosystem of plugins for a variety of frameworks, which can play a crucial role in the choice of technology.

## Installation

```
npm i graphql-types-generator -D
```

## Terminal usage:

```shell
types-gen -s "./examples/queries.js"
```

## Programmatic usage: 


```javascript
// from forked repo:
const typesGenerate = require('./sources/main');
// or
const typesGenerate = require('graphql-types-generator');

async function main() {
	await typesGenerate({
		filename: './examples/mutations.js'
	});	
}

main();
```

# How it works?

By default it expects server on `http://127.0.0.1:8000/graphql`. If doesn't exists return warnings about 
an server unavailability and generates types from namings.

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
- [github repo](https://github.com/dotansimha/graphql-code-generator) of graphql-code-generator as alternative
- [documentation](https://www.graphql-code-generator.com/docs/getting-started/programmatic-usage) over programming usage of graphql-code-generator as alternative

PS: 

- use `npm run generate` for graphql types generation from backend. See more detail [here](https://www.graphql-code-generator.com/docs/getting-started/installation).
