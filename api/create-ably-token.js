import Ably from 'ably';

export default async function handler(req, res) {
    try {
        if (!process.env.ABLY_API_KEY) {
            return res.status(500).json({ error: "Ably API key is not configured on the server." });
        }

        const clientId = req.query.clientId || 'anonymous';
        
        const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY });
        
        const tokenParams = { clientId: clientId };
        const tokenRequest = await ably.auth.createTokenRequest(tokenParams);

        res.status(200).json(tokenRequest);

    } catch (error) {
        console.error("Error creating Ably token:", error);
        res.status(500).json({ error: `Failed to create Ably token: ${error.message}` });
    }
};
