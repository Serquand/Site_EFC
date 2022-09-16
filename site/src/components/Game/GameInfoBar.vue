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
        <div class="viewer-count-container">
            <p>{{ numberOfViewers }}</p>
            <img src="/assets/GamePanel/oeil.png" alt="numberViewers" />
        </div>
    </section>
</template>

<script>
export default {
    props: {
        numberOfViewers: {
            type: String, 
            required: true
        }
    },

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