<template>
    <div class="profil-container">
        <div class="info-profil-container">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div class="games-container">
            <div 
                class="game-content"
                v-for="game in games"
                :key="game"
            >
                <GameProfil :game="game" />
            </div>
        </div>
    </div>
</template>

<script>
import { url } from '../../config.json' 
import { ref } from 'vue'
import GameProfil from '../components/Profil/GameProfil.vue'

export default {
    setup() {
        const games = ref([]), profil = ref({});
        return { games, profil };
    },

    async created() {
        const profil = await (await fetch(url + "/profil/profil/" + this.$route.params.searchedUser)).json();
        console.log(profil);
        this.games = profil.allGames
        this.profil = profil.profil

    },
    
    components: { 
        GameProfil 
    }
}
</script>

<style>
</style>