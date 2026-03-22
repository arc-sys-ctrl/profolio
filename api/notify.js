export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { location, details } = req.body;
  const message = `New Visitor: ${location}\nDetails: ${details}`;

  try {
    // Send to ntfy.sh with Email header
    const topic = 'prince_david_portfolio_alerts_unique_id_99';
    await fetch(`https://ntfy.sh/${topic}`, {
      method: 'POST',
      body: message,
      headers: {
        'Title': 'Secret Visitor Alert',
        'Email': 'princeinvents@gmail.com',
        'Priority': 'high',
        'Tags': 'eyes,earth_africa'
      }
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
