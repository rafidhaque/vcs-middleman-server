// The final, simplest, and most robust server configuration.
const express = require('express');
const cors = require('cors');

const app = express();

// 1. Enable CORS for all requests. This is the simplest and best way.
app.use(cors());

// 2. Enable the server to parse incoming JSON.
app.use(express.json());

// In-memory database.
const shareStore = {};

const PORT = 3000; // Vercel will manage the port automatically.

// Endpoint to store a share
app.post('/share', (req, res) => {
    const { ipfsHash, middlemanShare } = req.body;
    if (!ipfsHash || !middlemanShare) {
        return res.status(400).json({ error: 'ipfsHash and middlemanShare are required' });
    }
    shareStore[ipfsHash] = middlemanShare;
    console.log(`Stored share for ${ipfsHash}`);
    res.status(200).json({ success: true, message: `Share for ${ipfsHash} stored.` });
});

// Endpoint to retrieve a share
app.get('/share/:ipfsHash', (req, res) => {
    const { ipfsHash } = req.params;
    const share = shareStore[ipfsHash];
    if (share) {
        console.log(`Retrieved share for ${ipfsHash}`);
        res.status(200).json({ success: true, middlemanShare: share });
    } else {
        console.log(`No share found for ${ipfsHash}`);
        res.status(404).json({ success: false, error: 'Share not found' });
    }
});

// This is only for local testing. Vercel uses the routing in vercel.json.
if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`Middleman server listening on http://localhost:${PORT}`);
    });
}

// Export the app for Vercel's serverless environment
module.exports = app;