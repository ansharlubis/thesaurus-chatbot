# Thesaurus Chatbot

A TypeScript-based chat interface that connects to Ollama for AI conversations with markdown support. The chatbot is designed to function as a thesaurus assistant, providing definitions and examples while supporting rich text formatting.

## Prerequisites

- Install [ollama](https://ollama.com/)
- Set CORS settings following this [reference](https://objectgraph.com/blog/ollama-cors/).

## Usage

1. Run ollama and download model. The default model is `llama3.2:1b`. Get the model by:

```bash
ollama run llama3.2:1b
```

2. Build code

```bash
npm run build
```

3. Open `index.html`

## Warning

Most of the logics are implemented by Claude Code with minimal reviews by @ansharlubis.
