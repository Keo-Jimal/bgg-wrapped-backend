exports.handler = async (event) => {
  const { username } = event.queryStringParameters;
  
  if (!username) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Username required' })
    };
  }

  try {
    const response = await fetch(
      `https://boardgamegeek.com/xmlapi2/collection?username=${username}&stats=1&subtype=boardgame`
    );
    
    const data = await response.text();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Access-Control-Allow-Origin': '*',
      },
      body: data
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};