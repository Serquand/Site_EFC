<template>
    <div class="review-main-container">
        <div class="player-container">
            <p>
                <span>{{ secondPlayer }}</span>
                <span>{{ '(' + secondElo + ')' }}</span>
            </p>
        </div>

        <div 
            class="chessboard-review"
            v-if="board"
        >
            <Chessboard 
                :game="board"
                :key="numberTurn"
            /> 
        </div>
        
        <div class="player-container">
            <p>
                <span>{{ firstPlayer }}</span>
                <span>{{ '(' + firstElo + ')' }}</span>
            </p>
        </div>

        <div class="nav-button">
            <button @click="advanceInTheGame">Avancer</button>
            <button @click="goBackInTheGame">Reculer</button>
            <button @click="goBeginningOfGame">Début</button>
            <button @click="goEndOfGame">Fin</button>
        </div>
    </div>
</template>

<script>
import Chessboard from '../components/Game/Chessboard.vue'
import { url } from '../../config.json'
import { ref } from 'vue'
import { Chess } from 'chess.js'

export default {
    setup() {
        const pgn = [], firstPlayer = ref(""), secondPlayer = ref(""), firstElo = ref(0), secondElo = ref(0), 
        game = new Chess(), numberTurn = ref(-1), board = ref('')

        return { pgn, firstPlayer, secondPlayer, firstElo, secondElo, game, numberTurn, board }
    }, 

    async created() {
        const res = (await (await fetch(url + "/review/" + this.$route.params.idGame)).json()).reviewGame
        console.log(res)
        this.pgn = res.pgn
        this.convertBoardToArray(this.game.board())
        this.firstElo = res.eloPlayer1
        this.secondElo = res.eloPlayer2
        this.firstPlayer = res.player1
        this.secondPlayer = res.player2
    }, 

    components: {
        Chessboard
    }, 

    methods: {
        goEndOfGame() {
            this.numberTurn = this.pgn.length - 1
            this.game = new Chess()
            for(let i = 0; i <= this.numberTurn; i++) this.game.move(this.pgn[i])
            this.convertBoardToArray(this.game.board())
        },

        goBeginningOfGame() {
            this.numberTurn = -1
            this.game = new Chess()
            this.convertBoardToArray(this.game.board())
        },
 
        advanceInTheGame() {
            this.numberTurn++;
            this.game.move(this.pgn[this.numberTurn])
            this.convertBoardToArray(this.game.board())
        },

        convertBoardToArray(board) {
            this.board = new Array(0)
            for(let i = 0; i < 8; i++) {
                for(let j = 0; j < 8; j++) this.board.push(board[i][j])
            }
        }, 

        goBackInTheGame() {
            this.numberTurn--;
            this.game = new Chess()
            for(let i = 0; i <= this.numberTurn; i++) this.game.move(this.pgn[i])
            this.convertBoardToArray(this.game.board())
        }
    }
}
</script>

<style>
    .review-main-container {
        width: fit-content;
    }

    .review-main-container .player-container:last-child {
        text-align: end;
    }

</style>