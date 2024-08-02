import {visit} from 'unist-util-visit';

const mdWorker = new Worker('worker-ux-stream.js', { type: 'module' });
const canvas = document.getElementById("canvas");

const file = new URLSearchParams(window.location.search).get("file") || "lorem.md";

let tree;
fetch(file).then(res => res.text()).then(md => {
  setTimeout(() => {
    const startTime = performance.now();
    console.log(1)
    mdWorker.postMessage(md);
    mdWorker.onmessage = (e) => {

      const { value, done } = e.data;
      if (done) {
        const endTime = performance.now();
        performance.measure('markdown', {
          start: startTime,
          end: endTime,
        });
  
        // window.tachometerResult = endTime - startTime;
        streamUx(tree);
        return;
      }

      // canvas.innerHTML = value;
      tree = value;
    };
  }, 1000);
});

const charCount = 5;

const streamText = (params) => {
  const { elem, parent, text, queue, index = 0 } = params;

  console.log('params', params);

  if (elem && parent) {
    console.log("add elemtn");
    parent.appendChild(elem);
    const nextItem = queue.shift();
    if (!nextItem) {
      console.log("done!");
      return;
    }

    return streamText(nextItem);
  }

  if (parent === canvas && !elem) {
    const textNode = document.createTextNode(text);
    parent.appendChild(textNode);

    const nextItem = queue.shift();
    if (!nextItem) {
      console.log("done!");
      return;
    }

    return streamText(nextItem);
  }

  if (index >= text.length) {
    console.log("done with current text");
    const nextItem = queue.shift();
    if (!nextItem) {
      console.log("done!");
      return;
    }
    return streamText(nextItem);
  }

  console.log("stream text");
  let endIndex = index + charCount;
  if (endIndex > text.length) {
    endIndex = text.length;
  }
  
  parent.textContent += text.substring(index, endIndex);
  
  requestAnimationFrame(() => {
    console.log("raf")
    streamText({ elem, parent, text, queue, index: endIndex });
  });
};

const streamUx = (hastTree) => {

  /**
   * type QueueItem = {
   *  elem: HTMLElement,
   *  parent: HTMLElement,
   *  text?: string,
   *  index: number,
   *  queue: QueueItem[]
   * }
   */

  const queue = [];

  const parents = [];
  let prevParent;

  visit(hastTree, undefined, (node, index, parent) => {
    if (!parents.length) {
      parents.push(canvas);
    }

    if (node.type === 'root') {
      return;
    }

    const item = {
      elem: node.type === 'element' ? document.createElement(node.tagName) : undefined,
      parent: parents.at(-1),
      text: node.type === 'text' ? node.value: undefined,
      queue,
    };

    if (item.elem) {
      prevParent = parent;
      parents.push(item.elem);
    } else if (prevParent !== parent) {
      parents.pop();
    }
    queue.push(item);
    // console.log(node, index, parent);
  });

  console.log("----");
  console.log(queue);

  streamText(queue.shift());
}
