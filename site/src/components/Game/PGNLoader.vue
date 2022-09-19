<template>
    <h1>TEST</h1>
</template>

<script>
import { ref } from 'vue'

export default {
    setup(props) {
        const pgnOfGame = ref(JSON.parse(JSON.stringify(props.pgn)))
        return { pgnOfGame }
    },

    created() {
        this.convertPgn()
    },

    props: {
        pgn: {
            type: Array, 
            required: true
        }
    },

    methods: {
        convertPgn() {
            const temp = this.pgnOfGame
            const lengthNew = Math.ceil(this.pgnOfGame.length / 2)
            this.pgnOfGame = new Array(0)
            for(let i = 0; i < lengthNew; i++) {
                const newLink = [temp[2 * i], temp[2 * i + 1]]
                if(!newLink[1]) newLink.pop()
                this.pgnOfGame.push(newLink)
            }
        }
    }
}
</script>

<style>

</style>