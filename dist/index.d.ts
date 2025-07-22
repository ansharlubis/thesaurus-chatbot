declare const marked: any;
interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
interface OllamaRequest {
    model: string;
    messages: ChatMessage[];
    stream: boolean;
}
declare class ChatBot {
    private messages;
    private ollamaUrl;
    private currentModel;
    constructor();
    private initializeMessages;
    private initializeEventListeners;
    private updateModel;
    private handleSendMessage;
    private sendToOllama;
    private displayMessage;
    private formatMessageContent;
    private showTypingIndicator;
    private hideTypingIndicator;
}
//# sourceMappingURL=index.d.ts.map