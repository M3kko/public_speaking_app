const fs = require('fs');
const express = require('express');
const app = express();


app.use(express.static('.'));

app.post('/api/upload', express.raw({ type: 'audio/webm', limit: '10mb' }), (req, res) => {
    console.log('Received audio file, size:', req.body.length, 'bytes');
    const filename = `recording-${Date.now()}.webm`;

    fs.writeFile(filename, req.body, (err) => {
        if (err) {
            console.error('Error saving audio file:', err);
            return res.status(500).json({ success: false, message: 'Failed to save audio file.' });
        }
        console.log('Audio file saved as', filename);
        res.json({ success: true, message: 'Audio received!' });
    });
})

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000')
});