import { env, pipeline, type FeatureExtractionPipeline } from "@xenova/transformers";
import fs from "fs";
import path from "path";

// Vercel serverless functions have a read-only filesystem except /tmp,
// but @xenova/transformers defaults to caching models inside node_modules.
env.cacheDir = "/tmp/transformers-cache";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Chunk {
  text: string;
  embedding: number[];
}

// ─── In-memory vector store ───────────────────────────────────────────────────
// Loaded once at cold start, reused across requests in the same instance.

let chunks: Chunk[] = [];
let initialized = false;

// ─── Chunking ─────────────────────────────────────────────────────────────────

function splitIntoChunks(text: string, maxTokens = 400, overlapLines = 3): string[] {
  // Split by double newline (paragraphs/sections)
  const paragraphs = text.split(/\n{2,}/);
  const result: string[] = [];
  let current: string[] = [];
  let currentLength = 0;

  for (const para of paragraphs) {
    const words = para.split(/\s+/).length;

    if (currentLength + words > maxTokens && current.length > 0) {
      result.push(current.join("\n\n"));
      // overlap: keep last N lines of previous chunk
      const overlap = current.slice(-overlapLines);
      current = overlap;
      currentLength = overlap.join(" ").split(/\s+/).length;
    }

    current.push(para);
    currentLength += words;
  }

  if (current.length > 0) result.push(current.join("\n\n"));

  return result.filter((c) => c.trim().length > 20);
}

// ─── Embedding ────────────────────────────────────────────────────────────────
// Runs locally (no API calls, no cost) via a small ONNX model.

let extractor: FeatureExtractionPipeline | null = null;

async function getExtractor(): Promise<FeatureExtractionPipeline> {
  if (!extractor) {
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return extractor;
}

async function embed(texts: string[]): Promise<number[][]> {
  const model = await getExtractor();
  const embeddings: number[][] = [];

  for (const text of texts) {
    const output = await model(text, { pooling: "mean", normalize: true });
    embeddings.push(Array.from(output.data as Float32Array));
  }

  return embeddings;
}

// ─── Cosine similarity ────────────────────────────────────────────────────────

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ─── Init (load + embed knowledge base) ──────────────────────────────────────

export async function initRAG() {
  if (initialized) return;

  const knowledgePath = path.join(process.cwd(), "src/data/knowledge/leo.md");
  const raw = fs.readFileSync(knowledgePath, "utf-8");

  const rawChunks = splitIntoChunks(raw);
  const embeddings = await embed(rawChunks);

  chunks = rawChunks.map((text, i) => ({ text, embedding: embeddings[i] }));
  initialized = true;
}

// ─── Retrieve top-k relevant chunks ──────────────────────────────────────────

export async function retrieveContext(query: string, topK = 4): Promise<string> {
  await initRAG();

  const [queryEmbedding] = await embed([query]);

  const scored = chunks
    .map((chunk) => ({
      text: chunk.text,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored.map((s) => s.text).join("\n\n---\n\n");
}
