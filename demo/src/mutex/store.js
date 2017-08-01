let state = {
  dogs: {
    collection: [],
    fetchError: {}
  }
};

let listeners = {};
const notifyListeners = (newState) => {
  Object.keys(listeners).map(key => {
    console.log(`Notifying component ${key}`)
    listeners[key].appStateChanged(newState)
    return key;
  });
}

export default {
  getState: () => {
    return state;
  },
  subscribe: (newComponent) => {
    listeners = Object.assign({}, listeners, {[Date.now()]: newComponent});
  },
  unsubscribe: (key) => {
    delete listeners[key];
  },
  mutate: (data, mutations) => {
    mutations.map(mutation => {
      const pathArray = mutation.split('.')
      const path = pathArray.slice(0, -1);
      const stateSlice = path.reduce((root, next) => {
        return root[next];
      }, state);
      
      import(`mutations/${path.join('.').replace(/\./g, '/')}`)
        .then((mutationsModule) => {
          const mutationToApply = mutationsModule[pathArray.pop()];
          if (typeof mutationToApply === 'function') {
            state.dogs = mutationToApply(stateSlice, data);
            notifyListeners(state);
          } else {
            console.warn(`The mutation ${mutation} doesn't exist. Create it in mutatations/${path}.`);
          }
        })
      ;

      return null;
    });
    return null;
  }
}