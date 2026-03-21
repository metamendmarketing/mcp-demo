const https = require('https');

https.get('https://www.marquisspas.com/hot-tubs/models/crown-series/epic/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const urls = data.match(/<img[^>]+src="([^">]+)"/g) || [];
    const imgSrcs = urls.map(u => u.match(/src="([^">]+)"/)[1]).filter(u => u.includes('media') || u.includes('lounge') || u.includes('seat'));
    console.log(imgSrcs.join('\n'));
  });
});
