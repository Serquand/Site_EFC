<template>
    <div 
        @click="displayAllMovesBet"
        class="bet-move-container"
    >
        <p>{{ betElo }}</p>
        <img src="/assets/GamePanel/gold.png" alt="Bet Elo" />
    </div>
</template>

<script>
export default {
    props: {
        betElo: {
            type: String, 
            required: true
        }
    }, 

    methods: {
        displayAllMovesBet() {
            this.$emit("allMovesBet");
        }
    }
}
</script>

<style>

</style>