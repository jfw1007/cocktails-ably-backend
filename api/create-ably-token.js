import crypto from 'crypto';

export default async function handler(req, res) {
    try {
        if (!process.env.ABLY_API_KEY) {
            return res.status(500).json({ error: "Ably API key is not configured on the server." });
        }

        const apiKey = process.env.ABLY_API_KEY;
        const [keyId, keySecret] = apiKey.split(':');
        
        // Create a token request directly
        const clientId = req.query.clientId || 'anonymous-' + Math.random().toString(36).substr(2, 9);
        const timestamp = Math.floor(Date.now() / 1000);
        const nonce = crypto.randomBytes(16).toString('hex');
        
        // Token request parameters
        const tokenRequest = {
            keyName: keyId,
            timestamp: timestamp,
            nonce: nonce,
            clientId: clientId,
            capability: JSON.stringify({ '*': ['subscribe', 'publish', 'presence'] }),
            ttl: 3600 // 1 hour
        };

        // Create MAC for authentication
        const signText = [
            tokenRequest.keyName,
            tokenRequest.ttl,
            tokenRequest.capability,
            tokenRequest.clientId,
            tokenRequest.timestamp,
            tokenRequest.nonce
        ].join('\n');

        tokenRequest.mac = crypto
            .createHmac('sha256', keySecret)
            .update(signText)
            .digest('base64');

        res.status(200).json(tokenRequest);

    } catch (error) {
        console.error("Error creating Ably token:", error);
        res.status(500).json({ error: "Failed to create Ably token." });
    }
}
