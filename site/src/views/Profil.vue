<template>
    <h1>Profil</h1>
</template>

<script>
import { url } from '../../config.json' 
import { ref } from 'vue'

export default {
    setup() {
        const games = ref([]), profil = ref({})

        return { games, profil }
    }, 

    async created() {
        const profil = await (await fetch(url + "/profil/profil/" + this.$route.params.searchedUser)).json()
        console.log(profil)
    }
}
</script>

<style>
</style>