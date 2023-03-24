
type BaseOptions = {
	filename: string,
	files?: Array<string>, 
	declarateSource?: Array<string>,
	declTemplate?: string,
	dirname? : string,
	target?: string,
	attachTypeName?: boolean,
	matchTypeNames?: boolean,
	useServerTypes?: boolean,	
	rules?: object,
	separateFileForArgumentsTypes?: string
}

declare function typesGenerate(options: BaseOptions): void;

export = typesGenerate