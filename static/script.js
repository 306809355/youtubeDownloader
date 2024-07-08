document.getElementById('download-form').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const url = document.getElementById('video-url').value;
    const format = document.getElementById('format').value;
    const resolution = document.getElementById('resolution').value;
    const loadingAnimation = document.getElementById('loading-animation');

    loadingAnimation.classList.remove('hidden');

    fetch('/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url, format: format, resolution: resolution })
    })
    .then(response => {
        loadingAnimation.classList.add('hidden');
        if (!response.ok) {
            return response.json().then(data => { throw new Error(data.message); });
        }
        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = format === 'mp4' ? 'video.mp4' : 'audio.mp3';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        alert('Download completed!');
    })
    .catch(error => {
        loadingAnimation.classList.add('hidden');
        alert('Error: ' + error.message);
    });
});

// Adding background shape animation logic
function createShape() {
    const shape = document.createElement('div');
    shape.classList.add('shape');
    shape.style.width = Math.random() * 50 + 10 + 'px';
    shape.style.height = shape.style.width;
    shape.style.left = Math.random() * 100 + 'vw';
    shape.style.top = Math.random() * 100 + 'vh';
    shape.style.animationDuration = Math.random() * 5 + 5 + 's';
    document.querySelector('.background').appendChild(shape);

    setTimeout(() => {
        shape.remove();
    }, 15000);
}

setInterval(createShape, 1000);
