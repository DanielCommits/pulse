import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'pulse',
  location: 'us-east4'
};

export const createVibeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateVibe', inputVars);
}
createVibeRef.operationName = 'CreateVibe';

export function createVibe(dcOrVars, vars) {
  return executeMutation(createVibeRef(dcOrVars, vars));
}

export const getVibeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetVibe', inputVars);
}
getVibeRef.operationName = 'GetVibe';

export function getVibe(dcOrVars, vars) {
  return executeQuery(getVibeRef(dcOrVars, vars));
}

export const createCommentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateComment', inputVars);
}
createCommentRef.operationName = 'CreateComment';

export function createComment(dcOrVars, vars) {
  return executeMutation(createCommentRef(dcOrVars, vars));
}

export const listVibesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListVibes');
}
listVibesRef.operationName = 'ListVibes';

export function listVibes(dc) {
  return executeQuery(listVibesRef(dc));
}

