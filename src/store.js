import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

Vue.use(Vuex);

const getAuthHeader = () => {
    return { headers: { 'Authorization': localStorage.getItem('token') } };
}

export default new Vuex.Store({
    state: {
        user: {},
        boards: [],
        currentBoard: undefined,
        token: '',
        loginError: '',
        registerError: '',
        generalError: ''
    },
    getters: {
        user: state => state.user,
        loggedIn: state => {
            return Boolean(state.token);
        },
        loginError: state => state.loginError,
        registerError: state => state.registerError,
        generalError: state => state.generalError,
        boards: state => state.boards,
        currentBoard: state => state.currentBoard,
        currentStructure: state => state.currentBoard && state.currentBoard.structure && JSON.parse(state.currentBoard.structure)
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setToken(state, token) {
            state.token = token;
            if (token === '')
                localStorage.removeItem('token');
            else
                localStorage.setItem('token', token)
        },
        setLoginError(state, message) {
            state.loginError = message;
        },
        setRegisterError(state, message) {
            state.registerError = message;
        },
        setGeneralError(state, message) {
            state.generalError = message;
        },
        setBoards(state, boards) {
            state.boards = boards;
        },
        setCurrentBoard(state, currentBoard) {
            state.currentBoard = currentBoard;
        }
    },
    actions: {
        // Register
        register(context, user) {
            axios.post("/api/users", user).then(response => {
                context.commit('setUser', response.data.user);
                context.commit('setToken', response.data.token);
                context.commit('setRegisterError', "");
                context.commit('setLoginError', "");
            }).catch(error => {
                context.commit('setLoginError', "");
                context.commit('setUser', {});
                context.commit('setToken', '');
                if (error.response) {
                    if (error.response.status === 403)
                        context.commit('setRegisterError', "That email address already has an account.");
                    return;
                }
                context.commit('setRegisterError', "Sorry, your request failed. We will look into it.");
            });
        },
        initialize(context) {
            let token = localStorage.getItem('token');
            if (token) {
                // see if we can use the token to get my user account
                axios.get("/api/me", getAuthHeader()).then(response => {
                    context.commit('setToken', token);
                    context.commit('setUser', response.data.user);
                }).catch(err => {
                    // remove token and user from state
                    localStorage.removeItem('token');
                    context.commit('setUser', {});
                    context.commit('setToken', '');
                });
            }
        },
        // Login
        login(context, user) {
            axios.post("/api/login", user).then(response => {
                context.commit('setUser', response.data.user);
                context.commit('setToken', response.data.token);
                context.commit('setRegisterError', "");
                context.commit('setLoginError', "");
            }).catch(error => {
                context.commit('setRegisterError', "");
                if (error.response) {
                    if (error.response.status === 403 || error.response.status === 400)
                        context.commit('setLoginError', "Invalid login.");
                    context.commit('setUser', {});
                    context.commit('setToken', '');
                    context.commit('setRegisterError', "");
                    return;
                }
                context.commit('setLoginError', "Sorry, your request failed. We will look into it.");
            });
        },
        // Logout
        logout(context, user) {
            context.commit('setUser', {});
            context.commit('setToken', '');
            context.commit('setCurrentBoard', undefined)
        },
        // Get all boards for current user
        getBoards(context) {
            axios.get(`/api/${context.state.user.id}/boards`, getAuthHeader()).then(response => {
                context.commit('setBoards', response.data.boards);
            }).catch(error => {
                context.commit('setGeneralError', "");
                if (error.response) {
                    if (error.response.status === 403 || error.response.status === 400)
                        context.commit('setGeneralError', `Error retrieving boards ${error.response}`);
                    return;
                }
                context.commit('setGeneralError', "Sorry, we couldn't complete your request. We will look into it.");
            });
        },
        createBoard(context, board) {
            axios.post(`/api/${context.state.user.id}/boards`, board, getAuthHeader()).then(response => {
                if (response.data.board)
                    context.commit('setBoards', context.state.boards.concat(response.data.board));
                context.commit('setCurrentBoard', response.data.board)
            }).catch(error => {
                context.commit('setGeneralError', "");
                if (error.response) {
                    if (error.response.status === 403 || error.response.status === 400)
                        context.commit('setGeneralError', `Error creating board ${error.response}`);
                    return;
                }
            })
        },
        saveBoard(context, structure) {
            axios.put(`/api/${context.state.user.id}/boards/${context.state.currentBoard.id}`,
                { structure }, getAuthHeader()).then(response => {

                }).catch(error => {
                    if (error.response) {
                        if (error.response.status === 403 || error.response.status === 400)
                            context.commit('setGeneralError', `Error saving board ${error.response}`);
                        return;
                    }
                })
        }
    }
});