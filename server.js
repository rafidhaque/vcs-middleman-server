// A simple in-memory middleman server
const express = require('express');

// A more explicit CORS configuration for Vercel
app.use(cors({
  origin: '*', // Allow all origins (you could restrict this to your dApp's domain in production)
  methods: ['GET', 'POST', 'OPTIONS'], // Explicitly allow OPTIONS for preflight
  allowedHeaders: ['Content-Type']
}));

// This is an extra handler to ensure OPTIONS requests are always handled correctly.
app.options('*', cors());

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Middleware to allow cross-origin requests from our dApp

// In-memory database. In a real system, you'd use Redis or another DB.
// For our experiment, this is perfect.
const shareStore = {}; // e.g., { "QmHash123": "keyShareABC" }

const PORT = 3000; // We'll run this on localhost:3000

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

app.listen(PORT, () => {
    console.log(`Middleman server listening on http://localhost:${PORT}`);
});