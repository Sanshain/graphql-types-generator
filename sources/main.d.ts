
declare type Options = {
	filename: string,
	files?: Array<string>, 
	dirname? : string,
	target?: string,
	rules?: object
}

declare function typesGenerate(options: Options): void;

export = typesGenerate