import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import player from '@/components/music-player'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'player',
      component: player
    },{
    	path : '/hello',
    	name : 'hello',
    	component : Hello
    }
  ]
})
