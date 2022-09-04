<template>
    <div class="header-bar-main-container">
        <div>
            <button 
                @click="toggleMenu"
                class="menu-toggle-container"
            >
                <img src="/assets/Menu.png" alt="Menu" />
            </button>
        </div>
        
        <div class="asso-header-container">
            <router-link to="/">
                <h1>
                    <img src="/assets/logo.png" alt="Logo de l'association" />
                </h1>
            </router-link>
        </div>
        
        <div class="login">
            <div class="login-information">
                <router-link :to="auth.username === '' ? '/login' : '/profil/' + auth.username">
                    <p>{{ auth.username === '' ? 'Connexion' : auth.username }}</p>
                </router-link>
                <p 
                    @click="auth.logout"
                    v-if="auth.username"
                >
                    Déconnexion
                </p>
            </div>
            <router-link :to="auth.username === '' ? '/login' : '/profil/' + auth.username">
                <img src="/assets/Profil.png" alt="Profil" />
            </router-link>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '../store/User'

export default {
    name: "HeaderBar", 

    setup() {
        const auth = useAuthStore()
        return { auth }
    }, 

    methods: {
        toggleMenu() {
            this.$emit("toggle-side-bar")
        }, 
    }
}
</script>

<style>
    .header-bar-main-container {
        top: 0;
        left: 0;
        right: 0;
        position: sticky;
        display: flex;
        height: 70px;
        padding: 0 50px;
        border: 1px solid black;
        justify-content: space-between;
        align-items: center;
        background: black;
    }

    .goToProfil {
        align-items: center;
        display: flex;
    }

    .login {
        display: flex;
        align-items: center;
    }

    .login p {
        cursor: pointer;
    }

    .login-information {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
    }

    .asso-header-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .asso-header-container img {
        height: 50px;
    }

    .menu-toggle-container {
        background: none;
        border: none;
        cursor: pointer;
    }
</style>