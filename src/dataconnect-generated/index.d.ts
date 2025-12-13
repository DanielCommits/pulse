import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Comment_Key {
  id: UUIDString;
  __typename?: 'Comment_Key';
}

export interface Connection_Key {
  userAId: UUIDString;
  userBId: UUIDString;
  __typename?: 'Connection_Key';
}

export interface CreateCommentData {
  comment_insert: Comment_Key;
}

export interface CreateCommentVariables {
  vibeId: UUIDString;
  content: string;
}

export interface CreateVibeData {
  vibe_insert: Vibe_Key;
}

export interface CreateVibeVariables {
  content: string;
  imageUrl?: string | null;
  visibility: string;
}

export interface GetVibeData {
  vibe?: {
    id: UUIDString;
    content: string;
    imageUrl?: string | null;
    visibility?: string | null;
    user: {
      id: UUIDString;
      username: string;
    } & User_Key;
      createdAt: TimestampString;
      comments_on_vibe: ({
        id: UUIDString;
        content: string;
        user: {
          id: UUIDString;
          username: string;
        } & User_Key;
          createdAt: TimestampString;
      } & Comment_Key)[];
  } & Vibe_Key;
}

export interface GetVibeVariables {
  id: UUIDString;
}

export interface ListVibesData {
  vibes: ({
    id: UUIDString;
    content: string;
    imageUrl?: string | null;
    visibility?: string | null;
    user: {
      id: UUIDString;
      username: string;
    } & User_Key;
      createdAt: TimestampString;
      comments_on_vibe: ({
        id: UUIDString;
        content: string;
        user: {
          id: UUIDString;
          username: string;
        } & User_Key;
          createdAt: TimestampString;
      } & Comment_Key)[];
  } & Vibe_Key)[];
}

export interface Message_Key {
  id: UUIDString;
  __typename?: 'Message_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface Vibe_Key {
  id: UUIDString;
  __typename?: 'Vibe_Key';
}

interface CreateVibeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateVibeVariables): MutationRef<CreateVibeData, CreateVibeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateVibeVariables): MutationRef<CreateVibeData, CreateVibeVariables>;
  operationName: string;
}
export const createVibeRef: CreateVibeRef;

export function createVibe(vars: CreateVibeVariables): MutationPromise<CreateVibeData, CreateVibeVariables>;
export function createVibe(dc: DataConnect, vars: CreateVibeVariables): MutationPromise<CreateVibeData, CreateVibeVariables>;

interface GetVibeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetVibeVariables): QueryRef<GetVibeData, GetVibeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetVibeVariables): QueryRef<GetVibeData, GetVibeVariables>;
  operationName: string;
}
export const getVibeRef: GetVibeRef;

export function getVibe(vars: GetVibeVariables): QueryPromise<GetVibeData, GetVibeVariables>;
export function getVibe(dc: DataConnect, vars: GetVibeVariables): QueryPromise<GetVibeData, GetVibeVariables>;

interface CreateCommentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCommentVariables): MutationRef<CreateCommentData, CreateCommentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCommentVariables): MutationRef<CreateCommentData, CreateCommentVariables>;
  operationName: string;
}
export const createCommentRef: CreateCommentRef;

export function createComment(vars: CreateCommentVariables): MutationPromise<CreateCommentData, CreateCommentVariables>;
export function createComment(dc: DataConnect, vars: CreateCommentVariables): MutationPromise<CreateCommentData, CreateCommentVariables>;

interface ListVibesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListVibesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListVibesData, undefined>;
  operationName: string;
}
export const listVibesRef: ListVibesRef;

export function listVibes(): QueryPromise<ListVibesData, undefined>;
export function listVibes(dc: DataConnect): QueryPromise<ListVibesData, undefined>;

