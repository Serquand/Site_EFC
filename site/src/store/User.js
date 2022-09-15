import { defineStore } from "pinia";
// import router from '../router/index'

import { url } from '../../config.json'
import router from "../router";

export const useAuthStore = defineStore({
    id: 'Auth', 
    state: () => ({
        jwtToken: '', 
        username: '', 
        email: '',    
    }), 

    actions: {
        async login(pseudo, pwd, email, mode) {
            var requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: pseudo, email, pwd, mode }),
            };
            
            let res = await fetch(url + "/profil/login", requestOptions)
            if(res.status === 200 || res.status === 201) {
                res = await res.json()
                this.jwtToken = res.token 
                this.username = res.userId
                this.email = res.email
                if(router.currentRoute.value.query.redirect) router.push(router.currentRoute.value.query.redirect)
            }
        }, 

        async isLoggedIn() {
            console.log(this.jwtToken);
            if(this.username == '' || this.jwtToken == '') return false
            const optionsSearch = { 
                headers: { 'Authorization': 'Bearer ' + this.jwtToken } 
            }
            const isLoggedInResult = await fetch(url + '/profil/auth/' + this.username, optionsSearch)
            if(isLoggedInResult.status == 200) return true
            this.logout()
            return false
        }, 

        logout() {
            this.jwtToken = ''
            this.email = ''
            this.username = ''
            router.push("/")
        }
    }
})