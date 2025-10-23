const express = require('express');
const app = express();


app.use(express.static('.'));

app.post('/api/upload', experss.raw({ type: 'audio/webm', limit: '10mb' }), (req, res) => {
    
    console.log('Received audio file, size:', req.body.length, 'bytes');
    
    res.json({ success: true, message: 'Audio received!' });
})

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000')
});
