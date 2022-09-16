<template>
    <GameInfoBar 
        @giveUp="sendGiveUp"
    />
</template>

<script>
import GameInfoBar from './GameInfoBar.vue'; 
export default {
    components: {
        GameInfoBar
    }, 

    methods: {
        sendGiveUp() {
            this.$emit("giveup");
        }
    }
}
</script>

<style>

</style>