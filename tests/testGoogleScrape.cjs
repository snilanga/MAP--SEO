const https = require('https');

async function testFetch(query) {
  const url = `https://www.google.com/search?q=${encodeURIComponent(query + ' reviews google maps')}&hl=en`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    }
  });
  console.log('Status:', res.status);
  const html = await res.text();
  console.log('HTML length:', html.length);
  
  // Look for rating and reviews
  const ratingMatch = html.match(/(\d\.\d)\s*★|Rating:\s*(\d\.\d)|(\d\.\d)\s*stars/i);
  console.log('Rating match:', ratingMatch ? ratingMatch[0] : 'None');
  
  const reviewCountMatch = html.match(/(\d+[\d,]*)\s*(?:Google reviews|reviews)/i);
  console.log('Review count match:', reviewCountMatch ? reviewCountMatch[0] : 'None');
}

testFetch('Manulas Pest Control & Fumigation (pvt) Ltd');