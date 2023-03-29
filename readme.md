
*This is a project written by a fan in a hurry to help in the development of the frontend.*

# Why graphql-types-generator?

The generally accepted method and considered correct is the generation of typescript types from graphql types. [graphql-code-generator](https://www.graphql-code-generator.com/) does something like this. But this does not get rid of writing the queries themselves. This is an alternative undependent solution born in the pet project, which uses the most common variable names for the corresponding types to generate (to some extent similar to the Hungarian notation) or refine them along with generation based on types provided by the server. For example, fields including `title` or `name` are almost always - of the string type; fields starting with `is` are almost always ` boolean`, `id` is almost always a number, and so on. 

## Frequently asked questions


<details>
   <summary>
      <h3>Does it generate based on server types?</h3> - <h3>Yes. It could do it</h3>
   </summary>
   Why not use server types? This is a good question. And the answer: **graphql-types-generator generates types based on server types whenever there is such a possibility.** (through `useServerTypes` option, by default always `true`) using a special `__schema` request to the server. But sometimes it happens (probably due to incomplete implementation) the server gives incomplete information and the developer has to put down the types manually, which does not go well with code generation. Thus, we have to fix different crutches to clarify the types and constantly edit them and or we leave part of the code uncovered by types. `graphql-types-generator` solves the problem.   
</details>

<details>
   <summary>
      <h3>Why not codegen/typescript-operations?</h3> - <h3>It's your choice</h3>
   </summary>
   `Codegen/typescript` does not know how out of the box, what it can do (generate types from queries) `graphql-types-generator`. The `codegen/typescript-operations` plugin does the most similar work in the `codegen` ecosystem. But how he does it is somewhat different: at the input, he expects the hard-boiled values of the query arguments, which may be a minor problem with simple queries, but very significant - with complex ones. `Graphql-types-generator` does not have this problem. 
</details>

<details>
   <summary>
      <h3>Should I throw codegen in the trash?</h3> - <h3>No, I wouldn't do that</h3>
   </summary>
   it has a rich ecosystem, community, a set of plugins and support. In addition, in some cases it does a better job of identifying types from the server. Therefore, I do not think that this thing fully deserves a place among the developer's tools and it is not worth throwing it out. However, as my practice has shown, even he is not omnipotent when the server does not provide some types. 
</details>


## Installation

```shell script
npm i graphql-types-generator -D
```

## Terminal usage:

```shell
types-gen -s "./examples/queries.js"
```
or

```shell script
npm graphql-types-generator -s "./examples/queries.js"
```

#### Advanced possible options: 
- `-t` - target file name 
- `-p` - graphql server port
- `-h` - graphql server host
- `--ds` - generate `*.d.ts` file for source file with `QueryString` type declarations for each query
- `--m` - attach 'QueryTypes' type listing all names of generated queries types with links to appropriate types

## Programmatic usage: 


```javascript
// from forked repo:
const typesGenerate = require('./sources/main');
// or
const typesGenerate = require('graphql-types-generator');

async function main() {
   await typesGenerate({
      filename: './examples/mutations.js',
      // ...other options
   });	
}

main();
```

# How it works?

By default (`useServerTypes` by default always is true) it expects server on `http://127.0.0.1:8000/graphql` and generates types based on types provided by this one. If some primitive type in not provided by server, it generates the type based on naming rule. If the server doesn't exists, it returns warning about an server unavailability and generates types purely based on naming rules. By default the rules look so:

```js
rules = {
   string: ['Name', 'Title', 'Date', 'Time'],    // endsWith
   bool: ['is'],                                 // startsWith
   number: ['Id', 'Count', 'Sum']                // endsWith
}	
```

## Possible options:

- `filename: string` - path to js file with graphql queries wrapped to tagged template `gql` (possible to use glob pattern) (required)
- `files?: string[]` - as alternative `filename` option allowing multiple source files passing at same time
- `declarateSource?: Array<string>` - list of files for generating declaration (`*.d.ts`) files (may match with `files` option. useful for covering query argument types).
- `declTemplate?: string` - file name of template using for `*.d.ts` files generation (look up `examples` directory)
- `target?: string` - target file name
- `attachTypeName?: boolean` - attach `__typename` field for each query type
- `matchTypeNames?: boolean` - attach 'QueryTypes' type
- `useServerTypes?: boolean` - using server types for generation
- `rules?: object` - advanced naming rules to generate types like `{number: ['count', 'amount']}`
- `separateFileForArgumentsTypes?: boolean` - separate argument types and queries result types

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
