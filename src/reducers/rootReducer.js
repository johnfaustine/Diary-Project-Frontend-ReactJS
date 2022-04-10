const initState = {
    accessToken: undefined,
    isAuthenticated: false,
    isFetching: true
}

const rootReducer = (state = initState, action) => {
    console.log(action);
    if (action.type === 'SET_TOKEN') {
        return {
            ...state,
            accessToken: action.token,
            isAuthenticated: true,
            isFetching: false
        }
    }
    if (action.type === 'REMOVE_TOKEN') {
        return {
            ...state,
            accessToken: undefined,
            isAuthenticated: false
        }
    }
    if (action.type === 'DONE_FETCH') {
        return {
            ...state,
            isFetching: false
        }
    }
    return state;
}

export default rootReducer