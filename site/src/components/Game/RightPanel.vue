<template>
    <div class="right-panel-container">
        <GameInfoBar 
            :numberOfViewers="numberOfViewers"
            @giveUp="sendGiveUp"
            @drawProposal="sendDrawProposal"
        />
        <BetMove @allMovesBet="displayMovesBet" />
        <ModalBet />
    </div>
</template>

<script>
import GameInfoBar from './GameInfoBar.vue';
import BetMove from './BetMove.vue'; 
import ModalBet from './ModalBet.vue';
import { ref } from 'vue';

export default {
    setup() {
        const displayModalMovesBet = ref(false)
        return { displayModalMovesBet }
    },

    components: {
        GameInfoBar,
        BetMove, 
        ModalBet
    }, 

    props: {
        numberOfViewers: {
            type: String, 
            required: true
        }
    },

    methods: {
        displayMovesBet() {
            this.displayModalMovesBet = true
        },

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