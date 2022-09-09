<template>
    <div>
        <h1>{{ linkSent != '' ? 'http://localhost:8080/game/' + linkSent : '' }}</h1>
    </div>
</template>

<script>
import { io } from 'socket.io-client'
import router from "../router/index";
import { ref } from 'vue';

export default {
    setup() {
        let socket = io("http://localhost:5000"), linkSent = ref('')
        return { socket, linkSent }
    },

    created() {
        this.socket.emit("generateLink")
        this.socket.on("linkGenerated", idGame => this.linkSent = idGame)
        this.socket.on("userJoined", () => router.push('/game/' + this.linkSent))
    }
}
</script>

<style>

</style>