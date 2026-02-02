export default async function handler(request, response) {
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
  console.log('Token exists:', !!process.env.BGG_API_TOKEN); // Log if token exists
  console.log('Token length:', process.env.BGG_API_TOKEN?.length); // Log length
  
  const bggResponse = await fetch(
    `https://boardgamegeek.com/xmlapi2/collection?username=${encodeURIComponent(username)}&stats=1&subtype=boardgame`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.BGG_API_TOKEN}`
      }
    }
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

