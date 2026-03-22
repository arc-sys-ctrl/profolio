export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { type, location, details, name, email, message: userMessage } = req.body;
  
  let subject = 'Secret Visitor Alert';
  let body = `New Visitor: ${location}\nDetails: ${details}`;
  
  if (type === 'contact') {
    subject = 'New Portfolio Message!';
    body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${userMessage}`;
  }

  try {
    // Send to ntfy.sh with Email header
    const topic = 'prince_david_portfolio_notifications_v2';
    await fetch(`https://ntfy.sh/${topic}`, {
      method: 'POST',
      body: body,
      headers: {
        'Title': subject,
        'Email': 'princeinvents@gmail.com',
        'Priority': 'high',
        'Tags': type === 'contact' ? 'email,envelope' : 'eyes,earth_africa'
      }
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
