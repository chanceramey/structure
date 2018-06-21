"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vuex_1 = require("vuex");
var axios_1 = require("axios");
vue_1.default.use(vuex_1.default);
var getAuthHeader = function () {
    return { headers: { 'Authorization': localStorage.getItem('token') } };
};
exports.default = new vuex_1.default.Store({
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
        user: function (state) { return state.user; },
        loggedIn: function (state) {
            return Boolean(state.token);
        },
        loginError: function (state) { return state.loginError; },
        registerError: function (state) { return state.registerError; },
        generalError: function (state) { return state.generalError; },
        boards: function (state) { return state.boards; },
        currentBoard: function (state) { return state.currentBoard; },
        currentStructure: function (state) { return state.currentBoard && state.currentBoard.structure && JSON.parse(state.currentBoard.structure); }
    },
    mutations: {
        setUser: function (state, user) {
            state.user = user;
        },
        setToken: function (state, token) {
            state.token = token;
            if (token === '')
                localStorage.removeItem('token');
            else
                localStorage.setItem('token', token);
        },
        setLoginError: function (state, message) {
            state.loginError = message;
        },
        setRegisterError: function (state, message) {
            state.registerError = message;
        },
        setGeneralError: function (state, message) {
            state.generalError = message;
        },
        setBoards: function (state, boards) {
            state.boards = boards;
        },
        setCurrentBoard: function (state, currentBoard) {
            state.currentBoard = currentBoard;
        }
    },
    actions: {
        // Register
        register: function (context, user) {
            axios_1.default.post("/api/users", user).then(function (response) {
                context.commit('setUser', response.data.user);
                context.commit('setToken', response.data.token);
                context.commit('setRegisterError', "");
                context.commit('setLoginError', "");
            }).catch(function (error) {
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
        initialize: function (context) {
            var token = localStorage.getItem('token');
            if (token) {
                // see if we can use the token to get my user account
                axios_1.default.get("/api/me", getAuthHeader()).then(function (response) {
                    context.commit('setToken', token);
                    context.commit('setUser', response.data.user);
                }).catch(function (err) {
                    // remove token and user from state
                    localStorage.removeItem('token');
                    context.commit('setUser', {});
                    context.commit('setToken', '');
                });
            }
        },
        // Login
        login: function (context, user) {
            axios_1.default.post("/api/login", user).then(function (response) {
                context.commit('setUser', response.data.user);
                context.commit('setToken', response.data.token);
                context.commit('setRegisterError', "");
                context.commit('setLoginError', "");
            }).catch(function (error) {
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
        logout: function (context, user) {
            context.commit('setUser', {});
            context.commit('setToken', '');
            context.commit('setCurrentBoard', undefined);
        },
        // Get all boards for current user
        getBoards: function (context) {
            axios_1.default.get("/api/" + context.state.user.id + "/boards", getAuthHeader()).then(function (response) {
                context.commit('setBoards', response.data.boards);
            }).catch(function (error) {
                context.commit('setGeneralError', "");
                if (error.response) {
                    if (error.response.status === 403 || error.response.status === 400)
                        context.commit('setGeneralError', "Error retrieving boards " + error.response);
                    return;
                }
                context.commit('setGeneralError', "Sorry, we couldn't complete your request. We will look into it.");
            });
        },
        createBoard: function (context, board) {
            axios_1.default.post("/api/" + context.state.user.id + "/boards", board, getAuthHeader()).then(function (response) {
                if (response.data.board)
                    context.commit('setBoards', context.state.boards.concat(response.data.board));
                context.commit('setCurrentBoard', response.data.board);
            }).catch(function (error) {
                context.commit('setGeneralError', "");
                if (error.response) {
                    if (error.response.status === 403 || error.response.status === 400)
                        context.commit('setGeneralError', "Error creating board " + error.response);
                    return;
                }
            });
        },
        saveBoard: function (context, structure) {
            axios_1.default.put("/api/" + context.state.user.id + "/boards/" + context.state.currentBoard.id, { structure: structure }, getAuthHeader()).then(function (response) {
            }).catch(function (error) {
                if (error.response) {
                    if (error.response.status === 403 || error.response.status === 400)
                        context.commit('setGeneralError', "Error saving board " + error.response);
                    return;
                }
            });
        },
        deleteBoard: function (context, id) {
            axios_1.default.delete("/api/" + context.state.user.id + "/boards/" + id, getAuthHeader())
                .then(function (response) {
                context.dispatch('getBoards');
            }).catch(function (error) {
                if (error.response) {
                    if (error.response.status === 403 || error.response.status === 400)
                        context.commit('setGeneralError', "Error deleting board " + error.response);
                    return;
                }
            });
        }
    }
});
