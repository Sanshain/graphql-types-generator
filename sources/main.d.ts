
export type Schema = {
	data: {
		__schema: {
			types: Array<{
				name: string,
				fields?: Array<{
					name: string,
					description: string,
					args: Array<{
						name: string,
						type?: { name: string },
						ofType?: { name: string }
					}>,
					type: {
						fields?: Array<unknown>,
						kind: 'OBJECT' | 'LIST' | 'SCALAR' | 'NOT_NULL' | 'Field',
						name?: string,
						ofType?: { name: string }
					}
				}>
			}>
		}
	}
}

export type BaseOptions = {

	// files options:

	filename: string,							// source filename	
	files?: Array<string>, 					// or source file names
	declarateSource?: Array<string>,		// create *.d.ts files for according sources with QueryString<`$TypeName`> for each query
	declTemplate?: string,					// file for target template
	dirname?: string, 		// ?
	target?: string,							// target file name	

	// types generate options:

	attachTypeName?: boolean,				// attach __template field
	matchTypeNames?: boolean,				// attach type `QueryTypes` with all listed types
	typeFromDescMark?: string,				// mark for descriptions overrided gql server types (`:::` by default)
	makeNodesAsOptional?: boolean,		// make nodes as optional -default=false
	preventOptionalParams?: boolean,
	branded?: boolean | '' | string

	useServerTypes?: boolean | {
		port?: number,
		host?: string
	},
	rules?: {
		string?: string[];
		bool?: string[];
		number?: string[];
		// JSONField?: string
	},
	separateFileForArgumentsTypes?: string,

	debug?: boolean,
	verbose?: boolean
}

declare function typesGenerate(options: BaseOptions): Promise<void>;

//@ts-ignore
export = typesGenerate

export default typesGenerate;

