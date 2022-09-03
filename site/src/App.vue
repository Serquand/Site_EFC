<template>
    <div class="app-main-container">
        <div class="chessboard-main-container">
            <div
                :key="index"
                v-for="(n, index) in 64"
                :class="[map[index], 'piece']"
                @click="interactChessboard(index)"
                :style="`background-image: url('/assets/${map[index]}.png');`"
            >
                <div
                    v-if="possibleMove.includes(index)"
                    class="allowed-case-move"
                ></div>
            </div>
        </div>
        <ul class="pgn-container">
            <li 
                :key="move" 
                v-for="(move, index) in pgn"
            >
                {{ (index + 1) + ". " + move.split(" ")[0] + " | " +  (move.split(" ")[1] == undefined ? '' : move.split(" ")[1]) }}
            </li>
        </ul>
        
        <div 
            class="modal modal-init"
            v-if="modalInit"
        >
            <div class="modal-content">
                <p>Nous sommes en recherche de joueurs !</p>
            </div>
        </div>

        <div 
            class="modal modal-promotion"
            v-if="modalPromotion"
        >
            <div class="promotion-content">
                <div 
                    :style="`background-image: url('/assets/${promotionColor}R.png')`" 
                    class="promotion-piece"
                    @click="sendPromotion('R')"
                ></div>
                <div 
                    :style="`background-image: url('/assets/${promotionColor}N.png')`" 
                    class="promotion-piece"
                    @click="sendPromotion('N')"
                ></div>
                <div 
                    :style="`background-image: url('/assets/${promotionColor}B.png')`" 
                    class="promotion-piece"
                    @click="sendPromotion('B')"
                ></div>
                <div 
                    :style="`background-image: url('/assets/${promotionColor}Q.png')`" 
                    class="promotion-piece"
                    @click="sendPromotion('Q')"
                ></div>
            </div>
        </div>
    </div>
</template>

<style>
    *, *::after, *::before {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }

    .chessboard-main-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-color: white;
        display: grid;
        grid-template: repeat(8, 70px) / repeat(8, 70px); 
        border: .5px solid black;
        width: fit-content;
    }

    .chessboard-main-container div, .promotion-content div {
        background-position: center;
        background-size: contain;
        cursor: pointer;
    }

    .chessboard-main-container :not(:is( :nth-child(1), :nth-child(3), :nth-child(5), :nth-child(7), :nth-child(10), :nth-child(12), :nth-child(14), :nth-child(16), :nth-child(19), :nth-child(21), :nth-child(23), :nth-child(17), :nth-child(28), :nth-child(30), :nth-child(32), :nth-child(26), :nth-child(37), :nth-child(35), :nth-child(39), :nth-child(33), :nth-child(42), :nth-child(44), :nth-child(46), :nth-child(48), :nth-child(49), :nth-child(51), :nth-child(53), :nth-child(55), :nth-child(58), :nth-child(60), :nth-child(62), :nth-child(64))) {
        background-color: green;
        border: .5px solid black;
    }

    .modal {
        height: 100%;
        width: 100%;
        position: fixed;
        background-color: #3333;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-content {
        width: 500px;
        height: 200px;
        border-radius: 20px;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .promotion-content {
        display: flex;
    }

    .promotion-content div {
        width: 80px;
        height: 80px;
        background-color: #fff;
        border: 1px solid black;
    }

    .allowed-case-move {
        margin-left: 10%;
        margin-top: 10%;
        height: 80%;
        width: 80%;
        background: rgba(200, 200, 200, 0.8) !important;
        border: .1px solid #333A;
        border-radius: 100%;
    }
</style>

<script>
import { io } from 'socket.io-client'
import { ref } from'vue'

export default {
    setup() {
        const payload = [
            "bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR", 
            "bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP",  
            null, null, null, null, null, null, null, null,  
            null, null, null, null, null, null, null, null, 
            null, null, null, null, null, null, null, null, 
            null, null, null, null, null, null, null, null,
            "wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP",
            "wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"
        ]
        let socket = io("http://localhost:5000"), map = ref(payload), modalInit = ref(false), possibleMove = ref([-1]), 
        modalPromotion = ref(false), promotionColor = ref(''), pgn = ref([])
        return { socket, map, modalInit, possibleMove, modalPromotion, promotionColor, pgn }
    }, 

    created() {
        const sessionId = prompt("Entrez l'ID de la session")
        this.socket.emit("responseUser", sessionId)

        this.socket.on("init", () => this.modalInit = true)
        this.socket.on('play', () => this.modalInit = false)
        this.socket.on("moveTo", (chessboard, pgn) => this.displayMove(chessboard, pgn))
        this.socket.on("showMoveTab", possibleMove => this.displayPossibleMove(possibleMove))
        this.socket.on("promotion", promotion => this.displayPromotion(promotion))
    }, 

    methods: {        
        displayPgn(pgn) {
            let pgnTemp = pgn.split(".")
            pgnTemp.shift()
            for(let i = 0; i < pgnTemp.length; i++) {
                pgnTemp[i] = pgnTemp[i].trim()
                if(pgnTemp[i].split(" ").length == 3) pgnTemp[i] = pgnTemp[i].substring(0, pgnTemp[i].length - 1)
                pgnTemp[i] = pgnTemp[i].trim()
            }
            this.pgn = pgnTemp
        },

        displayMove(chessboard, pgn) {
            this.possibleMove = [-1]
            this.map = chessboard
            this.displayPgn(pgn)
        },

        displayPossibleMove(possibleMove) {
            this.possibleMove = [-1]
            for(let i = 0; i < possibleMove.length; i++) this.possibleMove.push(possibleMove[i])
        },

        interactChessboard(index) {
            this.socket.emit("newInfoClick", index)
        }, 

        displayPromotion(promotion) {
            this.modalPromotion = true
            this.promotionColor = promotion
            console.log(promotion)
        }, 

        sendPromotion(piece) {
            this.socket.emit("promotionChoice", piece)
            this.modalPromotion = false 
            this.promotionColor = ''
        }
    }
}    
</script>