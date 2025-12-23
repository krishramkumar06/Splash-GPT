# Quick Start Guide

Get your Yale Splash RAG Chatbot up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))
- Pinecone account ([sign up here](https://www.pinecone.io/))

## Step 1: Install Dependencies

Dependencies are already installed! If you need to reinstall:

```bash
npm install
```

## Step 2: Set Up Pinecone

1. Go to [Pinecone Console](https://app.pinecone.io/)
2. Create a new index:
   - Name: `yale-splash`
   - Dimensions: `1536`
   - Metric: `cosine`
   - Cloud: AWS (us-east-1 recommended)
3. Copy your API key

## Step 3: Configure Environment Variables

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your keys:

```env
OPENAI_API_KEY=sk-...your-openai-key...
PINECONE_API_KEY=...your-pinecone-key...
PINECONE_INDEX=yale-splash
INGEST_SECRET=make-up-a-secret-password
```

## Step 4: Prepare Your Documents

The `documents/` folder already contains sample documents:
- `hitchhikers-guide.md`
- `website-docs.md`
- `emails-2025.md`

**Replace these with your actual Splash documentation!**

## Step 5: Ingest Documents

Run the ingestion script to populate Pinecone:

```bash
npm run ingest
```

This will:
- Analyze documents with GPT (cached for faster re-runs)
- Create semantic chunks
- Generate embeddings
- Upload to Pinecone

**Expected time**: 5-10 minutes on first run, <1 minute on subsequent runs (cached).

**Tip**: Chunks are cached in `.chunk-cache/`. Delete this folder to force re-analysis if you modify documents.

## Step 6: Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## You're Done! 🎉

Try asking questions like:
- "How do teachers register on the website?"
- "What should I tell parents about lunch?"
- "Where do students check in on Splash day?"

## Next Steps

### Customize Your Documents

Replace the sample markdown files in `documents/` with your actual:
1. Hitchhiker's guide to running Splash
2. Website documentation
3. Email history

Then re-run `npm run ingest`.

### Deploy to Vercel

1. Push your code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy!
5. Run ingestion via API or locally

### Explore Features

**Chat Interface** (`/`):
- Ask questions
- View source citations
- See streaming responses

**Email Templates** (`/email-templates`):
- Generate pre-formatted emails
- Copy to clipboard
- Customize for your event

## Troubleshooting

### "Can't find module" errors
```bash
npm install
```

### Ingestion fails
- Check your OpenAI API key and quota
- Verify Pinecone index exists and is correct name
- Make sure documents exist in `documents/` folder

### Chat returns no results
- Verify ingestion completed successfully
- Check Pinecone dashboard to confirm vectors were uploaded
- Try re-running ingestion

### Need help?
Check the main [README.md](./README.md) for detailed documentation.

---

Happy chatting! 💬
