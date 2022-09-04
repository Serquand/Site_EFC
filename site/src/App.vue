<template>
    <div class="app-container">
        <HeaderBar  @toggle-side-bar="toggleSideBar" />
        <div v-if="toggle">
            <Sidebar />
        </div>
        <div  :class="['page-container', !toggle ? 'toggle-sidebar' : '']">
            <router-view />
        </div>
    </div>
</template>

<style>
    *, *::before, *::after {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        color: white;
        font-family: serif;
    }

    .page-container {
        margin-left: 14rem;
        background: #312e2b;
        min-height: calc(100vh - 70px);
    }

    .page-container.toggle-sidebar {
        margin-left: 0;
    }

    #app {
        min-width: 100vw;
        min-height: 100vh;
    }

    a {
        text-decoration: none;
    }
</style>

<script>
    import HeaderBar from './components/HeaderBar.vue'
    import Sidebar from './components/Sidebar.vue'
    import { ref } from 'vue'

    export default {
        name: 'App', 
        
        components: {
            Sidebar, 
            HeaderBar
        }, 

        methods: {
            toggleSideBar() {
                this.toggle = !this.toggle 
            }
        }, 

        setup() {
            const toggle = ref(false)
            return { toggle }
        }
    }
</script>