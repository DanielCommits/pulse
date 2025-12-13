# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetVibe*](#getvibe)
  - [*ListVibes*](#listvibes)
- [**Mutations**](#mutations)
  - [*CreateVibe*](#createvibe)
  - [*CreateComment*](#createcomment)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetVibe
You can execute the `GetVibe` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getVibe(vars: GetVibeVariables): QueryPromise<GetVibeData, GetVibeVariables>;

interface GetVibeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetVibeVariables): QueryRef<GetVibeData, GetVibeVariables>;
}
export const getVibeRef: GetVibeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getVibe(dc: DataConnect, vars: GetVibeVariables): QueryPromise<GetVibeData, GetVibeVariables>;

interface GetVibeRef {
  ...
  (dc: DataConnect, vars: GetVibeVariables): QueryRef<GetVibeData, GetVibeVariables>;
}
export const getVibeRef: GetVibeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getVibeRef:
```typescript
const name = getVibeRef.operationName;
console.log(name);
```

### Variables
The `GetVibe` query requires an argument of type `GetVibeVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetVibeVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetVibe` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetVibeData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetVibe`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getVibe, GetVibeVariables } from '@dataconnect/generated';

// The `GetVibe` query requires an argument of type `GetVibeVariables`:
const getVibeVars: GetVibeVariables = {
  id: ..., 
};

// Call the `getVibe()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getVibe(getVibeVars);
// Variables can be defined inline as well.
const { data } = await getVibe({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getVibe(dataConnect, getVibeVars);

console.log(data.vibe);

// Or, you can use the `Promise` API.
getVibe(getVibeVars).then((response) => {
  const data = response.data;
  console.log(data.vibe);
});
```

### Using `GetVibe`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getVibeRef, GetVibeVariables } from '@dataconnect/generated';

// The `GetVibe` query requires an argument of type `GetVibeVariables`:
const getVibeVars: GetVibeVariables = {
  id: ..., 
};

// Call the `getVibeRef()` function to get a reference to the query.
const ref = getVibeRef(getVibeVars);
// Variables can be defined inline as well.
const ref = getVibeRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getVibeRef(dataConnect, getVibeVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.vibe);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.vibe);
});
```

## ListVibes
You can execute the `ListVibes` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listVibes(): QueryPromise<ListVibesData, undefined>;

interface ListVibesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListVibesData, undefined>;
}
export const listVibesRef: ListVibesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listVibes(dc: DataConnect): QueryPromise<ListVibesData, undefined>;

interface ListVibesRef {
  ...
  (dc: DataConnect): QueryRef<ListVibesData, undefined>;
}
export const listVibesRef: ListVibesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listVibesRef:
```typescript
const name = listVibesRef.operationName;
console.log(name);
```

### Variables
The `ListVibes` query has no variables.
### Return Type
Recall that executing the `ListVibes` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListVibesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListVibes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listVibes } from '@dataconnect/generated';


// Call the `listVibes()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listVibes();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listVibes(dataConnect);

console.log(data.vibes);

// Or, you can use the `Promise` API.
listVibes().then((response) => {
  const data = response.data;
  console.log(data.vibes);
});
```

### Using `ListVibes`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listVibesRef } from '@dataconnect/generated';


// Call the `listVibesRef()` function to get a reference to the query.
const ref = listVibesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listVibesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.vibes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.vibes);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateVibe
You can execute the `CreateVibe` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createVibe(vars: CreateVibeVariables): MutationPromise<CreateVibeData, CreateVibeVariables>;

interface CreateVibeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateVibeVariables): MutationRef<CreateVibeData, CreateVibeVariables>;
}
export const createVibeRef: CreateVibeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createVibe(dc: DataConnect, vars: CreateVibeVariables): MutationPromise<CreateVibeData, CreateVibeVariables>;

interface CreateVibeRef {
  ...
  (dc: DataConnect, vars: CreateVibeVariables): MutationRef<CreateVibeData, CreateVibeVariables>;
}
export const createVibeRef: CreateVibeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createVibeRef:
```typescript
const name = createVibeRef.operationName;
console.log(name);
```

### Variables
The `CreateVibe` mutation requires an argument of type `CreateVibeVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateVibeVariables {
  content: string;
  imageUrl?: string | null;
  visibility: string;
}
```
### Return Type
Recall that executing the `CreateVibe` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateVibeData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateVibeData {
  vibe_insert: Vibe_Key;
}
```
### Using `CreateVibe`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createVibe, CreateVibeVariables } from '@dataconnect/generated';

// The `CreateVibe` mutation requires an argument of type `CreateVibeVariables`:
const createVibeVars: CreateVibeVariables = {
  content: ..., 
  imageUrl: ..., // optional
  visibility: ..., 
};

// Call the `createVibe()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createVibe(createVibeVars);
// Variables can be defined inline as well.
const { data } = await createVibe({ content: ..., imageUrl: ..., visibility: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createVibe(dataConnect, createVibeVars);

console.log(data.vibe_insert);

// Or, you can use the `Promise` API.
createVibe(createVibeVars).then((response) => {
  const data = response.data;
  console.log(data.vibe_insert);
});
```

### Using `CreateVibe`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createVibeRef, CreateVibeVariables } from '@dataconnect/generated';

// The `CreateVibe` mutation requires an argument of type `CreateVibeVariables`:
const createVibeVars: CreateVibeVariables = {
  content: ..., 
  imageUrl: ..., // optional
  visibility: ..., 
};

// Call the `createVibeRef()` function to get a reference to the mutation.
const ref = createVibeRef(createVibeVars);
// Variables can be defined inline as well.
const ref = createVibeRef({ content: ..., imageUrl: ..., visibility: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createVibeRef(dataConnect, createVibeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.vibe_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.vibe_insert);
});
```

## CreateComment
You can execute the `CreateComment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createComment(vars: CreateCommentVariables): MutationPromise<CreateCommentData, CreateCommentVariables>;

interface CreateCommentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCommentVariables): MutationRef<CreateCommentData, CreateCommentVariables>;
}
export const createCommentRef: CreateCommentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createComment(dc: DataConnect, vars: CreateCommentVariables): MutationPromise<CreateCommentData, CreateCommentVariables>;

interface CreateCommentRef {
  ...
  (dc: DataConnect, vars: CreateCommentVariables): MutationRef<CreateCommentData, CreateCommentVariables>;
}
export const createCommentRef: CreateCommentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCommentRef:
```typescript
const name = createCommentRef.operationName;
console.log(name);
```

### Variables
The `CreateComment` mutation requires an argument of type `CreateCommentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCommentVariables {
  vibeId: UUIDString;
  content: string;
}
```
### Return Type
Recall that executing the `CreateComment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCommentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCommentData {
  comment_insert: Comment_Key;
}
```
### Using `CreateComment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createComment, CreateCommentVariables } from '@dataconnect/generated';

// The `CreateComment` mutation requires an argument of type `CreateCommentVariables`:
const createCommentVars: CreateCommentVariables = {
  vibeId: ..., 
  content: ..., 
};

// Call the `createComment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createComment(createCommentVars);
// Variables can be defined inline as well.
const { data } = await createComment({ vibeId: ..., content: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createComment(dataConnect, createCommentVars);

console.log(data.comment_insert);

// Or, you can use the `Promise` API.
createComment(createCommentVars).then((response) => {
  const data = response.data;
  console.log(data.comment_insert);
});
```

### Using `CreateComment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCommentRef, CreateCommentVariables } from '@dataconnect/generated';

// The `CreateComment` mutation requires an argument of type `CreateCommentVariables`:
const createCommentVars: CreateCommentVariables = {
  vibeId: ..., 
  content: ..., 
};

// Call the `createCommentRef()` function to get a reference to the mutation.
const ref = createCommentRef(createCommentVars);
// Variables can be defined inline as well.
const ref = createCommentRef({ vibeId: ..., content: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCommentRef(dataConnect, createCommentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comment_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comment_insert);
});
```

