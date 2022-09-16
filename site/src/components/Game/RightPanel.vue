<template>
    <GameInfoBar 
        :numberOfViewers="numberOfViewers"
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

    props: {
        numberOfViewers: {
            type: String, 
            required: true
        }
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