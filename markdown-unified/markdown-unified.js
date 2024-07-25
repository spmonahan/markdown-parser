import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'

const mdWorker = new Worker('worker.js', { type: 'module' });
const canvas = document.getElementById("canvas");

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeSanitize)
  .use(rehypeStringify);

const file = new URLSearchParams(window.location.search).get("file") || "lorem.md";

fetch(file).then(res => res.text()).then(md => {
  setTimeout(() => {
    const startTime = performance.now();
    
    canvas.innerHTML = processor.processSync(md).toString();
    
    const endTime = performance.now();
    performance.measure('markdown', {
      start: startTime, 
      end: endTime,
    });

    window.tachometerResult = endTime - startTime;
  }, 1000);
});
