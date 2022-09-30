
declare type Options = {
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

declare function typesGenerate(options: Options): void;

export = typesGenerate