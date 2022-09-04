<template>
    <div 
        class="sidebar-main-container"
        @mouseleave="choiceNav = ''"
    >
        <nav>
            <div class="main-nav">
            <ul>
                <router-link to="/">
                    <li>Accueil</li>
                </router-link>
                
                <li @click="choiceNav = choiceNav == 'Play' ? '' : 'Play'">
                    <span>Jouer</span>
                    <span class="add-navigation-choice">></span>
                </li>
                
                <router-link to="/watchGame">
                    <li>Regarder une partie</li>
                </router-link>

                <li @click="choiceNav = choiceNav == 'Puzzles' ? '' : 'Puzzles'">
                    <span>Problèmes</span>
                    <span class="add-navigation-choice">></span>
                </li>

                <li @click="choiceNav = choiceNav == 'efc' ? '' : 'efc'">
                    <span>EFC</span>
                    <span class="add-navigation-choice">></span>
                </li>
            </ul>
            </div>

            <div 
                v-if="choiceNav != ''"
                class="second-nav">
                <div 
                    v-if="choiceNav == 'Play'"
                    class="play-menu">
                    <ul>
                        <router-link to="/sendLink">
                            <li @click="choiceNav = ''">Envoyer un lien</li>
                        </router-link>
                        
                        <router-link to="/startGame">
                            <li @click="choiceNav = ''">Chercher un adversaire</li>
                        </router-link>
                        
                        <router-link to="/tournament">
                            <li @click="choiceNav = ''">Tournoi</li>
                        </router-link>
                    </ul>
                </div>
                <div
                    v-if="choiceNav == 'Puzzles'"
                    class="puzzle-menu">
                    <ul>
                        <router-link to="/playProbleme">
                            <li @click="choiceNav = ''">Jouer</li>
                        </router-link>

                        <router-link to="/createProbleme">
                            <li @click="choiceNav = ''">Créer un problème</li>
                        </router-link>
                    </ul>
                </div>
                <div 
                    v-if="choiceNav == 'efc'"
                    class="efc-menu">
                    <ul>
                        <router-link to="/becomeMember">
                            <li @click="choiceNav = ''">Devenir membre</li>
                        </router-link>

                        <router-link to="/moreOnUs">
                            <li @click="choiceNav = ''">A propos</li>
                        </router-link>
                    </ul>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
import { ref } from 'vue'

export default {
    setup() {
        const choiceNav = ref("")
        return { choiceNav }
    }
}
</script>

<style>
    .sidebar-main-container {
        top: 70px;
        left: 0;
        bottom: 0;
        position: fixed;
        border-top: 1px solid rgb(50, 50, 50);
        padding-top: 20px;
        overflow-x: hidden;
        background: black;  
        font-size: 12px;
    }

    nav {
        display: flex;
    }

    nav ul {
        list-style-type: none;
        width: 14rem;
    }

    nav ul li {
        padding: 8px 15px 8px 20px;
        width: 100%;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    nav ul li:hover {
        background: rgb(50, 50, 50);
    }
</style>