<template>
    <div class="chat-container">
        <ul>
            <li :key="message" v-for="message in messages">
                <p>
                    <img src="/assets/Profil.png" alt="Profil"/>
                    {{ message.user }}
                </p>
                <p>{{ message.message }}</p>
            </li>
        </ul>
        <div class="input-container">
            <textarea 
                class="new-message"
                placeholder="Message..."
                v-model="typedMessage" 
                @keyup="resizeTextarea"
            ></textarea>
            <button 
                class="send-message-button"
                @click="sendMessage"
            >
                <p>Envoyer le message</p>
            </button>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '../../store/User';

export default {
    setup(props) {
        const messages = ref(props.chat), typedMessage = ref("")
        return { messages, typedMessage }
    }, 

    props: {
        chat: {
            type: Array, 
            required: true
        }
    },

    methods: {
        sendMessage() {
            const auth = useAuthStore()
            this.$emit("message", { 
                message: this.typedMessage, 
                informationUser: { 
                    user: auth.username, 
                    token: auth.jwtToken 
                }
            })
            this.typedMessage = ''
            document.querySelector("textarea.new-message").style.height = 'auto'
        }, 

        resizeTextarea() {
            const textArea = document.querySelector("textarea.new-message")
            textArea.style.height = "auto"
            const scHeight = textArea.scrollHeight;
            textArea.style.height = scHeight + "px"
        }
    }
}
</script>

<style scoped>

ul {
    margin-top: 5px;
    margin-left: 5px;
    list-style-type: none;
}    

li p:first-child {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
    font-size: 15px;
    text-decoration: underline;
}

li:not(:first-child) {
    margin-bottom: 10px;
    margin-top: 10px;
}

.send-message-button {
    background-color: green;
    border: 0;
    outline: 0;
    padding: 8px;
    border-radius: 10px;
    font-size: 15px;
    cursor: pointer;
}

.chat-container {
    display: flex;
    flex-direction: column;
    height: 560px;
    width: 300px;
    margin-right: 10px;
    background: #222;
}

.input-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

ul {
    flex: 1 0 auto;
}

.new-message {
    width: 100%;
    outline: none;
    color: black !important;
    background-color: #fff;
    height: auto;
    padding: 10px;
    resize: none;
    max-height: 100px;
}
</style>