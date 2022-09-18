<template>
    <h1>Profil</h1>
</template>

<script>
import { url } from '../../config.json' 
export default {
    setup() {

    }, 

    async created() {
        const profil = await (await fetch(url + "/profil/profil/" + this.$route.params.searchedUser)).json()
        console.log(profil)
    }
}
</script>

<style>
</style>