<template>
    <div class="app-main-container">
        <Chat 
            @message="sendMessage"
            :chat="chat"
            :key="nbChat"
        />
        <div class="chessboard-main-container">
            <div
                :key="index"
                v-for="(n, index) in 64"
                :class="[map[index], 'piece']"
                @click="interactChessboard(index)"
                :style="`background-image: url('/assets/chess/${map[index]}.png');`"
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
                <h4>Recherche de joueurs</h4>
                <div class="anim-waiting-container">
                    <div style="background-image: url('/assets/chess/bP.png');" class="piece bP"></div>
                    <div style="background-image: url('/assets/chess/bN.png');" class="piece bN"></div>
                    <div style="background-image: url('/assets/chess/bB.png');" class="piece bB"></div>
                    <div style="background-image: url('/assets/chess/bR.png');" class="piece bR"></div>
                    <div style="background-image: url('/assets/chess/bQ.png');" class="piece bQ"></div>
                    <div style="background-image: url('/assets/chess/bK.png');" class="piece bK"></div>
                </div>
                <button
                    class="cancel-button"
                    @click="cancelSearching"
                >Annuler la recherche</button>
            </div>
        </div>

        <div 
            class="modal modal-promotion"
            v-if="modalPromotion"
        >
            <div class="promotion-content">
                <div 
                    :style="`background-image: url('/assets/chess/${promotionColor}R.png')`" 
                    class="promotion-piece"
                    @click="sendPromotion('R')"
                ></div>
                <div 
                    :style="`background-image: url('/assets/chess/${promotionColor}N.png')`" 
                    class="promotion-piece"
                    @click="sendPromotion('N')"
                ></div>
                <div 
                    :style="`background-image: url('/assets/chess/${promotionColor}B.png')`" 
                    class="promotion-piece"
                    @click="sendPromotion('B')"
                ></div>
                <div 
                    :style="`background-image: url('/assets/chess/${promotionColor}Q.png')`" 
                    class="promotion-piece"
                    @click="sendPromotion('Q')"
                ></div>
            </div>
        </div>
    </div>
</template>

