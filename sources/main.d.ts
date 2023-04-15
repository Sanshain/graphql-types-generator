
export type BaseOptions = {

	// files options:

	filename: string,							// source filename	
	files?: Array<string>, 					// or source file names
	declarateSource?: Array<string>,		// create *.d.ts files for according sources with QueryString<`$TypeName`> for each query
	declTemplate?: string,					// file for target template
	dirname? : string, 		// ?
	target?: string,							// target file name	

	// types generate options:

	attachTypeName?: boolean,				// attach __template field
	matchTypeNames?: boolean,				// attach type `QueryTypes` with all listed types
	typeFromDescMark?: string,				// mark for descriptions overrided gql server types (`:::` by default)
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
	debug?: boolean
}

declare function typesGenerate(options: BaseOptions): Promise<void>;

//@ts-ignore
export = typesGenerate

export default typesGenerate;

