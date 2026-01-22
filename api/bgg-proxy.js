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
      { 
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/xml, text/xml, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br'
        }
      }
    );

    if (!bggResponse.ok) {
      const errorText = await bggResponse.text();
      throw new Error(`BGG API returned status ${bggResponse.status}: ${errorText}`);
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
