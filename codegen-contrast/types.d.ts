export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string;
	String: string;
	Boolean: boolean;
	Int: number;
	Float: number;
	/**
	 * The `Date` scalar type represents a Date
	 * value as specified by
	 * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
	 */
	Date: any;
	/**
	 * The `DateTime` scalar type represents a DateTime
	 * value as specified by
	 * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
	 */
	DateTime: any;
	/**
	 *
	 *     Errors messages and codes mapped to
	 *     fields or non fields errors.
	 *     Example:
	 *     {
	 *         field_name: [
	 *             {
	 *                 "message": "error message",
	 *                 "code": "error_code"
	 *             }
	 *         ],
	 *         other_field: [
	 *             {
	 *                 "message": "error message",
	 *                 "code": "error_code"
	 *             }
	 *         ],
	 *         nonFieldErrors: [
	 *             {
	 *                 "message": "error message",
	 *                 "code": "error_code"
	 *             }
	 *         ]
	 *     }
	 *
	 */
	ExpectedErrorType: any;
	/**
	 * Allows use of a JSON String for input / output from the GraphQL schema.
	 *
	 * Use of this type is *not recommended* as you lose the benefits of having a defined, static
	 * schema (one of the key benefits of GraphQL).
	 */
	JSONString: any;
};



export type DialogType = {
	__typename?: 'DialogType';
	id: Scalars['ID'];
	founder: UserType;
	avatar: Scalars['String'];
	title: Scalars['String'];
	users: Array<UserType>;
	messagesList: Array<MessagesType>;
	talkersAmount?: Maybe<Scalars['Int']>;
	/** nested */
	lastMessage?: Maybe<MessageSubType>;
};

export type ErrorType = {
	__typename?: 'ErrorType';
	field: Scalars['String'];
	messages: Array<Scalars['String']>;
};


/**
 * :::
 * userId: number
 */
export type FriendshipMutation = {
	__typename?: 'FriendshipMutation';
	added?: Maybe<Scalars['Boolean']>;
};


/** An enumeration. */
export enum LikeFeeling {
	/** Like */
	Like = 'LIKE',
	/** Profit */
	Prof = 'PROF',
	/** Wow */
	Wow = 'WOW',
	/** Lol */
	Lol = 'LOL'
}

/**
 * :::
 * postId: number
 */
export type LikeMutation = {
	__typename?: 'LikeMutation';
	increased?: Maybe<Scalars['Boolean']>;
};

export type LikeType = {
	__typename?: 'LikeType';
	id: Scalars['ID'];
	target: PostType;
	author: UserType;
	value: Scalars['Int'];
	feeling: LikeFeeling;
};

export type MessageSubType = {
	__typename?: 'MessageSubType';
	author?: Maybe<Scalars['String']>;
	value?: Maybe<Scalars['String']>;
};

export type MessageType = {
	__typename?: 'MessageType';
	id: Scalars['ID'];
	by: UserType;
	time: Scalars['DateTime'];
	value: Scalars['String'];
	files: Scalars['JSONString'];
	postPtr: PostType;
	toDialog?: Maybe<DialogType>;
	replyTo?: Maybe<MessagesType>;
	messageSet: Array<MessagesType>;
	likesCount?: Maybe<Scalars['Int']>;
	rated?: Maybe<Scalars['Boolean']>;
	author?: Maybe<Scalars['Int']>;
};

export type MessagesType = {
	__typename?: 'MessagesType';
	id: Scalars['ID'];
	by: UserType;
	time: Scalars['DateTime'];
	value: Scalars['String'];
	files: Scalars['JSONString'];
	postPtr: PostType;
	toDialog?: Maybe<DialogType>;
	replyTo?: Maybe<MessagesType>;
	messageSet: Array<MessagesType>;
	likesCount?: Maybe<Scalars['Int']>;
	rated?: Maybe<Scalars['Boolean']>;
	author?: Maybe<Scalars['Int']>;
};

export type Mutation = {
	__typename?: 'Mutation';
	/**
	 * Register user with fields defined in the settings.
	 *
	 * If the email field of the user model is part of the
	 * registration fields (default), check if there is
	 * no user with that email or as a secondary email.
	 *
	 * If it exists, it does not register the user,
	 * even if the email field is not defined as unique
	 * (default of the default django user model).
	 *
	 * When creating the user, it also creates a `UserStatus`
	 * related to that user, making it possible to track
	 * if the user is archived, verified and has a secondary
	 * email.
	 *
	 * Send account verification email.
	 *
	 * If allowed to not verified users login, return token.
	 */
	register?: Maybe<Register>;
	/**
	 * Verify user account.
	 *
	 * Receive the token that was sent by email.
	 * If the token is valid, make the user verified
	 * by making the `user.status.verified` field true.
	 */
	verifyAccount?: Maybe<VerifyAccount>;
	/**
	 * Obtain JSON web token for given user.
	 *
	 * Allow to perform login with different fields,
	 * and secondary email if set. The fields are
	 * defined on settings.
	 *
	 * Not verified users can login by default. This
	 * can be changes on settings.
	 *
	 * If user is archived, make it unarchive and
	 * return `unarchiving=True` on output.
	 */
	tokenAuth?: Maybe<ObtainJsonWebToken>;
	/**
	 * Update user model fields, defined on settings.
	 *
	 * User must be verified.
	 */
	updateAccount?: Maybe<UpdateAccount>;
	/**
	 * :::
	 * value:String
	 * files:JSONString
	 */
	postCreate?: Maybe<PostMutation>;
	/**
	 * :::
	 * postId: number
	 */
	likeApply?: Maybe<LikeMutation>;
	/**
	 * :::
	 * userId: number
	 */
	friendshipApply?: Maybe<FriendshipMutation>;
	/**
	 * :::
	 * id: ID
	 * firstName: String!
	 * lastName: String
	 * birthday: Date
	 * sex: Boolean
	 * placeId: Int
	 * placeType: ID
	 */
	userSettingsMutation?: Maybe<SettingsMutationPayload>;
};


