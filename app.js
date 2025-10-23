const recordButton = document.getElementById('recording');

let mediaRecorder = null;
let audioChunks = [];
let stream = null;


recordButton.addEventListener('click', async () => {
    if (!stream) {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                 const audioBlob = new Blob(audioChunks, { type: 'audio/webm'});
                 const audioUrl = URL.createObjectURL(audioBlob);

                 const audioPlayback = document.getElementById('audioPlayback');
                 audioPlayback.src = audioUrl;
                 audioPlayback.style.display = 'block';

            };

        } catch (error) {
            alert('Could not access microphone: ' + error.message);
        }
    }

    if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        recordButton.textContent = 'Start Recording';
    } else {
        mediaRecorder.start();
        recordButton.textContent = 'Stop Recording';
    }
});