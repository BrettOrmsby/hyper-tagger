export async function convertStreamToString(stream: ReadableStream<Uint8Array>): Promise<string> {
  const decoder = new TextDecoder();
  const chunks: Uint8Array[] = [];

  // Create a reader to read the stream
  const reader = stream.getReader();

  try {
    // eslint-disable-next-line
    while (true) {
      // Read the data from the stream
      const { done, value } = await reader.read();

      // If there is no more data, break the loop
      if (done) break;

      // Store the data in an array
      if (value) chunks.push(value);
    }

    // Concatenate all the chunks and decode them into a string
    const concatenatedChunks = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
    let offset = 0;
    for (const chunk of chunks) {
      concatenatedChunks.set(chunk, offset);
      offset += chunk.length;
    }

    return decoder.decode(concatenatedChunks);
  } finally {
    // Release the reader's resources
    reader.releaseLock();
  }
}
