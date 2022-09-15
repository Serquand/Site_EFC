<template>
    <div class="all-games-main-container">
        <div :key="game" v-for="game in allGames">
            <LittleGame :information="game" />
        </div>
    </div>
</template>

<script>
import { io } from 'socket.io-client'
import { ref } from 'vue'
import LittleGame from "../components/LittleGame.vue"

export default {
    setup() {
        const socket = io("http://localhost:5000"), allGames = ref([])
        return { socket, allGames }
    }, 

    components: {
        LittleGame
    },

    created() {
        this.socket.emit("watchAllGames")

        this.socket.on("answerAllGames", allGames => this.allGames = allGames)
    }
}
</script>

<style>
.all-games-main-container {
    display: flex;
    flex-wrap: wrap;
}
</style>