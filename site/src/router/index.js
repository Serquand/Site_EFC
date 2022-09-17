import { createRouter, createWebHistory } from 'vue-router'
import Accueil from '../views/Accueil'
import Login from '../views/Login'
import NotFound from '../views/NotFound'
import CreatedProbleme from '../views/CreatedProbleme'
import PlayProbleme from '../views/PlayProbleme'
import WatchGame from '../views/watchGame'
import Profil from '../views/Profil'
import BecomeMembre from "../views/BecomeMember"
import MoreOnUs from '../views/MoreOnUs'
import Game from '../views/Game'
import Tournament from '../views/Tournament'
import SendLink from '../views/SendLink'


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
        component: Tournament, 
        meta: { requireAuth: true }

    },
    {
        path: '/becomeMember',
        name: 'Devenir membre',
        component: BecomeMembre, 
    },
    {
        path: '/moreOnUs',
        name: 'A propos',
        component: MoreOnUs
    },
    {
        path: '/game/:idGame?',
        name: 'Commencer une partie',
        component: Game,
        meta: { requireAuth: true }

    },    
    {
        path: '/profil/:searchedUser', 
        name: 'Profil', 
        component: Profil,
        meta: { requireAuth: true }
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
        meta: { requireAuth: true }
    },
    {
        path: '/sendLink/:idGame', 
        name: 'Envoyer un lien',
        component: SendLink, 
        meta: { requireAuth: true }
    },
    {
        path: '/playProbleme', 
        name: 'Jouer un problème', 
        component: PlayProbleme,
        meta: { requireAuth: true }
    },
    {
        path: '/:pathMatching(.*)*', 
        name: 'NotFound',
        component: NotFound, 
    },
    {
        path: '/watchGame', 
        name: 'Regarder les parties', 
        component: WatchGame
    }, 
    {
        path: '/watch/:idGame',
        name: 'Regarder une partie', 
        component: Game
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach(async to => {
    const auth = useAuthStore()
    if(to.meta?.requireAuth && !(await auth.isLoggedIn())) return { 
        path: '/login', 
        query: { redirect: to.fullPath } 
    }
})

export default router