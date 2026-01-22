export default async function handler(request, response) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  const username = request.query.username;
  
  if (!username) {
    response.status(400).json({ error: 'Username parameter required' });
    return;
  }

  try {
    const bggResponse = await fetch(
      `https://boardgamegeek.com/xmlapi2/collection?username=${encodeURIComponent(username)}&stats=1&subtype=boardgame`,
      { method: 'GET' }
    );

    if (!bggResponse.ok) {
      throw new Error(`BGG API returned status ${bggResponse.status}`);
    }

    const xmlData = await bggResponse.text();

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Content-Type', 'application/xml');
    response.status(200).send(xmlData);

  } catch (error) {
    console.error('Error fetching BGG data:', error);
    response.status(500).json({ 
      error: 'Failed to fetch data from BoardGameGeek',
      details: error.message 
    });
  }
}
