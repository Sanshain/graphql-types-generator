## graphql-types-generator

An Alternative type generator for graphql client

### Features: 

A direct alternative to this package is only a combination of `@graphql-codegen/typescript` and `@graphql-codegen/typescript-operations`. So, if you want, you can consider it two in one. But not only that. This package can do a little more little more little joys:

- **binding graphql types and its input (variables) types** - `@graphql-codegen/typescript-operations` is able to generate types and incoming types based on graphql types. And it's actually very cool. But these remain two independent types, and some more work needs to be done to link them. This work can be done manually or with the help of an additional script that you will have to write. **graphql-types-generator** does this work for you in one of two ways: with the `declarateSource` option (allows you to create `.d.ts` file with generics directly linking arguments to types) or using the `matchTypeNames` option, which creates a special type of relations.
- **branded types for unknown types** - in the case of undefined types, when the server does not provide any information about the type (codegen in this case simply substitutes `any` type for the fields by default (possible to changed via `defaultScalarType` option to another, type like `unknown` or `Object` for example, but no more)) **graphql-types-generator** generates appropriate human-readable branded types. A trifle, but nice.
- **generates types directly from javascript code** - generates types directly from javascript code, which avoids code duplication, whereas **codegen** is designed for the `* format.graphql` files, for generating javascript code from which a separate package is needed.
- **generate types for unknown types** - the possibility to define types, about which server dpusn't give any data. This is very rare case. Unlike the previous paragraphs, I do not attribute it to the advantages, rather to the specificity of the current package.

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
   
And at the moment I also see the following advatages of the `graphql-types-generator` over the `codegen/typescript-operations`:
- `codegen/typescript-operations` generates query types with fields linked to whole types of apropriate server types like this. 
   #### Example: 
   ```gql
   We have:
    mutation SettingsMutationPayload {
        userSettingsMutation(birthday: $birthday){
            profile{
                id,
                firstName
            }
        }
    }   
   ```
   where type of `profile` is `UserType` with 20 fields and `codegen/typescript-operations` generates type with field linked to UserType having all 20 fields instead of 
   just 2 we need:
   ```ts
   export type SettingsMutationPayload = {
     __typename?: 'SettingsMutationPayload';
     profile?: Maybe<UserType>;
   };   
   ```
   Intead of that `codegen/typescript-operations` generates only required fields:
   ```ts
   export type SettingsMutationPayload = {
       userSettingsMutation: {
           profile: {
               id: number,
               username: string
           }
       }
   }
   ```
- has possibility to specify more tiny type for types generation via specify naming rules or server type description (look up `typeFromDescMark` option). Its may be usefull for example for Unions of some fixed strings or numbers instead of base scalar types or using string template literal in the types. That maky possible use the types as generics for more typing covering
- `codegen/typescript-operations` performs generation faster

And the following disadvantages: 

- `codegen/typescript-operations` outputs scalar types for fields more precisely now

</details>

<details>
   <summary>
      <h3>Should I throw codegen in the trash?</h3> - <h3>No, I wouldn't do that</h3>
   </summary>
   It has a rich ecosystem, community, a set of plugins and support. In addition, in some cases it does a better job of identifying types from the server. Therefore, I  think that this thing fully deserves a place among the developer's tools and it is not worth throwing it out. However, as my practice has shown, even he is not omnipotent when the server does not provide some types. And here the use of `graphql-types-generator` may be alternative solution
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
