declare const __brand: unique symbol
type Branded<T, B=never> = T & { [__brand]?: B }

type JSONstring = Branded<string, "JSONstring">
type ID = Branded<string, "ID">
type DateString = Branded<string>