<style>
    .app-main-container {
        position: absolute;
        top: 50%;
        left: 50%;
        display: flex;
        transform: translate(-50%, -50%);
    }

    .chessboard-main-container {
        border-color: white;
        background-color: #f1f1f1;
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
        padding: 45px;
        border-radius: 20px;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        gap: 55px;
        align-items: center;
        justify-content: center;
    }

    .modal-content h4 {
        color: #333;
        position: relative;
    }

    .modal-content h4::after {
        position: absolute;
        content: '';
        display: block;
        width: 0px;
        left: 100%;
        transform: translate(0%);
        height: 2px;
        background-color: black;
        animation: underliningApparition 4s ease infinite alternate;
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

    .anim-waiting-container {
        display: flex;
    }

    .anim-waiting-container div {
        height: 70px;
        width: 70px;
    }

    .anim-waiting-container :first-child {
        animation: pawnApparition 5s linear 0s infinite forwards;
    }

    .anim-waiting-container :nth-child(2) {
        animation: knightApparition 5s linear 0s infinite forwards;
    }

    .anim-waiting-container :nth-child(3) {
        animation: bishopApparition 5s linear 0s infinite forwards;
    }

    .anim-waiting-container :nth-child(4) {
        animation: rookApparition 5s linear 0s infinite forwards;
    }

    .anim-waiting-container :nth-child(5) {
        animation: queenApparition 5s linear 0s infinite forwards;
    }

    .anim-waiting-container :last-child {
        animation: kingApparition 5s linear 0s infinite forwards;
    }

    .cancel-button {
        background-color: #FFFFFF;
        border: 1px solid #222222;
        border-radius: 8px;
        box-sizing: border-box;
        color: #222222;
        cursor: pointer;
        display: inline-block;
        font-size: 16px;
        font-weight: 500;
        line-height: 20px;
        margin: 0;
        padding: 13px 23px;
        position: relative;
        text-align: center;
        text-decoration: none;
        width: auto;
        transition: background-color .8s ease;
    }

    .cancel-button:hover {
        background-color: whitesmoke;
    }

    @keyframes underliningApparition {
        from {
            left: 0;
            width: 0%;
        }

        22% {
            width: 50%;
        }
    }

    @keyframes pawnApparition {
        0% {
            transform: translateY(-15px);
            opacity: 0;
        }
        
        14.28% {
            transform: translateY(0);
            opacity: 1;
        }

        50% {
            transform: translateY(0);
            opacity: 1;
        }

        64.28% {
            transform: translateY(-15px);
            opacity: 0;
        }

        100% {
            transform: translateY(-15px);
            opacity: 0;
        }
    }

    @keyframes knightApparition {
        0% {
            transform: translateY(-15px);
            opacity: 0;
        }
        
        7.14% {
            transform: translateY(-15px);
            opacity: 0;
        }

        21.42% {
            transform: translateY(0);
            opacity: 1;
        }

        57.14% {
            transform: translateY(0);
            opacity: 1;
        }

        71.42% {
            transform: translateY(-15px);
            opacity: 0;
        }

        100% {
            transform: translateY(-15px);
            opacity: 0;
        }
    }

    @keyframes bishopApparition {
        0% {
            transform: translateY(-15px);
            opacity: 0;
        }
        
        14.28% {
            transform: translateY(-15px);
            opacity: 0;
        }

        28.56% {
            transform: translateY(0);
            opacity: 1;
        }

        64.28% {
            transform: translateY(0);
            opacity: 1;
        }

        78.56% {
            transform: translateY(-15px);
            opacity: 0;
        }

        100% {
            transform: translateY(-15px);
            opacity: 0;
        }
    }

    @keyframes rookApparition {
        0% {
            transform: translateY(-15px);
            opacity: 0;
        }
        
        21.42% {
            transform: translateY(-15px);
            opacity: 0;
        }

        35.70% {
            transform: translateY(0);
            opacity: 1;
        }

        71.42% {
            transform: translateY(0);
            opacity: 1;
        }

        85.70% {
            transform: translateY(-15px);
            opacity: 0;
        }

        100% {
            transform: translateY(-15px);
            opacity: 0;
        }

    }

    @keyframes queenApparition {
        0% {
            transform: translateY(-15px);
            opacity: 0;
        }
        
        28.56% {
            transform: translateY(-15px);
            opacity: 0;
        }

        42.84% {
            transform: translateY(0);
            opacity: 1;
        }

        78.56% {
            transform: translateY(0);
            opacity: 1;
        }

        92.84% {
            transform: translateY(-15px);
            opacity: 0;
        }

        100% {
            transform: translateY(-15px);
            opacity: 0;
        }
    }

    @keyframes kingApparition {
        0% {
            transform: translateY(-15px);
            opacity: 0;
        }
        
        35.70% {
            transform: translateY(-15px);
            opacity: 0;
        }

        50% {
            transform: translateY(0);
            opacity: 1;
        }

        85.70% {
            transform: translateY(0);
            opacity: 1;
        }

        100% {
            transform: translateY(-15px);
            opacity: 0;
        }
    }
</style>

<script>
import { io } from 'socket.io-client'
import { ref } from'vue'
import { useAuthStore } from '../store/User'
import router from '../router/index'
import Chat from '../components/Game/Chat.vue'

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
        modalPromotion = ref(false), promotionColor = ref(''), pgn = ref([]), chat = ref([]), authStore = useAuthStore(),
        nbChat = ref(0)
        return { nbChat, socket, map, modalInit, possibleMove, modalPromotion, promotionColor, pgn, authStore, chat }
    }, 

    created() {
        if(this.$route.fullPath.startsWith("/watch")) 
            this.socket.emit("responseUser", { user: this.authStore.username, token: this.authStore.jwtToken, game: this.$route.params.idGame})
        else if(this.$route.params.idGame) {
            this.socket.emit("answerSearching", this.$route.params.idGame)
            this.socket.on("gameNotFound", () => router.push("/gameNotFound"))
            this.socket.on("gameFound", () => this.socket.emit("responseUser", { user: this.authStore.username, token: this.authStore.jwtToken, game: this.$route.params.idGame}))
        } else this.socket.emit("responseUser", { user: this.authStore.username, token: this.authStore.jwtToken })

        this.socket.on("init", () => this.modalInit = true)
        this.socket.on('play', () => this.modalInit = false)
        this.socket.on("moveTo", (chessboard, pgn) => this.displayMove(chessboard, pgn))
        this.socket.on("showMoveTab", possibleMove => this.displayPossibleMove(possibleMove))
        this.socket.on("promotion", promotion => this.displayPromotion(promotion))
        this.socket.on("cancel", () => this.possibleMove = [-1])
        this.socket.on("NewChat", mess => this.handleNewMessage(mess))
        this.socket.on("beginningGameInfo", (elo, ennemiesElo, ennemy, color) => console.log(elo, ennemiesElo, ennemy, color))
    }, 

    components: {
        Chat
    },

    beforeUnmount() {
        this.socket.close()
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

        handleNewMessage(mess) {
            this.chat = mess
            this.nbChat++;
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

        cancelSearching() {
            this.socket.close()
            router.go(-1)
        },

        sendPromotion(piece) {
            this.socket.emit("promotionChoice", piece)
            this.modalPromotion = false 
            this.promotionColor = ''
        }, 

        sendMessage(message) {
            this.socket.emit("message", message)
        }
    }
}    
</script>