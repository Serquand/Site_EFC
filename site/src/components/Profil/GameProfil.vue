<template>
    <div 
        class="game-profil-container"
        @click="viewTheGame"
    >
        <div 
            class="color-container"
            :style="`background-image: url('/assets/chess/${game.color}P.png')`"
        ></div>

        <div class="date-container">
            <p>{{ game.date }}</p>
        </div>

        <div class="player-container">
            <p>
                <span>{{ game.color == 'w' ? game.player1 : game.player2 }}</span>
                <span>{{ '(' + (game.color == 'w' ? game.eloPlayer1 : game.eloPlayer2) + ')' }}</span>
            </p>
            
            <p>
                <span>{{ game.color == 'b' ? game.player1 : game.player2 }}</span>
                <span>{{ '(' + (game.color == 'b' ? game.eloPlayer1 : game.eloPlayer2) + ')' }}</span>
            </p>
        </div>

        <div class="number-move-container">
            <p>{{ game.numberMoves }}</p>
        </div>

        <div class="result-container">
            <div :class="['result', game.result + '-result']">
                <p>{{ game.result }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import router from "../../router/index"

export default {
    setup(props) {
        const thisGame = JSON.parse(JSON.stringify(props.game))
        return { thisGame }
    },  

    props: {
        game: {
            type: Object, 
            required: true
        }
    }, 

    methods: {
        viewTheGame() {
            router.push("/viewOld/" + this.thisGame.id)   
        }
    }
}
</script>

<style>
    .color-container {
        width: 30px;
        height: 30px;
        background-position: center;
        background-size: contain;
    }

    .game-profil-container {
        width: 40%;
        padding: 10px 30px;
        cursor: pointer;
        border-radius: 15px;
        border: 1px solid whitesmoke;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: auto;
    }

    .player-container {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .player-container p {
        cursor: pointer;
    }

    .player-container span:last-child {
        font-size: 12px;
        margin-left: 5px;
    }

    .result {
        width: 35px;
        height: 35px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .L-result {
        background-color: red;
    }

    .W-result {
        background-color: green;   
    }

    .D-result {
        background-color: blue;
    }

</style>