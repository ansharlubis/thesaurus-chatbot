interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface OllamaRequest {
    model: string;
    messages: ChatMessage[];
    stream: boolean;
}

class ChatBot {
    private messages: ChatMessage[] = [];
    private ollamaUrl: string = 'http://localhost:11434/api/chat';
    private currentModel: string = 'smollm:360m';

    constructor() {
        this.initializeEventListeners();
        this.initializeMessages();
    }

    private initializeMessages(): void {
        const initialPrompt: ChatMessage = {
            role: 'system',
            content: 'You are a helpful thesaurus assistant. Answer questions by providing a succinct defintion and two easy sentence examples.',
        }
        this.messages.push(initialPrompt)
    }

    private initializeEventListeners(): void {
        const sendButton = document.getElementById('send-button') as HTMLButtonElement;
        const userInput = document.getElementById('user-input') as HTMLInputElement;
        const updateModelButton = document.getElementById('update-model-button') as HTMLButtonElement;

        sendButton?.addEventListener('click', () => this.handleSendMessage());
        userInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSendMessage();
            }
        });
        updateModelButton?.addEventListener('click', () => this.updateModel());
    }

    private updateModel(): void {
        const modelInput = document.getElementById('model-input') as HTMLInputElement;
        if (modelInput && modelInput.value.trim()) {
            this.currentModel = modelInput.value.trim();
            console.log(`Model updated to: ${this.currentModel}`);
        }
    }

    private async handleSendMessage(): Promise<void> {
        const userInput = document.getElementById('user-input') as HTMLInputElement;
        const message = userInput.value.trim();

        if (!message) return;

        const userMessage: ChatMessage = {
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
            
            const botMessage: ChatMessage = {
                role: 'assistant',
                content: response,
            };

            this.messages.push(botMessage);
            this.displayMessage(botMessage);
        } catch (error) {
            this.hideTypingIndicator();
            console.error('Error communicating with Ollama:', error);
            
            const errorMessage: ChatMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error while processing your request. Please make sure Ollama is running on localhost:11434.',
            };
            
            this.displayMessage(errorMessage);
        }
    }

    private async sendToOllama(): Promise<string> {
        const requestBody: OllamaRequest = {
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

    private displayMessage(message: ChatMessage): void {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.role === 'user' ? 'user-message' : 'bot-message'}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = message.content;

        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';

        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);
        chatMessages.appendChild(messageDiv);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    private showTypingIndicator(): void {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

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

    private hideTypingIndicator(): void {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
});