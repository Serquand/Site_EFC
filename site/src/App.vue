<template>
    <div class="app-main-container">
        <div class="main-chessboard-container">
            <div
                :key="index"
                v-for="(n, index) in 64"
                :class="[map[index], 'piece']"
                @click="interactChessboard(index)"
            ></div>
        </div>
    </div>
</template>

<style>
    .chessboard-main-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>

<script>
import { io } from 'socket.io-client'


export default {
    setup() {
        let socket = io("http://localhost:5000")
        return { socket }
    }, 

    created() {
        const sessionId = prompt("Entrez l'ID de la session")
        this.socket.emit("responseUser", sessionId)

        this.socket.on('play', chessboard => this.displayChessboard(chessboard))
        this.socket.on("moveTo", chessboard => this.displayChessboard(chessboard))
        this.socket.on("showMoveTab", possibleMove => this.displayPossibleMove(possibleMove))
    }, 

    methods: {
        displayChessboard (payload) {
            console.log(payload)
        }, 

        interactChessboard(index) {
            console.log(index)
        }
    }
}    
</script>