declare const __brand: unique symbol
type ScreenType<T, B=never> = T & { [__brand]?: B }

type JSONstring = ScreenType<string, "JSONstring">
type ID = ScreenType<number, "ID">
/** yyyy-mm-dd */
type DateString = ScreenType<string>