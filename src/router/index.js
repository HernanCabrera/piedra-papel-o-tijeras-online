import Vue from 'vue'
import Router from 'vue-router'

import Signup from '@/components/User/Signup'
import Signin from '@/components/User/Signin'
import AuthGuard from './auth-guard'

import Partidas from '@/components/Partidas/Partidas'
import Partida from '@/components/Partidas/Partida'
import CrearPartida from '@/components/Partidas/CrearPartida'
import Creador from '@/components/Creador'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/partidas'
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/creador',
      name: 'Creador',
      component: Creador
    },
    {
      path: '/partidas',
      name: 'Partidas',
      component: Partidas
    },
    {
      path: '/partida/nueva',
      name: 'CrearPartida',
      component: CrearPartida,
      beforeEnter: AuthGuard
    },
    {
      path: '/partida/:id',
      props: true,
      name: 'Partida',
      component: Partida,
      beforeRouteUpdate: AuthGuard
    },
    {
      path: '*',
      component: Partidas
    }
  ],
  mode: 'history'
})
