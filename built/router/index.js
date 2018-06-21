"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var HomePage_1 = require("@/components/HomePage");
var Workspace_1 = require("@/components/Workspace");
var Board_1 = require("@/components/Board");
vue_1.default.use(vue_router_1.default);
exports.default = new vue_router_1.default({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'HomePage',
            component: HomePage_1.default
        },
        {
            path: '/workspace',
            name: 'Workspace',
            component: Workspace_1.default
        },
        {
            path: '/board/:board_id',
            name: 'Board',
            component: Board_1.default
        }
    ]
});
