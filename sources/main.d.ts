
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
						ofType?: { 
							name: string, 
							ofType?: {
								name: string,
								ofType?: {
									name: string
								}								
							}
						}
					}
				}>
			}>
		}
	}
}

export type BaseOptions = {


	/// FILES OPTIONS:

	/** source filename	 */
	filename: string,
	/** or source file names */
	files?: Array<string>,
	/** create *.d.ts files for according sources with QueryString<`$TypeName`> for each query */
	declarateSource?: Array<string>,		
	/** file for target template */
	declTemplate?: string,
	dirname?: string, 		// ?
	/** target file name */
	target: string,


	/// TYPES GENERATE OPTIONS:

	/** @description attach __template field */
	attachTypeName?: boolean,	
	/** 
	 * @description attach type `QueryTypes` with all listed types 
	 * @deprecated
	 */
	matchTypeNames?: boolean,
	/** mark for descriptions overrided gql server types (@default = `:::`) */
	typeFromDescMark?: string,
	/** make nodes as optional; @default=false */
	makeNodesAsOptional?: boolean,
	preventOptionalParams?: boolean,
	/** set human understandable type names for specific graphql types (recommended) */
	screentypes?: boolean | '' | string | object,

	unknownTypesAsIs?: boolean,

	useServerTypes?: boolean | {
		port?: number,
		host?: string
	},
	overRules: Record<string, string>,
	rules?: {
		string?: string[];
		bool?: string[];
		number?: string[];
		// JSONField?: string
	},
	separateFileForArgumentsTypes?: string,

	
	/// DEV OPTIONS:

	debug?: boolean,
	verbose?: boolean
}

declare function typesGenerate(options: BaseOptions): Promise<void>;

//@ts-ignore
export = typesGenerate

export default typesGenerate;

