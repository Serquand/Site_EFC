import { createRouter, createWebHistory } from 'vue-router'
import Accueil from '../views/Accueil'
import Login from '../views/Login'
import NotFound from '../views/NotFound'
import CreatedProbleme from '../views/CreatedProbleme'
import PlayProbleme from '../views/PlayProbleme'
import API from '../views/API'
import WatchGame from '../views/watchGame'
import Profil from '../views/Profil'
import BecomeMembre from "../views/BecomeMember"
import MoreOnUs from '../views/MoreOnUs'
import startGame from '../views/startGame'
import Tournament from '../views/Tournament'

import { useAuthStore } from '../store/User'

const routes = [
    {
        path: '/',
        name: 'Accueil',
        component: Accueil
    },
    {
        path: '/tournament',
        name: 'Tournoi',
        component: Tournament
    },
    {
        path: '/becomeMember',
        name: 'Devenir membre',
        component: BecomeMembre
    },
    {
        path: '/moreOnUs',
        name: 'A propos',
        component: MoreOnUs
    },
    {
        path: '/startGame',
        name: 'Commencer une partie',
        component: startGame
    },    
    {
        path: '/profil/:userId', 
        name: 'Profil', 
        component: Profil
    },
    {
        path: '/login', 
        name: 'Login', 
        component: Login
    },
    {
        path: '/createProbleme', 
        name: 'Créer un problème', 
        component: CreatedProbleme,
        // meta: { requireAuth: true }
    },
    {
        path: '/playProbleme', 
        name: 'Jouer un problème', 
        component: PlayProbleme,
        meta: { requireAuth: true }
    },
    {
        path: '/api', 
        name: 'API - Docs', 
        component: API, 
    },
    {
        path: '/:pathMatching(.*)*', 
        name: 'NotFound',
        component: NotFound, 
    },
    {
        path: '/watchGame', 
        name: 'Regarder une partie', 
        component: WatchGame
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach(async to => {
    const auth = useAuthStore()
    if(to.meta?.requireAuth && !(await auth.isLoggedIn())) return { path: '/login' }
})

export default router