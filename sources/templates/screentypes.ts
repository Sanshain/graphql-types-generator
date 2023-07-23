declare const __brand: unique symbol
type ScreenType<T, B=never> = T & { [__brand]?: B }

type JSONstring = ScreenType<string, "JSONstring">
type Base64String = ScreenType<string, "Base64String">

type ID = ScreenType<number, "ID">
/** 
 * @description yyyy-mm-dd
 */
type DateString = ScreenType<string>