export type MutationRegisterArgs = {
	email: Scalars['String'];
	username: Scalars['String'];
	password1: Scalars['String'];
	password2: Scalars['String'];
};


export type MutationVerifyAccountArgs = {
	token: Scalars['String'];
};


export type MutationTokenAuthArgs = {
	password: Scalars['String'];
	email?: Maybe<Scalars['String']>;
	username?: Maybe<Scalars['String']>;
};


export type MutationUpdateAccountArgs = {
	firstName?: Maybe<Scalars['String']>;
	lastName?: Maybe<Scalars['String']>;
};


export type MutationPostCreateArgs = {
	files?: Maybe<Scalars['JSONString']>;
	value: Scalars['String'];
};


export type MutationLikeApplyArgs = {
	postId: Scalars['ID'];
};


export type MutationFriendshipApplyArgs = {
	userId: Scalars['ID'];
};


export type MutationUserSettingsMutationArgs = {
	input: SettingsMutationInput;
};

/** An object with an ID */
export type Node = {
	/** The ID of the object. */
	id: Scalars['ID'];
};

/**
 * Obtain JSON web token for given user.
 *
 * Allow to perform login with different fields,
 * and secondary email if set. The fields are
 * defined on settings.
 *
 * Not verified users can login by default. This
 * can be changes on settings.
 *
 * If user is archived, make it unarchive and
 * return `unarchiving=True` on output.
 */
export type ObtainJsonWebToken = {
	__typename?: 'ObtainJSONWebToken';
	token?: Maybe<Scalars['String']>;
	success?: Maybe<Scalars['Boolean']>;
	errors?: Maybe<Scalars['ExpectedErrorType']>;
	user?: Maybe<UserNode>;
	unarchiving?: Maybe<Scalars['Boolean']>;
};

/**
 * :::
 * value:String
 * files:JSONString
 */
export type PostMutation = {
	__typename?: 'PostMutation';
	post?: Maybe<PostType>;
};

export type PostType = {
	__typename?: 'PostType';
	id: Scalars['ID'];
	by: UserType;
	time: Scalars['DateTime'];
	value: Scalars['String'];
	files: Scalars['JSONString'];
	message?: Maybe<MessagesType>;
	likes: Array<LikeType>;
	likesCount?: Maybe<Scalars['Int']>;
	rated?: Maybe<Scalars['Boolean']>;
};

export type Query = {
	__typename?: 'Query';
	userSettings?: Maybe<UserSettingsType>;
	me?: Maybe<UserNode>;
	user?: Maybe<UserType>;
	users?: Maybe<Array<UserType>>;
	paginatedUsers?: Maybe<Array<UserType>>;
	friends?: Maybe<Array<Maybe<UserType>>>;
	posts?: Maybe<Array<Maybe<PostType>>>;
	dialog?: Maybe<DialogType>;
	dialogs?: Maybe<Array<DialogType>>;
	messages?: Maybe<Array<MessageType>>;
};


export type QueryUserSettingsArgs = {
	id?: Maybe<Scalars['Int']>;
};


export type QueryUserArgs = {
	id?: Maybe<Scalars['Int']>;
};


export type QueryPaginatedUsersArgs = {
	filter?: Maybe<Scalars['String']>;
};


export type QueryPostsArgs = {
	user?: Maybe<Scalars['Int']>;
};


export type QueryDialogArgs = {
	id?: Maybe<Scalars['Int']>;
};

/**
 * Register user with fields defined in the settings.
 *
 * If the email field of the user model is part of the
 * registration fields (default), check if there is
 * no user with that email or as a secondary email.
 *
 * If it exists, it does not register the user,
 * even if the email field is not defined as unique
 * (default of the default django user model).
 *
 * When creating the user, it also creates a `UserStatus`
 * related to that user, making it possible to track
 * if the user is archived, verified and has a secondary
 * email.
 *
 * Send account verification email.
 *
 * If allowed to not verified users login, return token.
 */
export type Register = {
	__typename?: 'Register';
	success?: Maybe<Scalars['Boolean']>;
	errors?: Maybe<Scalars['ExpectedErrorType']>;
	token?: Maybe<Scalars['String']>;
};

