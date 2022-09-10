<template>
    <div></div>
</template>

<script>
import { io } from 'socket.io-client'

export default {
    setup() {
        const socket = io("http://localhost:5000")
        return { socket }
    }, 

    created() {
        this.socket.emit("watchAllGames")

        this.socket.on("answerAllGames", payload => console.log(payload))
    }
}
</script>

<style>

</style>