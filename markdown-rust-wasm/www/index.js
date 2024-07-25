import * as rustMarkdown from 'rust-markdown';

const file = new URLSearchParams(window.location.search).get("file") || "lorem.md";

fetch(file).then(response => response.text()).then(md => {
  const canvas = document.getElementById("canvas");
  setTimeout(() => {
    const startTime = performance.now();
  
    canvas.innerHTML = rustMarkdown.to_string(md);
  
    const endTime = performance.now();
    performance.measure('markdown', {
      start: startTime, 
      end: endTime,
    });

    window.tachometerResult = endTime - startTime;

  }, 1000)
});


