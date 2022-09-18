<template>
    <div class="game-profil-container">
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
            <div class="result">
                <p>{{ game.result }}</p>
            </div>
        </div>
    </div>
</template>

<script>
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
    }
}
</script>

<style>
    .color-container {
        width: 40px;
        height: 40px;
        background-position: center;
        background-size: contain;
    }

</style>