<template>
    <div class="chat-container">
        <ul>
            <li :key="message" v-for="message in messages">{{ message }}</li>
        </ul>
        <input type="text" v-model="typedMessage" />
        <button @click="sendMessage">Envoyer le message</button>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const messages = ref([]), typedMessage = ref("")
        return { messages, typedMessage }
    }, 

    methods: {
        sendMessage() {
            this.$emit("message", this.typedMessage)
        }
    }
}
</script>

<style>
input {
    color: black !important;
}
</style>