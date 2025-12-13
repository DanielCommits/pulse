const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'pulse',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createVibeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateVibe', inputVars);
}
createVibeRef.operationName = 'CreateVibe';
exports.createVibeRef = createVibeRef;

exports.createVibe = function createVibe(dcOrVars, vars) {
  return executeMutation(createVibeRef(dcOrVars, vars));
};

const getVibeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetVibe', inputVars);
}
getVibeRef.operationName = 'GetVibe';
exports.getVibeRef = getVibeRef;

exports.getVibe = function getVibe(dcOrVars, vars) {
  return executeQuery(getVibeRef(dcOrVars, vars));
};

const createCommentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateComment', inputVars);
}
createCommentRef.operationName = 'CreateComment';
exports.createCommentRef = createCommentRef;

exports.createComment = function createComment(dcOrVars, vars) {
  return executeMutation(createCommentRef(dcOrVars, vars));
};

const listVibesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListVibes');
}
listVibesRef.operationName = 'ListVibes';
exports.listVibesRef = listVibesRef;

exports.listVibes = function listVibes(dc) {
  return executeQuery(listVibesRef(dc));
};
