<template>
    <form 
        class="login-form"
        @submit.prevent="sendForm()" 
    >
        <h1>{{ mode }}</h1>
        
        <div class="champ-form-container">
            <label for="pseudo-input">Pseudo :</label>
            <input 
                type="text"
                class="input-login-form" 
                placeholder="Pseudonyme"
                v-model="username"
                id="pseudo-input"
            />
        </div>

        <div 
            v-if="mode != 'Mot de passe oublié'"
            class="champ-form-container"
        >
            <label for="pwd-input">Mot de passe :</label>
            <input 
                type="password"
                class="input-login-form" 
                placeholder="Mot de passe"
                v-model="password"
                id="pwd-input"
            />
        </div>

        <div 
            v-if="mode == 'Inscription'"
            class="champ-form-container"
        >
            <label for="reset-pwd-input">Confirmer le mot de passe :</label>
            <input 
                type="password"
                class="input-login-form" 
                placeholder="Mot de passe"
                v-model="resetPwd"
                id="reset-pwd-input"
            />
        </div>

        <div 
            v-if="mode != 'Connexion'"    
            class="champ-form-container"
        >
            <label for="mail-input">Adresse mail :</label>
            <input 
                type="text"
                class="input-login-form" 
                placeholder="Adresse mail"
                v-model="email"
                id="mail-input"
            />
        </div>

        <button type="submit">{{ mode }}</button>
        <p 
            @click="mode = mode == 'Mot de passe oublié' ? 'Connexion' : 'Mot de passe oublié'"
            class="pwd-forgotten"
        >
            {{  mode == 'Mot de passe oublié' ? 'Connexion' : 'Mot de passe oublié ?' }}
        </p>
    </form>
</template>

<script>
import { ref } from 'vue'
import { useAuthStore } from '../store/User'

export default {
    name: "Login", 

    setup() {
        let mode = ref("Connexion"), 
            togglePwd = ref(false), 
            password = ref(""), 
            username = ref(""), 
            email = ref(""), 
            errorAfterLogin = ref(""), 
            errorBeforeLogin = ref([]), 
            resetPwd = ref("")
        return { resetPwd, mode, togglePwd, password, username, email, errorAfterLogin, errorBeforeLogin }
    },

    methods: {
        sendForm() {
            const auth = useAuthStore()
            auth.login(this.username, this.password, this.email, this.mode)
        },
    }
}
</script>
        
<style>
    .login-form input {
        color: black;
        width: 200px;
        height: 20px;
    }

    .login-form label {
        cursor: pointer;
    }

    .login-form {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, .3);
        padding: 50px 75px;
        border-radius: 2rem;
    }

    .login-form h1 {
        margin-bottom: 15px;
        text-decoration: underline;
    }

    .login-form button {
        background-color: #7fa650;
        border: none;
        font-size: 16px;
        font-weight: 500;
        padding: 0.75rem 1.25rem;
        border-radius: 0.5rem;
        margin-top: 20px;
        cursor: pointer;
    }

    .champ-form-container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin: 10px 0;
    }

    .pwd-forgotten {
        margin-top: 8px;
        font-size: 12px;
        cursor: pointer;
    }
</style>