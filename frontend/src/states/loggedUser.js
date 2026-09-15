// https://vuejs.org/guide/scaling-up/state-management.html#simple-state-management-with-reactivity-api

import { reactive } from 'vue'

const loggedUser = reactive({
    token: undefined,
    email: undefined,
    id: undefined,
    self: undefined,
    role: undefined
})

function setLoggedUser (data) {
    loggedUser.token = data.token;
    loggedUser.email = data.email;
    loggedUser.id = data.id;
    loggedUser.self = data.self;
    loggedUser.role = data.role || 'user';
}

function clearLoggedUser () {
    loggedUser.token = undefined;
    loggedUser.email = undefined;
    loggedUser.id = undefined;
    loggedUser.self = undefined;
    loggedUser.role = undefined;
}

export { loggedUser, setLoggedUser, clearLoggedUser }
