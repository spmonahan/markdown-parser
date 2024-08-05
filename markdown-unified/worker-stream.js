import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'


const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeSanitize)
  .use(rehypeStringify);

async function stream(text) {
  let md = '';
  // const textDecoder = new TextDecoder();
  // const decodeOptions = { stream: true };
  let interval = 0;
  // Simulate streaming data from a WebSocket or similar
  const mdStream = new ReadableStream({
    start(controller) {
      let pos = 0;
      function push() {
        const chunk = text.slice(pos, pos + 250);
        pos += 250;
        controller.enqueue(chunk);
        if (pos < text.length) {
          interval = setTimeout(push, 250);
        } else {
          controller.close();
        }
      }
      push();
    },
    cancel() {
      clearTimeout(interval);
    }
  });

  const startTime = performance.now();
  const reader = mdStream.getReader();
  reader.read().then(function processMd({ done, value }) {
    
    const streamStart = performance.now();

    if (done) {
      const endTime = performance.now();
      performance.measure('markdown', {
        start: startTime, 
        end: endTime,
      });
      console.log("Stream complete!");
      postMessage({ value: null, done: true });
      return;
    }

    // For an actual stream we would likely need to decode/transform
    // from a Uint8Array to a string but this isn't necessary for this 
    // example because we fake the stream.
    // md += textDecoder.decode(value, decodeOptions);
    md += value;

    const processStart = performance.now();
    const html = processor.processSync(md).toString();
    const processEnd = performance.now();

    performance.measure('unified-process', {
      start: processStart, 
      end: processEnd,
    });

    postMessage({ value: html, done: false });

    const streamEnd = performance.now();
    performance.measure('stream', {
      start: streamStart, 
      end: streamEnd,
    });

    return reader.read().then(processMd);
  });
}

onmessage = (e) => {
  stream(e.data).then(() => {
    console.log('done in worker');
  });
  // const result = processor.processSync(e.data).toString();
  // postMessage(result);
};