export function collectionFetchSuccess(state, payload) {
  state.collection = Object.keys(payload.message);
  return state;
}

export function collectionFetchError(state, payload) {

}