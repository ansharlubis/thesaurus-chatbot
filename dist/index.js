"use strict";
class ChatBot {
    constructor() {
        this.messages = [];
        this.ollamaUrl = 'http://localhost:11434/api/chat';
        this.currentModel = 'smollm:360m';
        this.initializeEventListeners();
        this.initializeMessages();
    }
    initializeMessages() {
        const initialPrompt = {
            role: 'system',
            content: 'You are a helpful thesaurus assistant. Answer questions by providing a succinct defintion and two easy sentence examples.',
        };
        this.messages.push(initialPrompt);
    }
    initializeEventListeners() {
        const sendButton = document.getElementById('send-button');
        const userInput = document.getElementById('user-input');
        const updateModelButton = document.getElementById('update-model-button');
        sendButton?.addEventListener('click', () => this.handleSendMessage());
        userInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSendMessage();
            }
        });
        updateModelButton?.addEventListener('click', () => this.updateModel());
    }
    updateModel() {
        const modelInput = document.getElementById('model-input');
        if (modelInput && modelInput.value.trim()) {
            this.currentModel = modelInput.value.trim();
            console.log(`Model updated to: ${this.currentModel}`);
        }
    }
    async handleSendMessage() {
        const userInput = document.getElementById('user-input');
        const message = userInput.value.trim();
        if (!message)
            return;
        const userMessage = {
            role: 'user',
            content: message,
        };
        this.messages.push(userMessage);
        this.displayMessage(userMessage);
        userInput.value = '';
        this.showTypingIndicator();
        try {
            const response = await this.sendToOllama();
            this.hideTypingIndicator();
            const botMessage = {
                role: 'assistant',
                content: response,
            };
            this.messages.push(botMessage);
            this.displayMessage(botMessage);
        }
        catch (error) {
            this.hideTypingIndicator();
            console.error('Error communicating with Ollama:', error);
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error while processing your request. Please make sure Ollama is running on localhost:11434.',
            };
            this.displayMessage(errorMessage);
        }
    }
    async sendToOllama() {
        const requestBody = {
            model: this.currentModel,
            messages: this.messages,
            stream: false
        };
        const response = await fetch(this.ollamaUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.message.content || 'No response from model.';
    }
    displayMessage(message) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages)
            return;
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.role === 'user' ? 'user-message' : 'bot-message'}`;
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = message.content;
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    showTypingIndicator() {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages)
            return;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
        typingDiv.appendChild(contentDiv);
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
});
//# sourceMappingURL=index.js.map