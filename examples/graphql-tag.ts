// export const gql = (args, ...v) => args.reduce((p, n, i) => p + v[i-1] + n)

import { profileInfo } from "./queries";



/**
 * Заглушка для graphql-tag
 * 
 * @param stroke : шаблонная строка (на основе тегового шаблона);
 * @param args : аргументы шаблонной строки;
 * @returns string : final request gql string
 */
export default function gql(stroke: ReadonlyArray<string>, ...args: Array<string|number|boolean>) : string {
	
	return stroke.reduce((p, n, i) => p + args[i-1] + n);
}

