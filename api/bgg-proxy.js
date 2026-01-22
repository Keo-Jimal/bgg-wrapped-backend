const https = require('https');

module.exports = async (req, res) => {
  const { username } = req.query;
  
  if (!username) {
    return res.status(400).json({ error: 'Username required' });
  }

  const url = `https://boardgamegeek.com/xmlapi2/collection?username=${username}&stats=1&subtype=boardgame`;

  https.get(url, (response) => {
    let data = '';
    
    response.on('data', (chunk) => {
      data += chunk;
    });
    
    response.on('end', () => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'application/xml');
      res.status(200).send(data);
    });
  }).on('error', (error) => {
    res.status(500).json({ error: error.message });
  });
};
```

6. **Click "Commit changes"**
7. **Wait 30 seconds** for Vercel to auto-redeploy
8. **Try the test URL again:**
```
   https://bgg-wrapped-backend.vercel.app/api/bgg-proxy?username=Hipopotam
