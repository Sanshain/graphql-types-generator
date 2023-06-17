declare const __brand: unique symbol
type Branded<T, B=never> = T & { [__brand]?: B }

type JSONstring = Branded<string, "JSONstring">
type ID = Branded<number, "ID">
/** yyyy-mm-dd */
type DateString = Branded<string>