export type SettingsMutationInput = {
	firstName: Scalars['String'];
	lastName?: Maybe<Scalars['String']>;
	birthday?: Maybe<Scalars['Date']>;
	sex?: Maybe<Scalars['Boolean']>;
	placeId?: Maybe<Scalars['Int']>;
	placeType?: Maybe<Scalars['ID']>;
	id?: Maybe<Scalars['ID']>;
	clientMutationId?: Maybe<Scalars['String']>;
};

/**
 * :::
 * id: ID
 * firstName: String!
 * lastName: String
 * birthday: Date
 * sex: Boolean
 * placeId: Int
 * placeType: ID
 */
export type SettingsMutationPayload = {
	__typename?: 'SettingsMutationPayload';
	profile?: Maybe<UserType>;
	errors?: Maybe<Array<Maybe<ErrorType>>>;
	settings?: Maybe<UserSettingsType>;
	clientMutationId?: Maybe<Scalars['String']>;
};

/**
 * Update user model fields, defined on settings.
 *
 * User must be verified.
 */
export type UpdateAccount = {
	__typename?: 'UpdateAccount';
	success?: Maybe<Scalars['Boolean']>;
	errors?: Maybe<Scalars['ExpectedErrorType']>;
};

export type UserNode = Node & {
	__typename?: 'UserNode';
	/** The ID of the object. */
	id: Scalars['ID'];
	lastLogin?: Maybe<Scalars['DateTime']>;
	/** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
	username: Scalars['String'];
	firstName: Scalars['String'];
	lastName: Scalars['String'];
	email: Scalars['String'];
	/** Designates whether the user can log into this admin site. */
	isStaff: Scalars['Boolean'];
	/** Designates whether this user should be treated as active. Unselect this instead of deleting accounts. */
	isActive: Scalars['Boolean'];
	dateJoined: Scalars['DateTime'];
	avatar?: Maybe<Scalars['String']>;
	friends: Array<UserType>;
	sex?: Maybe<Scalars['Boolean']>;
	birthday?: Maybe<Scalars['Date']>;
	placeId: Scalars['Int'];
	startedDialogs: Array<DialogType>;
	dialogs: Array<DialogType>;
	postSet: Array<PostType>;
	likeSet: Array<LikeType>;
	profileSet: Array<UserType>;
	pk?: Maybe<Scalars['Int']>;
	archived?: Maybe<Scalars['Boolean']>;
	verified?: Maybe<Scalars['Boolean']>;
	secondaryEmail?: Maybe<Scalars['String']>;
};

/**
 * :::
 * id: Int
 */
export type UserSettingsType = {
	__typename?: 'UserSettingsType';
	/** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
	username: Scalars['String'];
	firstName: Scalars['String'];
	lastName: Scalars['String'];
	birthday?: Maybe<Scalars['Date']>;
	placeId: Scalars['Int'];
	sex?: Maybe<Scalars['String']>;
	country?: Maybe<Scalars['String']>;
	city?: Maybe<Scalars['String']>;
};

export type UserType = {
	__typename?: 'UserType';
	id: Scalars['ID'];
	lastLogin?: Maybe<Scalars['DateTime']>;
	/** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
	username: Scalars['String'];
	firstName: Scalars['String'];
	lastName: Scalars['String'];
	dateJoined: Scalars['DateTime'];
	avatar?: Maybe<Scalars['String']>;
	friends: Array<UserType>;
	sex?: Maybe<Scalars['Boolean']>;
	birthday?: Maybe<Scalars['Date']>;
	placeId: Scalars['Int'];
	startedDialogs: Array<DialogType>;
	dialogs: Array<DialogType>;
	postSet: Array<PostType>;
	likeSet: Array<LikeType>;
	profileSet: Array<UserType>;
	name?: Maybe<Scalars['String']>;
	image?: Maybe<Scalars['String']>;
	friendshipState?: Maybe<Scalars['Int']>;
};

/**
 * Verify user account.
 *
 * Receive the token that was sent by email.
 * If the token is valid, make the user verified
 * by making the `user.status.verified` field true.
 */
export type VerifyAccount = {
	__typename?: 'VerifyAccount';
	success?: Maybe<Scalars['Boolean']>;
	errors?: Maybe<Scalars['ExpectedErrorType']>;
};

export type RegisterMutationVariables = Exact<{ [key: string]: never; }>;


export type RegisterMutation = { __typename?: 'Mutation', register?: { __typename?: 'Register', success?: boolean | null, errors?: any | null, token?: string | null } | null };

export type DialogInfoQueryVariables = Exact<{

	id?: Maybe<Scalars['Int']>;
}>;


export type DialogInfoQuery = { __typename?: 'Query', dialog?: { __typename?: 'DialogType', id: string, title: string, founder: { __typename?: 'UserType', id: string }, users: Array<{ __typename?: 'UserType', id: string, name?: string | null, image?: string | null }>, messagesList: Array<{ __typename?: 'MessagesType', id: string, author?: number | null, time: any, value: string, files: any, likesCount?: number | null, rated?: boolean | null, replyTo?: { __typename?: 'MessagesType', id: string, time: any, value: string, files: any, author?: number | null } | null }> } | null };
