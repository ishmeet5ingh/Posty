
const localStorageMiddleware = (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState();
    
    // List of action types that should trigger localStorage update
    const actionTypes = [
      'config/setReduxPosts',
      'config/createReduxPost',
      'config/deleteReduxPost',
      'config/updateReduxPost',
      'config/deleteAllReduxPost'
    ];
    
    if (actionTypes.includes(action.type)) {
      try {
        localStorage.setItem('posts', JSON.stringify(state.config.posts));
      } catch (e) {
        console.warn('Error saving to localStorage', e);
      }
    }
    return result;
  };
  
  export default localStorageMiddleware;
  