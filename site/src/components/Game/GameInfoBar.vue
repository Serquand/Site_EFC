<template>
    <section>
        <div 
            @click="sendGiveUp"
            class="give-up-container"
        >
            <img src="/assets/GamePanel/giveup.png" alt="giveUp" />
        </div>
        <div class="draw-proposal"></div>
        <div class="viewer-count-container"></div>
    </section>
</template>

<script>
export default {
    methods: {
        sendGiveUp() {
            this.$emit("giveUp")
        }
    }
}
</script>

<style>

</style>