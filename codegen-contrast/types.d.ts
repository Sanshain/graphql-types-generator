export type RegisterMutationVariables = Exact<{ [key: string]: never; }>;


export type RegisterMutation = { __typename?: 'Mutation', register?: { __typename?: 'Register', success?: boolean | null, errors?: any | null, token?: string | null } | null };

export type DialogInfoQueryVariables = Exact<{
  id?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type DialogInfoQuery = { __typename?: 'Query', dialog?: { __typename?: 'DialogType', id: string, title: string, founder: { __typename?: 'UserType', id: string }, users: Array<{ __typename?: 'UserType', id: string, name?: string | null, image?: string | null }>, messagesList: { __typename?: 'MessagesTypeConnection', edges: Array<{ __typename?: 'MessagesTypeEdge', node?: { __typename?: 'MessagesType', id: string, time: any, value: string, files: any, likesCount?: number | null, rated?: boolean | null, replyTo?: { __typename?: 'MessagesType', id: string, time: any, value: string, files: any } | null } | null } | null> } } | null };

export type SettingsMutationPayloadMutationVariables = Exact<{ [key: string]: never; }>;


export type SettingsMutationPayloadMutation = { __typename?: 'Mutation', userSettingsMutation?: { __typename?: 'SettingsMutationPayload', profile?: { __typename?: 'UserType', id: string, firstName: string } | null } | null };
