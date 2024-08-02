import {visit} from 'unist-util-visit';
import {visitParents} from 'unist-util-visit-parents'

const mdWorker = new Worker('worker-ux-stream.js', { type: 'module' });
const canvas = document.getElementById("canvas");

const params = new URLSearchParams(window.location.search);

const file = params.get("file") || "lorem.md";
const speed = parseInt(params.get("speed") || 5);

const streamQueue = [];
let isProcessingQueue = false;

fetch(file).then(res => res.text()).then(md => {
  setTimeout(() => {
    const startTime = performance.now();
    mdWorker.postMessage(md);
    mdWorker.onmessage = (e) => {

      const { value, done } = e.data;
      if (done) {
        const endTime = performance.now();
        performance.measure('markdown', {
          start: startTime,
          end: endTime,
        });
  
        console.log("done parsing");
        streamQueue.push({
          hastTree: value,
          done
        });

        if (!isProcessingQueue) {
          streamUx(streamQueue.shift());
        }
        return 
      }
      
      streamQueue.push({
        hastTree: value,
        done: false
      });
      if (!isProcessingQueue) {
        streamUx(streamQueue.shift())
      }
    };
  }, 1000);
});

let isStreaming = false;

const streamText = (params) => {
  const { elem, parent, text, queue, nextQueueIndex, index = 0 } = params;

  if (elem && parent) {
    parent.appendChild(elem);
    const nextItem = queue[nextQueueIndex];
    if (!nextItem) {
      isStreaming = false;
      return;
    }

    return streamText(nextItem);
  }

  if (text === "\n" && !elem) {
    const textNode = document.createTextNode(text);
    parent.appendChild(textNode);

    const nextItem = queue[nextQueueIndex];
    if (!nextItem) {
      isStreaming = false;
      return;
    }

    return streamText(nextItem);
  }

  if (index >= text.length) {
    const nextItem = queue[nextQueueIndex];
    if (!nextItem) {
      isStreaming = false;
      return;
    }
    return streamText(nextItem);
  }

  let endIndex = index + speed;
  if (endIndex > text.length) {
    endIndex = text.length;
  }

  let textNode = params.textNode;
  if (!textNode) {
    textNode = document.createTextNode("");
    parent.appendChild(textNode);
  }
  
  textNode.textContent += text.substring(index, endIndex);
  
  requestAnimationFrame(() => {
    streamText({ elem, parent, text, textNode, queue, nextQueueIndex, index: endIndex });
  });
};

let prevTree;
const queue = [];
window.queue = queue;
const streamUx = ({ hastTree, done }) => {
  console.log("STREAM UX", hastTree);

  let tree = hastTree;
  if (!prevTree) {
    prevTree = hastTree;
  } else {
    tree = {
      ...hastTree,
      children: hastTree.children.slice(prevTree.children.length - 1),
    };
    prevTree = hastTree;
  }

  /**
   * type QueueItem = {
   *  elem: HTMLElement,
   *  parent: HTMLElement,
   *  text?: string,
   *  index: number,
   *  queue: QueueItem[],
   *  nextQueueIndex: number,
   * }
   */

  const parents = [];

  visitParents(tree, undefined, (node, treeParents, /*index, parent*/) => {
    if (!done && node === tree.children.at(-1)) {
      // Skip the last node -- it may be incomplete
      return;
    }

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
      nextQueueIndex: queue.length + 1,
    };

    if (node.properties && item.elem) {
      Object.keys(node.properties).forEach(key => {
        item.elem.setAttribute(key, node.properties[key]);
      });
    }

    if (item.elem) {
      parents.push(item.elem);
    } else if (treeParents.length < parents.length) {
      parents.pop();
      if (node.type === 'text') {
        item.parent = parents.at(-1);
      }
    }

    queue.push(item);
  });

  if (!isStreaming) {
    streamText(queue[0]);
    isStreaming = true;
  }

  if (streamQueue.length) {
    streamUx(streamQueue.shift());
  } else {
    isProcessingQueue = false;
  }
}
