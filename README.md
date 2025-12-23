# Yale Splash RAG Chatbot

A Next.js 14 RAG (Retrieval-Augmented Generation) chatbot application for Yale Splash administrators and volunteers. This tool helps users quickly find information from documentation and guides while managing the Splash event.

## Features

- **💬 Chat Interface**: Ask questions and get answers from the knowledge base with source citations
- **✉️ Email Templates**: Generate pre-formatted emails for teachers, parents, and students
- **🔍 Semantic Search**: GPT-powered document chunking and vector search via Pinecone
- **⚡ Streaming Responses**: Real-time responses using GPT-4o-mini

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **Vector Store**: Pinecone (serverless)
- **AI**: OpenAI API (text-embedding-3-small + gpt-4o-mini)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key
- Pinecone account and API key

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables:

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `OPENAI_API_KEY` - Your OpenAI API key
- `PINECONE_API_KEY` - Your Pinecone API key
- `PINECONE_INDEX` - Pinecone index name (default: yale-splash)
- `INGEST_SECRET` - Secret key to protect the ingestion endpoint

### Pinecone Setup

1. Create a serverless index in Pinecone
2. Configuration:
   - Dimensions: 1536 (for text-embedding-3-small)
   - Metric: cosine
   - Cloud: AWS (us-east-1 recommended)

### Adding Documents

Place your markdown documents in the `documents/` folder:
- `hitchhikers-guide.md` - Main guide for running Splash
- `website-docs.md` - Website/platform documentation
- `emails-2025.md` - Email history and examples

### Running the Ingestion

Before using the chatbot, you need to ingest the documents into Pinecone:

```bash
npm run ingest
```

This will:
1. Load all documents from the `documents/` folder
2. Use GPT to semantically chunk the large documents (cached for faster re-runs)
3. Parse emails with metadata extraction
4. Generate embeddings for all chunks
5. Upload vectors to Pinecone

**Note**: This process uses OpenAI API and may take several minutes depending on document size.

**Caching**: The chunking analysis is cached in `.chunk-cache/`. If you re-run ingestion with the same documents, it will use the cached chunks and skip the GPT analysis, saving time and API costs. Delete this folder to force re-analysis.

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with sidebar
│   ├── page.tsx                # Chat page
│   ├── email-templates/
│   │   └── page.tsx            # Email template generator
│   └── api/
│       ├── chat/
│       │   └── route.ts        # Streaming chat endpoint
│       └── ingest/
│           └── route.ts        # Document ingestion endpoint
├── components/
│   ├── ChatInterface.tsx       # Main chat UI
│   ├── ChatMessage.tsx         # Message bubble component
│   ├── Sidebar.tsx             # Navigation sidebar
│   ├── EmailTemplateForm.tsx   # Email template form
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── pinecone.ts             # Pinecone client
│   ├── openai.ts               # OpenAI client
│   ├── embeddings.ts           # Embedding generation
│   ├── rag.ts                  # RAG pipeline
│   ├── chunking.ts             # Semantic chunking logic
│   ├── documents.ts            # Document loading
│   └── types.ts                # TypeScript types
├── scripts/
│   └── ingest.ts               # Ingestion script
└── documents/                  # Your markdown files go here
    ├── hitchhikers-guide.md
    ├── website-docs.md
    └── emails-2025.md
```

## How It Works

### Semantic Chunking

The app uses GPT-4o-mini to intelligently chunk documents:

1. **Analysis Phase**: GPT analyzes the document structure and creates a chunking plan
2. **Section Extraction**: Chunks are extracted based on semantic sections
3. **Metadata Tagging**: Each chunk is tagged with:
   - Source document
   - Section title
   - Relevant audience (teachers, parents, students, organizers)
   - Category (teaching, registration, day-of, etc.)
   - Date context (for emails)

### RAG Pipeline

When a user asks a question:

1. Query is embedded using text-embedding-3-small
2. Top 6 relevant chunks are retrieved from Pinecone
3. Context is formatted with metadata
4. GPT-4o-mini generates a streaming response

## API Endpoints

### POST /api/chat

Chat with the assistant.

**Request:**
```json
{
  "message": "How do teachers register?",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response:** Streaming text

### POST /api/ingest

Trigger document re-ingestion (protected by `INGEST_SECRET`).

**Headers:**
```
x-ingest-secret: your-secret-key
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "hitchhikersGuide": 45,
    "websiteDocs": 52,
    "emails": 23,
    "total": 120
  },
  "categoryBreakdown": {
    "teaching": 30,
    "registration": 25,
    ...
  }
}
```

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

**Important**: Run the ingestion script locally or via API after deployment to populate the vector database.

## Usage Tips

### Chat Interface

- Ask specific questions: "How do teachers register on the website?"
- Request information for specific audiences: "What should I tell parents about lunch?"
- Cross-reference: "Does the email match what the guide says about check-in?"

### Email Templates

- Select template type
- Fill in recipient details
- Customize with additional notes
- Copy to clipboard and send!

## Troubleshooting

### Ingestion fails
- Check OpenAI API key and quota
- Verify Pinecone index configuration
- Ensure documents exist in `documents/` folder

### Chat returns irrelevant results
- Re-run ingestion to refresh vectors
- Check if documents cover the topic
- Try rephrasing the question

### Streaming doesn't work
- Ensure Edge Runtime is enabled (check route.ts)
- Verify OpenAI API key is valid

## Development Notes

- The chunking logic uses GPT to analyze documents, which can be expensive. Consider caching chunking plans for large documents.
- Email parsing assumes a specific format. Adjust `chunkEmails()` in `lib/chunking.ts` for different formats.
- Pinecone free tier has limits. Monitor usage in the dashboard.

## License

MIT

## Support

For issues or questions, contact the Splash at Yale team.
