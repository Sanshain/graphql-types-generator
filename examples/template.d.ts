type QueryString<T extends string> = `
    ${'mutation'|'query'} ${T}${string}`

