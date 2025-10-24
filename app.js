const recordButton = document.getElementById('recording');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const practiceItems = document.querySelectorAll('.practice-item');
const recordingModal = document.getElementById('recording-modal');
const closeModalBtn = document.querySelector('.close-modal');

let mediaRecorder = null;
let audioChunks = [];
let stream = null;

function setGreeting() {
    const hour = new Date().getHours();
    let greeting = 'Good evening';

    if (hour < 12) {
        greeting = 'Good morning';
    } else if (hour < 18) {
        greeting = 'Good afternoon';
    }

    const greetingText = document.getElementById('greeting-text');
    if (greetingText) {
        greetingText.textContent = `${greeting}, User`;
    }
}

practiceItems.forEach(item => {
    item.addEventListener('click', () => {
        const isLocked = item.getAttribute('data-locked') === 'true';

        if (isLocked) {
            alert('🔒 This exercise is locked! Complete the associated library lesson first to unlock it.');
            return;
        }

        const practiceType = item.getAttribute('data-practice');
        const title = item.querySelector('h3').textContent;
        const description = item.querySelector('p').textContent;

        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-instructions').textContent = description;

        recordingModal.classList.remove('hidden');
    });
});

closeModalBtn.addEventListener('click', () => {
    recordingModal.classList.add('hidden');
});

recordingModal.addEventListener('click', (e) => {
    if (e.target === recordingModal) {
        recordingModal.classList.add('hidden');
    }
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = link.getAttribute('data-section');

        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        sections.forEach(section => {
            if (section.id === `${targetSection}-section`) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    setGreeting();

    const practiceLink = document.querySelector('[data-section="practice"]');
    if (practiceLink) {
        practiceLink.classList.add('active');
    }
});


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

                 try {
                    const response = await fetch('/api/upload', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'audio/webm'
                        },
                        body: audioBlob
                 });
                 const result = await response.json();
                 } catch (error) {
                        console.error('Error uploading audio:', error);
                }

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
        recordButton.classList.remove('recording');
    } else {
        mediaRecorder.start();
        recordButton.classList.add('recording');
    }
});