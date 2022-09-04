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
            
            let res = await fetch(url + "/login", requestOptions)
            if(res.status === 200 || res.status === 201) {
                res = await res.json()
                this.jwtToken = res.token 
                this.username = res.userId
                this.email = res.email
                router.push("/")
            }
        }, 

        async isLoggedIn() {
            if(this.username == '' || this.jwtToken == '') return false
            let optionsSearch = {
                headers: { 'Authorization': this.jwtToken }
            }
            const isLoggedInResult = await fetch(url + '/checkAuth/' + this.username, optionsSearch)
            return isLoggedInResult.status == 200
        }, 

        logout() {
            this.jwtToken = ''
            this.email = ''
            this.username = ''
            router.push("/")
        }
    }
})