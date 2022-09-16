<template>
    <GameInfoBar 
        @giveUp="sendGiveUp"
        @drawProposal="sendDrawProposal"
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
        }, 

        sendDrawProposal() {
            this.$emit("drawProposal");
        }
    }
}
</script>

<style>

</style>