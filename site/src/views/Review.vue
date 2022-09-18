<template>
    <h1>Review</h1>
</template>

<script>
import { url } from '../../config.json'
import { ref } from 'vue'


export default {
    setup() {
        const pgn = ref(""), firstPlayer = ref(""), secondPlayer = ref(""), firstElo = ref(0), secondElo = ref(0)
        return { pgn, firstPlayer, secondPlayer, firstElo, secondElo }
    }, 

    async created() {
        const res = await (await fetch(url + "/review/" + this.$route.params.idGame)).json()
        console.log(res)
    }
}
</script>

<style>

</style>