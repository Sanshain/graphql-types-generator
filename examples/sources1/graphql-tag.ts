// export const gql = (args, ...v) => args.reduce((p, n, i) => p + v[i-1] + n)

/**
 * Заглушка для graphql-tag
 * en: 
 * Stub for the graphql tag (in ideal world all link to this one should be cut by builder)
 * 
 * @param stroke : шаблонная строка (на основе тегового шаблона);
 * @param args : аргументы шаблонной строки;
 * @returns string : final request gql string
 */
export default function gql(stroke: ReadonlyArray<string>, ...args: Array<string|number|boolean>) : string {
	
	return stroke.reduce((p, n, i) => p + args[i-1] + n);
}

