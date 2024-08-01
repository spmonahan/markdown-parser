const mdWorker = new Worker('worker-stream.js', { type: 'module' });
const canvas = document.getElementById("canvas");

const file = new URLSearchParams(window.location.search).get("file") || "lorem.md";

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
  
        window.tachometerResult = endTime - startTime;
        return;
      }

      canvas.innerHTML = value;      
    };
  }, 1000);
});
