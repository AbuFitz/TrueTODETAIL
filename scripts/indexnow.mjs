// Pings IndexNow (Bing, Yandex, Seznam, Naver) with every URL in the live
// sitemap so changes are picked up in hours instead of waiting for a recrawl.
// Run after a production deploy:  npm run indexnow
// The key file public/031d00162bccdb60c01fa7faf83f2441.txt must stay deployed; the key is public by design.

const SITE = 'https://www.truetodetail.co.uk'
const KEY = '031d00162bccdb60c01fa7faf83f2441'

const xml = await (await fetch(`${SITE}/sitemap.xml`)).text()
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
if (urlList.length === 0) throw new Error('No URLs found in the live sitemap')

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: 'www.truetodetail.co.uk',
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList,
  }),
})
console.log(`IndexNow: submitted ${urlList.length} URLs, response ${res.status} ${res.statusText}`)
if (!res.ok && res.status !== 202) process.exit(1)
