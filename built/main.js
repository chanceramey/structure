"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
var vue_1 = require("vue");
var App_1 = require("./App");
var router_1 = require("./router");
var store_1 = require("./store");
vue_1.default.config.productionTip = false;
/* eslint-disable no-new */
new vue_1.default({
    el: '#app',
    router: router_1.default,
    store: store_1.default,
    render: function (h) { return h(App_1.default); },
    beforeCreate: function () {
        this.$store.dispatch('initialize');
    }
});
