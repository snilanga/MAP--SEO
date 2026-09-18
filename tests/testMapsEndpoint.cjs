async function checkGoogleMapsPlace(query) {
  // Let's search on Google Maps search endpoint
  const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}?hl=en`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    }
  });
  const text = await res.text();
  console.log('Maps URL final:', res.url);
  // Check if place ID or CID is in the redirected URL or body
  const cidMatch = res.url.match(/0x[0-9a-f]+:0x[0-9a-f]+/i) || text.match(/0x[0-9a-f]+:0x[0-9a-f]+/i);
  console.log('Hex CID match:', cidMatch ? cidMatch[0] : 'None');
}
checkGoogleMapsPlace('Manulas Pest Control & Fumigation (pvt) Ltd');