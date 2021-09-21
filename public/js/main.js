const setToStorage = (key, value) => {
    localStorage.setItem(key, value);
}

const getFromStorage = (key) => {
    return localStorage.getItem(key)
}