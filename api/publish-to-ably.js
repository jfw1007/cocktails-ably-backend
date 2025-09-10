const Ably = require('ably');

export default async function handler(request, response) {
  // Only accept POST requests from webhooks
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // Initialize Ably with your private API key
  const ably = new Ably.Rest({ key: process.env.8pVyrQ.fm5BfQ:DUghAiJlDM3bzn-Og7Z0_CH3_blvg36FovVNHpowNug });

  // Get the data from the base44 webhook
  const webhookPayload = request.body;
  const updatedRecord = webhookPayload.record;

  // Notify the user who initiated the connection request
  const targetUserId = updatedRecord.requester_id;
  if (!targetUserId) {
    return response.status(400).json({ error: 'No requester_id found' });
  }
  
  // Create a private channel for this user
  const channelName = `user-updates:${targetUserId}`;
  const channel = ably.channels.get(channelName);

  try {
    // Send the update to the user's private channel
    await channel.publish('pending-connection-update', updatedRecord);
    return response.status(200).json({ success: true });
  } catch (error) {
    console.error('Ably error:', error);
    return response.status(500).json({ error: 'Failed to publish to Ably' });
  }
}