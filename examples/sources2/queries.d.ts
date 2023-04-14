type QueryString<T extends string> = `
    ${'mutation'|'query'} ${T}${string}`


/**
 * dialog list initialization
 * 
 * =- firstName,
 */

export const GetProfileInfo: QueryString<'ProfileInfo'>;

/**
 * just one dialog initial
 */

export const get_DialogInit: QueryString<'DialogInfo'>;

/**
 * paginatedUsers(filter:"{'exclude' : $exclude, 'icontains': '$icontains', 'only_friends': $only_friends}")
 * paginatedUsers(filter:$filter)
 * 
 * @using
 * filter:"{'exclude' : {'id__in': [1,2,5]}, 'icontains': 'Bob1', 'only_friends': 1}"
 */

export const getPaginatedUsers: QueryString<'PaginatedUsers'>;
