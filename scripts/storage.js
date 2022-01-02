const unsupported = () => { alert("Your browser does not support the local storage API."); }

const saveData = (key, value) => {
    if (localStorage) {
        localStorage.setItem(key, value);
        return value;
    } else { unsupported(); }
}

const loadData = key => {
    if (localStorage) { return key in localStorage && localStorage.getItem(key); }
    else { unsupported(); }
}

const incrementData = key => saveData(key, Number(loadData(key)) + 1);

const decrementData = key => saveData(key, Number(loadData(key)) - 1);

