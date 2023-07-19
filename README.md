## graphql-types-generator

An Alternative type generator for graphql client

### Features: 

A direct alternative to this package is only a combination of `@graphql-codegen/typescript` and `@graphql-codegen/typescript-operations`. So, if you want, you can consider it two in one. 

#### But not only that. This package can do a little more little joys:

- **binding output and input graphql types** - `@graphql-codegen/typescript-operations` is able to generate `output types` and `incoming types` based on graphql types. And it's actually very cool, but these remain for each separated case two independent types, and some more work needs to be done to link them. This work can be done manually or with the help of an additional script that you will have to write. **graphql-types-generator** does this work for you via one of two ways:
   - with the `declarateSource` option. *Creates `.d.ts` file with generics directly linking arguments to types*:
      ```ts
      export const someQueryVar: QueryString<OutputType, InputType>
      ```
   - using the `matchTypeNames` option, *which creates a special type of relations.*:
     ```ts
      export type ArgTypes = {
          // ...
          OutputType: InputType,      
      }
     ```
- **branded types for unknown types** - in the case, when graphql server does not provide any data about type (`codegen` in this case simply substitutes `any` type for the fields (possible to changed via `defaultScalarType` option to another, like `unknown` or `Object`, for example, but no more)) **graphql-types-generator** generates appropriate human-readable branded types. A trifle, but nice.

     #### codegen:

     ```ts
      type SomeType = {
         errors?: any
      }
     ```

     #### graphql-types-generator

     ```ts
      type SomeType = {
         errors?: ExpectedErrorType
      }
     ```
- **generates types directly from javascript code** - generates types directly from javascript code, which avoids code duplication, whereas **codegen** is designed for the `* format.graphql` files, for generating javascript code from which a separate package is needed.
- **generate types for unknown types** - the possibility to define types, about which server dpusn't give any data. This is very rare case. Unlike the previous paragraphs, I do not attribute it to the advantages, rather to the specificity of the current package.
- has possibility to specify more tiny type for types generation via specify naming rules or server type description (look up `typeFromDescMark` option). Its may be usefull for example for Unions of some fixed strings or numbers instead of base scalar types or using string template literal in the types. That maky possible use the types as generics for more typing covering
- Performs generation faster then `codegen/typescript-operations`

 #### Currently there is support: 
- ✅ queries result typing 
- ✅ mutation result typing **(new)**
- ✅ queries and mutation arguments typing including:
  - ✅ nullable arguments
  - ✅ required arguments
  - ✅ complex arguments (required unique field names of each argument in once query)
- ✅ supports of nested interfaces (like `relay`)

#### Does not support:

- ❌ `subscriptions` - may be will be done in the distant future
- ❌ `fragments` - unlike due to the lack of need for such entities in meta-development, which is implied by this package

### Frequently asked questions

<details>
   <summary>
      <h4>Should I throw codegen in the trash?</h4> - <h3>No, I wouldn't do that</h3>
   </summary>
   It has a rich ecosystem, a community, a set of plugins and support. Therefore, I think that in any case it is worth remembering about it and in some cases, maybe it may turn out to be a more suitable tool.
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

## How it works by rules? 

#### legacy feature

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
      username: string,
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
