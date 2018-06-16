import Vue from 'vue';
import Router from 'vue-router';
import HomePage from '@/components/HomePage';
import Workspace from '@/components/Workspace';
import Board from '@/components/Board'


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/workspace',
      name: 'Workspace',
      component: Workspace
    },
    {
      path: '/board/:board_id',
      name: 'Board',
      component: Board
    }
  ]
})