
import type { CodeChunk } from "@/features/reviews/types/review";
import { getPineconeIndex } from "@/features/pinecone/client";

const CONTEXT_RESULTS = 10;

export function buildPrNamespace(
  repoFullName: string,
  prNumber: number
) {
  return `${repoFullName.replace("/", "--")}--pr-${prNumber}`;
}

export async function saveChunksToPinecone(
  namespace: string,
  chunks: CodeChunk[]
) {
  if (chunks.length === 0) return;

  const index = getPineconeIndex();

  await index.namespace(namespace).documents.upsert({
    documents: chunks.map((chunk) => ({
      _id: chunk.id,
      chunk_text: chunk.text,
      filePath: chunk.filePath,
    })),
  });
}

export async function searchPrContext(
  namespace: string,
  query: string
) {
  const index = getPineconeIndex();

  const response = await index.namespace(namespace).documents.search({
    scoreBy: [
      {
        type: "text",
        fields: ["chunk_text"],
        query,
      },
    ],
    topK: CONTEXT_RESULTS,
    includeFields: ["chunk_text", "filePath"],
  });

  const snippets: string[] = [];

  for (const hit of response.matches ?? []) {
    const fields = hit as {
      chunk_text?: string;
      filePath?: string;
    };

    if (!fields.chunk_text) continue;

    snippets.push(
      `File: ${fields.filePath ?? "Unknown"}\n${fields.chunk_text}`
    );
  }

  return snippets;
}
