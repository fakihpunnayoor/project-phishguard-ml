import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 1. High-profile targeted brands
const TARGET_BRANDS = [
  'paypal', 'apple', 'microsoft', 'google', 'netflix', 'amazon', 'chase',
  'wellsfargo', 'bankofamerica', 'citi', 'barclays', 'hsbc', 'binance',
  'coinbase', 'metamask', 'blockchain', 'facebook', 'instagram', 'whatsapp',
  'steam', 'roblox', 'ebay', 'walmart', 'fedex', 'dhl', 'usps', 'ups',
  'irs', 'hmrc', 'dropbox', 'docusign', 'adobe', 'yahoo', 'outlook', 'office365',
  'att', 'verizon', 'tmobile', 'spotify', 'tiktok', 'twitter', 'linkedin',
  'discord', 'telegram', 'kraken', 'kucoin', 'bybit', 'gemini', 'robinhood'
];

// 2. High-risk abused TLDs
const ABUSED_TLDS = [
  'xyz', 'top', 'tk', 'ml', 'ga', 'cf', 'gq', 'buzz', 'cam', 'work',
  'click', 'link', 'rest', 'bid', 'surf', 'loan', 'win', 'vip', 'monster',
  'icu', 'cyou', 'live', 'site', 'online', 'space', 'club'
];

// 3. Phishing action keywords & tokens
const ACTION_KEYWORDS = [
  'login', 'signin', 'verify', 'verification', 'auth', 'security',
  'update-account', 'confirm-identity', 'wallet-recovery', 'unlock',
  'billing-portal', 'secure-checkpoint', 'recover-password', 'session-validate',
  'case-review', 'suspend-notice', 'claim-reward', 'invoice-pdf', 'view-document',
  'passcode-reset', 'banking-online', 'portal-access', 'kyc-submit', 'unusual-activity'
];

// 4. Broad collection of verified legitimate domains (top 300+ global domains)
const LEGIT_DOMAINS = [
  'google.com', 'youtube.com', 'facebook.com', 'amazon.com', 'wikipedia.org',
  'twitter.com', 'reddit.com', 'netflix.com', 'linkedin.com', 'instagram.com',
  'yahoo.com', 'bing.com', 'microsoft.com', 'apple.com', 'github.com',
  'stackoverflow.com', 'adobe.com', 'wordpress.org', 'cloudflare.com', 'twitch.tv',
  'spotify.com', 'dropbox.com', 'salesforce.com', 'slack.com', 'zoom.us',
  'medium.com', 'nytimes.com', 'cnn.com', 'bbc.co.uk', 'reuters.com',
  'theguardian.com', 'forbes.com', 'bloomberg.com', 'imdb.com', 'ebay.com',
  'etsy.com', 'walmart.com', 'target.com', 'ikea.com', 'homedepot.com',
  'bestbuy.com', 'craigslist.org', 'zillow.com', 'booking.com', 'airbnb.com',
  'tripadvisor.com', 'expedia.com', 'uber.com', 'lyft.com', 'doordash.com',
  'instacart.com', 'weather.com', 'nih.gov', 'cdc.gov', 'who.int',
  'harvard.edu', 'mit.edu', 'stanford.edu', 'berkeley.edu', 'ox.ac.uk',
  'cam.ac.uk', 'w3.org', 'mozilla.org', 'apache.org', 'python.org',
  'nodejs.org', 'npmjs.com', 'gitlab.com', 'bitbucket.org', 'docker.com',
  'kubernetes.io', 'terraform.io', 'datadoghq.com', 'elastic.co', 'mongodb.com',
  'postgresql.org', 'mysql.com', 'redis.io', 'nginx.com', 'apachefriends.org',
  'stackoverflow.blog', 'dev.to', 'hashnode.com', 'hackernoon.com', 'arxiv.org',
  'nature.com', 'sciencedirect.com', 'jstor.org', 'britannica.com', 'merriam-webster.com',
  'dictionary.com', 'thesaurus.com', 'khanacademy.org', 'coursera.org', 'edx.org',
  'udemy.com', 'codecademy.com', 'freecodecamp.org', 'w3schools.com', 'geeksforgeeks.org',
  'oracle.com', 'ibm.com', 'intel.com', 'amd.com', 'nvidia.com',
  'cisco.com', 'dell.com', 'hp.com', 'lenovo.com', 'asus.com',
  'samsung.com', 'sony.com', 'panasonic.com', 'philips.com', 'siemens.com',
  'canon.com', 'nikon.com', 'bose.com', 'logitech.com', 'razer.com',
  'stripe.com', 'square.com', 'shopify.com', 'adyen.com', 'plaid.com',
  'revolut.com', 'monzo.com', 'wise.com', 'chase.com', 'bankofamerica.com',
  'wellsfargo.com', 'citibank.com', 'capitalone.com', 'fidelity.com', 'vanguard.com',
  'schwab.com', 'usaa.com', 'americanexpress.com', 'discover.com', 'barclays.co.uk',
  'hsbc.com', 'lloydsbank.com', 'natwest.com', 'santander.com', 'bnpparibas.com',
  'deutsche-bank.de', 'ubs.com', 'credit-suisse.com', 'ing.com', 'nordea.com',
  'aliexpress.com', 'alibaba.com', 'rakuten.co.jp', 'baidu.com', 'qq.com',
  'weibo.com', 'yandex.ru', 'vk.com', 'mail.ru', 'line.me', 'naver.com',
  'quora.com', 'pinterest.com', 'tumblr.com', 'flickr.com', 'vimeo.com',
  'soundcloud.com', 'dailymotion.com', 'hulu.com', 'disneyplus.com', 'hbomax.com',
  'paramountplus.com', 'peacocktv.com', 'espn.com', 'nba.com', 'nfl.com',
  'fifa.com', 'uefa.com', 'bbc.com', 'cnet.com', 'techcrunch.com', 'theverge.com',
  'wired.com', 'engadget.com', 'gizmodo.com', 'mashable.com', 'arstechnica.com',
  'wsj.com', 'ft.com', 'economist.com', 'washingtonpost.com', 'latimes.com',
  'usatoday.com', 'huffpost.com', 'buzzfeed.com', 'vox.com', 'vice.com',
  'nationalgeographic.com', 'scientificamerican.com', 'smithsonianmag.com',
  'mayoclinic.org', 'webmd.com', 'healthline.com', 'clevelandclinic.org',
  'unesco.org', 'un.org', 'worldbank.org', 'imf.org', 'europa.eu', 'gov.uk',
  'canada.ca', 'australia.gov.au', 'usa.gov', 'whitehouse.gov', 'nasa.gov'
];

