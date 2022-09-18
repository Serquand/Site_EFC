<template>
    <div class="game-profil-container">
        <div class="player-container">
            <p>{{ game.player1 }}</p>
            <p>{{ '(' + game.eloPlayer1 + ')' }}</p>
            <p>{{ game.player2 }}</p>
            <p>{{ '(' + game.eloPlayer2 + ')' }}</p>
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

</style>