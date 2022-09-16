<template>
    <section>
        <div 
            @click="sendGiveUp"
            class="give-up-container"
        >
            <img src="/assets/GamePanel/giveup.png" alt="giveUp" />
        </div>
        <div 
            @click="sendDrawProposal"
            class="draw-proposal"
        >
            <img src="/assets/GamePanel/handshake.png" alt="drawProposal">
        </div>
        <div class="viewer-count-container"></div>
    </section>
</template>

<script>
export default {
    methods: {
        sendGiveUp() {
            this.$emit("giveUp")
        }, 

        sendDrawProposal() {
            this.$emit("drawProposal")
        }
    }
}
</script>

<style>

</style>