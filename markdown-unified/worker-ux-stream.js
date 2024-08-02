import rehypeSanitize from 'rehype-sanitize'
// import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'
import {VFile} from 'vfile';


const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeSanitize);
  // .use(rehypeStringify);

async function stream(text) {
  console.log("????????");
  let md = '';
  // const textDecoder = new TextDecoder();
  // const decodeOptions = { stream: true };
  let interval = 0;
  // Simulate streaming data from a WebSocket or similar
  const vfile = new VFile();
  const mdStream = new ReadableStream({
    start(controller) {
      let pos = 0;
      function push() {
        const chunk = text.slice(pos, pos + 1000);
        pos += 1000;
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
      const mdast = processor.parse(md);
      const val = processor.runSync(mdast, vfile);
      postMessage({ value: val, done: true });
      return;
    }

    // For an actual stream we would likely need to decode/transform
    // from a Uint8Array to a string but this isn't necessary for this 
    // example because we fake the stream.
    // md += textDecoder.decode(value, decodeOptions);
    md += value;
    // const val = processor.processSync(md);
    const mdast = processor.parse(md);
    const val = processor.runSync(mdast, vfile);
    // console.log("v??", val);
    postMessage({ value: val, done: false });

    const streamEnd = performance.now();
    performance.measure('stream', {
      start: streamStart, 
      end: streamEnd,
    });

    return reader.read().then(processMd);
  });
}

onmessage = (e) => {
  console.log("onmessage?")
  stream(e.data).then(() => {
    console.log('done in worker');
  });
  // const result = processor.processSync(e.data).toString();
  // postMessage(result);
};