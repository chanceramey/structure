import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: {},
        boards: [],
        currentBoard: {},
        loggedIn: false,
        loginError: '',
        registerError: '',
        generalError: ''
    },
    getters: {
        user: state => state.user,
        loggedIn: state => state.loggedIn,
        loginError: state => state.loginError,
        registerError: state => state.registerError,
        generalError: state => state.generalError,
        boards: state => state.boards,
        currentBoard: state => state.currentBoard
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setLogin(state, status) {
            state.loggedIn = status;
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
                context.commit('setLogin', true);
                context.commit('setRegisterError', "");
                context.commit('setLoginError', "");
            }).catch(error => {
                context.commit('setLoginError', "");
                context.commit('setLogin', false);
                if (error.response) {
                    if (error.response.status === 403)
                        context.commit('setRegisterError', "That email address already has an account.");
                    return;
                }
                context.commit('setRegisterError', "Sorry, your request failed. We will look into it.");
            });
        },
        // Login
        login(context, user) {
            axios.post("/api/login", user).then(response => {
                context.commit('setUser', response.data.user);
                context.commit('setLogin', true);
                context.commit('setRegisterError', "");
                context.commit('setLoginError', "");
            }).catch(error => {
                context.commit('setRegisterError', "");
                if (error.response) {
                    if (error.response.status === 403 || error.response.status === 400)
                        context.commit('setLoginError', "Invalid login.");
                    context.commit('setRegisterError', "");
                    return;
                }
                context.commit('setLoginError', "Sorry, your request failed. We will look into it.");
            });
        },
        // Logout
        logout(context, user) {
            context.commit('setUser', {});
            context.commit('setLogin', false);
        },
        // Get all boards for current user
        getBoards(context) {
            axios.get(`/api/${context.state.user.id}/boards`).then(response => {
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
            axios.post(`/api/${context.state.user.id}/boards`, board).then(response => {
                if (response.data.board)
                    context.commit('setBoards', context.state.boards.concat(response.data.board));
            }).catch(error => {
                context.commit('setGeneralError', "");
                if (error.response) {
                    if (error.response.status === 403 || error.response.status === 400)
                        context.commit('setGeneralError', `Error retrieving boards ${error.response}`);
                    return;
                }
            })
        }
    }
});