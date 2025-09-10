import Ably from 'ably';

export default async function handler(req, res) {
    try {
        if (!process.env.ABLY_API_KEY) {
            return res.status(500).json({ error: "Ably API key is not configured on the server." });
        }

        // The client ID from the user trying to connect
        const clientId = req.query.clientId || 'anonymous-' + Math.random().toString(36).substr(2, 9);
        
        const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY });
        
        // Capabilities can be defined here for fine-grained security
        // For now, we'll allow subscribing and publishing.
        const tokenParams = { 
            clientId: clientId,
            capability: { '*': ['subscribe', 'publish', 'presence'] }
        };

        const tokenRequest = await ably.auth.createTokenRequest(tokenParams);

        res.status(200).json(tokenRequest);

    } catch (error) {
        console.error("Error creating Ably token:", error);
        res.status(500).json({ error: "Failed to create Ably token." });
    }
};