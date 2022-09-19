<template>
    <div class="chessboard-container">
        <div class="chessboard">
            <div
                :key="index"
                v-for="(n, index) in 64"
                :class="[map[index], 'piece']"
                :style="`background-image: url('/assets/chess/${map[index]}.png');`"
            >
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'

export default {
    setup(props) {
        const map = ref([]), info = JSON.parse(JSON.stringify(props.game))
        return { map, info }
    }, 

    created() {
        this.map = this.createdMap(this.info)
    },

    props: {
        game: {
            type: Array, 
            required: true
        } 
    }, 

    methods: {
        createdMap(matrix) {
            const goodArray = new Array(0)
            for(let i = 0; i < 64; i++) goodArray.push(matrix[i] == null ? '' : matrix[i].color + matrix[i].type.toUpperCase())
            return goodArray
        }
    }
}
</script>

<style>
.chessboard {
    border: 1px solid black;
    display: grid;
    grid-template: repeat(8, 70px) / repeat(8, 70px);
}

.chessboard div {
    width: 70px;
    height: 70px;
}

</style>