const LEGIT_SUBDOMAINS = [
  'www', 'docs', 'api', 'app', 'developer', 'support', 'help', 'blog',
  'news', 'store', 'shop', 'auth', 'login', 'accounts', 'portal',
  'cloud', 'status', 'community', 'mail', 'cdn', 'media', 'secure',
  'download', 'mobile', 'static', 'assets', 'forum', 'connect', 'beta'
];

const LEGIT_PATHS = [
  '',
  'about-us',
  'contact-support',
  'products/enterprise-edition',
  'solutions/cloud-security',
  'pricing/annual-plan',
  'terms-of-service',
  'privacy-policy',
  'help/faq/troubleshooting',
  'documentation/v2/api-reference',
  'articles/2026/03/machine-learning-trends',
  'catalog/items/492810/details',
  'user/profile/settings',
  'search?query=neural+network+optimization&page=1',
  'research/publications/paper-2025.pdf',
  'community/discussions/topic-891',
  'dashboard/metrics?timeframe=weekly',
  'status/incidents/all-systems-operational',
  'jobs/engineering/senior-fullstack-dev',
  'legal/compliance/gdpr'
];

console.log('Generating balanced dataset with ~3,500 phishing & ~3,500 legitimate URLs...');

const legitSamples = new Set();
const phishSamples = new Set();

// 1. Generate Diverse Legitimate URLs (~3,500)
LEGIT_DOMAINS.forEach(dom => {
  legitSamples.add(`https://${dom}`);
  legitSamples.add(`https://www.${dom}`);

  // Paths
  LEGIT_PATHS.forEach(p => {
    if (p) legitSamples.add(`https://${dom}/${p}`);
  });

  // Subdomains with paths
  LEGIT_SUBDOMAINS.slice(0, 10).forEach(sub => {
    const p = LEGIT_PATHS[Math.floor(Math.random() * LEGIT_PATHS.length)];
    legitSamples.add(`https://${sub}.${dom}/${p}`);
  });
});

// Additional real-world multi-path legitimate samples
const EXTRA_LEGIT_PREFIXES = ['https://github.com/', 'https://en.wikipedia.org/wiki/', 'https://aws.amazon.com/'];
const EXTRA_LEGIT_TOPICS = [
  'Artificial_intelligence', 'Machine_learning', 'Deep_learning', 'Cybersecurity',
  'Computer_network', 'Phishing', 'Cryptography', 'Transport_Layer_Security',
  'Domain_Name_System', 'Logistic_regression', 'Gradient_descent', 'Entropy'
];
EXTRA_LEGIT_TOPICS.forEach(topic => {
  EXTRA_LEGIT_PREFIXES.forEach(prefix => {
    legitSamples.add(`${prefix}${topic}`);
  });
});

// 2. Generate Diverse Phishing URLs (~3,500)

