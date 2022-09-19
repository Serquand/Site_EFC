<template>
    <div class="pgn-container">
        <div
            class="pgn-exchange-move"
            v-for="(exchange, n) in pgnOfGame"
            :key="n"
        >
            <div>{{ (n + 1) + "." }}</div>
            <div 
                @click="goBackToPGN(n, 0)"
                :class="['move-pgn-available', (2 * n == wherePgn) ? 'actual-position' : '']"
            >
                {{ exchange[0] }}
            </div>
            <div 
                @click="goBackToPGN(n, 1)"
                :class="[exchange[1] ? 'move-pgn-available' : '', , (2 * n + 1 == wherePgn) ? 'actual-position' : '']"
            >
                {{ exchange[1] ?? "" }}
            </div>
        </div>
    </div>
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
        }, 

        wherePgn: {
            type: Number, 
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
        }, 

        goBackToPGN(index, player) {
            this.$emit("reviewPgn", index * 2 + player)
        }
    }
}
</script>

<style>
    .pgn-exchange-move {
        display: flex;
    }

    .pgn-exchange-move > * {
        border: 1px solid #f1f1f1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100px;
        height: 45px;
    }

    .move-pgn-available {
        cursor: pointer;
        transition: all .4s ease;
    }

    .move-pgn-available:hover, .actual-position {
        color: black;
        background-color: #f1f1f1;
    }

    .pgn-exchange-move :first-child {
        width: 45px;
    }

</style>