const JWTManager = () => {
    let JWTMemory = null;

    const getToken = () => JWTMemory;

    const setToken = (token) => {
        JWTMemory = token;
        return true;
    };

    const removeToken = () => {
        JWTMemory = null;
        return true;
    }

    return {
        removeToken,
        getToken,
        setToken,
    }
};

export default JWTManager();