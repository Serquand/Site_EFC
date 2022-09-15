<template>
    <div 
        @click="watchThisGame"        
        class="little-main-container"
    >
        <div class="information-black">
            <h4>{{ information.secondPlayer }}</h4>
            <p>{{ information.eloSecondPlayer }}</p>
        </div>
        <div class="chessboard">
            <div
                :key="index"
                v-for="(n, index) in 64"
                :class="[map[index], 'piece']"
                :style="map[index] ? `background-image: url('/assets/chess/${map[index]}.png');` : ''"
            >
            </div>
        </div>
        <div class="information-white">
            <h4>{{ information.firstPlayer }}</h4>
            <p>{{ information.eloFirstPlayer }}</p>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import router from '../router'

export default {
    props: {
        information: {
            type: Object, 
            required: true
        }
    }, 

    setup(props) { 
        const map = ref([]), infoGame = JSON.parse(JSON.stringify(props.information))
        console.log(infoGame)
        return { map, infoGame }
    },  

    created() {
        this.map = this.transformInGood(this.infoGame.board)
    }, 

    methods: {
        watchThisGame() {
            router.push("/watch/" + this.infoGame.idGame)
        },  

        transformInGood(matrix) {
            const goodArray = new Array(0)
            for(let i = 0; i < 8; i++) {
                for(let j = 0; j < 8; j++) 
                    goodArray.push(matrix[i][j] == null ? '' : matrix[i][j].color + matrix[i][j].type.toUpperCase())
            }
            return goodArray
        }
    }
}
</script>

<style>
.chessboard {
    border: 1px solid black;
    display: grid;
    grid-template: repeat(8, 30px) / repeat(8, 30px);
}

.chessboard div {
    width: 30px;
    height: 30px;
    background-color: white;
}

.chessboard :not(:is(:nth-child(1), :nth-child(3), :nth-child(5), :nth-child(7), :nth-child(10), :nth-child(12), :nth-child(14), :nth-child(16), :nth-child(19), :nth-child(21), :nth-child(23), :nth-child(17), :nth-child(28), :nth-child(30), :nth-child(32), :nth-child(26), :nth-child(37), :nth-child(35), :nth-child(39), :nth-child(33), :nth-child(42), :nth-child(44), :nth-child(46), :nth-child(48), :nth-child(49), :nth-child(51), :nth-child(53), :nth-child(55), :nth-child(58), :nth-child(60), :nth-child(62), :nth-child(64))) {
    background-color: green;
    border: .5px solid black;
}

.piece {
    background-position: center;
    background-size: contain;
}

.information-white :is(h4, p) {
    text-align: end;
}

.little-main-container {
    cursor: pointer;
}

</style>