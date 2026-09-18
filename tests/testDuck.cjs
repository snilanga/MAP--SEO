async function searchWeb() {
  const query = 'Manulas Pest Control & Fumigation (pvt) Ltd';
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query + ' google maps reviews')}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }
  });
  const text = await res.text();
  console.log('DuckDuckGo status:', res.status, 'len:', text.length);
  const links = text.match(/https?:\/\/[^\s"'>]+/g) || [];
  const mapLinks = links.filter(l => l.includes('google.com/maps') || l.includes('facebook') || l.includes('manulas'));
  console.log('Found links:', mapLinks.slice(0, 5));
}
searchWeb();