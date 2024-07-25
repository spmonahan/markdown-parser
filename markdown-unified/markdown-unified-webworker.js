const mdWorker = new Worker('worker.js', { type: 'module' });
const canvas = document.getElementById("canvas");

const file = new URLSearchParams(window.location.search).get("file") || "lorem.md";

fetch(file).then(res => res.text()).then(md => {
  setTimeout(() => {
    const startTime = performance.now();
    mdWorker.postMessage(md);
    mdWorker.onmessage = (e) => {
      canvas.innerHTML = e.data;

      const endTime = performance.now();
      performance.measure('markdown', {
        start: startTime, 
        end: endTime,
      });

      window.tachometerResult = endTime - startTime;
    };
  }, 1000);
});
