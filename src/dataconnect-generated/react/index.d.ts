import { CreateVibeData, CreateVibeVariables, GetVibeData, GetVibeVariables, CreateCommentData, CreateCommentVariables, ListVibesData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateVibe(options?: useDataConnectMutationOptions<CreateVibeData, FirebaseError, CreateVibeVariables>): UseDataConnectMutationResult<CreateVibeData, CreateVibeVariables>;
export function useCreateVibe(dc: DataConnect, options?: useDataConnectMutationOptions<CreateVibeData, FirebaseError, CreateVibeVariables>): UseDataConnectMutationResult<CreateVibeData, CreateVibeVariables>;

export function useGetVibe(vars: GetVibeVariables, options?: useDataConnectQueryOptions<GetVibeData>): UseDataConnectQueryResult<GetVibeData, GetVibeVariables>;
export function useGetVibe(dc: DataConnect, vars: GetVibeVariables, options?: useDataConnectQueryOptions<GetVibeData>): UseDataConnectQueryResult<GetVibeData, GetVibeVariables>;

export function useCreateComment(options?: useDataConnectMutationOptions<CreateCommentData, FirebaseError, CreateCommentVariables>): UseDataConnectMutationResult<CreateCommentData, CreateCommentVariables>;
export function useCreateComment(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCommentData, FirebaseError, CreateCommentVariables>): UseDataConnectMutationResult<CreateCommentData, CreateCommentVariables>;

export function useListVibes(options?: useDataConnectQueryOptions<ListVibesData>): UseDataConnectQueryResult<ListVibesData, undefined>;
export function useListVibes(dc: DataConnect, options?: useDataConnectQueryOptions<ListVibesData>): UseDataConnectQueryResult<ListVibesData, undefined>;