// A. Hyphenated Squatting Brand Domains
TARGET_BRANDS.forEach(brand => {
  ABUSED_TLDS.slice(0, 15).forEach(tld => {
    ACTION_KEYWORDS.slice(0, 4).forEach(act => {
      phishSamples.add(`http://${brand}-${act}.${tld}`);
      phishSamples.add(`http://secure-${brand}.${tld}/${act}.php`);
    });
  });
});

// B. Deep Subdomain Brand Spoofing
TARGET_BRANDS.forEach(brand => {
  const decoyTlds = ['xyz', 'top', 'club', 'site', 'live', 'icu', 'click'];
  decoyTlds.forEach(tld => {
    phishSamples.add(`http://login.${brand}.com.verify-user.${tld}/signin`);
    phishSamples.add(`https://${brand}.com.security-alert.${tld}/checkpoint.html`);
    phishSamples.add(`http://accounts.${brand}.com-auth-checkpoint.${tld}/auth`);
    phishSamples.add(`http://www.${brand}.com.portal.${tld}/?cmd=_login-submit`);
  });
});

// C. IP-Based Phishing URLs
const PHISH_IPS = [
  '192.168.1.105:8080', '185.220.101.5', '45.142.214.12', '194.26.29.112',
  '91.240.118.45:4433', '103.151.125.8', '193.106.191.22:8000', '195.123.245.98',
  '178.249.206.15', '141.98.11.45', '77.91.76.124:8888', '194.36.177.10'
];
PHISH_IPS.forEach(ip => {
  TARGET_BRANDS.slice(0, 20).forEach(brand => {
    phishSamples.add(`http://${ip}/${brand}/login.php`);
    phishSamples.add(`http://${ip}/secure/auth?target=${brand}`);
    phishSamples.add(`http://${ip}/portal/update-billing.html`);
  });
});

// D. Credential Obfuscation with @
TARGET_BRANDS.forEach(brand => {
  phishSamples.add(`http://${brand}.com@evil-phishing-host.xyz/login`);
  phishSamples.add(`http://support.${brand}.com@redirect-server.top/verify`);
  phishSamples.add(`http://security@auth-gate.cf/${brand}-recovery`);
});

// E. Punycode Lookalike Homographs
const PUNY_DOMAINS = [
  'xn--pypal-4ve.com', 'xn--aple-4qa.com', 'xn--microsft-5za.com',
  'xn--gogle-qoa.com', 'xn--chse-spa.com', 'xn--netflx-t9a.com',
  'xn--bance-mqa.com', 'xn--coinbse-d0a.com', 'xn--amazn-p1a.com'
];
PUNY_DOMAINS.forEach(puny => {
  phishSamples.add(`http://${puny}/login`);
  phishSamples.add(`https://${puny}/verify-account`);
  phishSamples.add(`http://${puny}/session/update.php?id=38192`);
});

// F. High-Entropy Hex & Query Trap Phishing
TARGET_BRANDS.slice(0, 30).forEach(brand => {
  const hex1 = Math.random().toString(36).substring(2, 10);
  const hex2 = Math.random().toString(36).substring(2, 10);
  phishSamples.add(`http://secure-${brand}-protection.xyz/auth/checkpoint?session=${hex1}&token=${hex2}`);
  phishSamples.add(`http://${brand}-account-center.site/verify?user_id=${hex1}&redirect=login`);
});

// Turn Sets into Arrays
const legitArray = Array.from(legitSamples);
const phishArray = Array.from(phishSamples);

console.log(`Raw Sample Counts:`);
console.log(`- Phishing: ${phishArray.length}`);
console.log(`- Legitimate: ${legitArray.length}`);

// Balance dataset: Subsample the larger set to match the smaller set within 10%
const targetCount = Math.min(legitArray.length, phishArray.length);

const finalLegit = legitArray.slice(0, targetCount).map(url => ({ url, label: 0 }));
const finalPhish = phishArray.slice(0, targetCount).map(url => ({ url, label: 1 }));

const balancedDataset = [...finalLegit, ...finalPhish];

// Fisher-Yates Shuffle
for (let i = balancedDataset.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [balancedDataset[i], balancedDataset[j]] = [balancedDataset[j], balancedDataset[i]];
}

console.log(`\nFinal Balanced Dataset:`);
console.log(`- Total: ${balancedDataset.length}`);
console.log(`- Phishing (1): ${finalPhish.length} (${((finalPhish.length / balancedDataset.length) * 100).toFixed(1)}%)`);
console.log(`- Legitimate (0): ${finalLegit.length} (${((finalLegit.length / balancedDataset.length) * 100).toFixed(1)}%)`);

const outputPath = path.join(dataDir, 'phishing_dataset.json');
fs.writeFileSync(outputPath, JSON.stringify(balancedDataset, null, 2), 'utf-8');

console.log(`Balanced dataset saved successfully to: ${outputPath}`);
