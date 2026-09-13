import validator from 'validator';

// 1. High-risk abused TLDs
export const HIGH_RISK_TLDS = new Set([
  'tk', 'ml', 'ga', 'cf', 'gq', 'top', 'xyz', 'buzz', 'cam',
  'work', 'click', 'link', 'rest', 'country', 'bid', 'surf',
  'loan', 'fit', 'racing', 'download', 'win', 'vip', 'monster',
  'icu', 'cyou', 'live', 'site', 'online', 'space', 'club'
]);

// 2. Sensitive brand/auth keywords
export const SENSITIVE_KEYWORDS = [
  'login', 'signin', 'sign-in', 'log-in', 'logon',
  'verify', 'verification', 'authenticate', 'authentication', 'auth',
  'secure', 'security', 'account', 'update', 'confirm', 'confirmation',
  'bank', 'banking', 'wallet', 'crypto', 'blockchain', 'recover',
  'credential', 'password', 'passcode', 'billing', 'invoice',
  'paypal', 'apple', 'microsoft', 'google', 'netflix', 'amazon',
  'chase', 'wellsfargo', 'citi', 'bankofamerica', 'hsbc', 'barclays',
  'checkpoint', 'support', 'portal', 'session', 'unlock', 'unusual'
];

// 3. Known safe top domains
export const KNOWN_SAFE_ROOT_DOMAINS = new Set([
  'google.com', 'youtube.com', 'facebook.com', 'amazon.com', 'wikipedia.org',
  'twitter.com', 'reddit.com', 'netflix.com', 'linkedin.com', 'instagram.com',
  'yahoo.com', 'bing.com', 'microsoft.com', 'apple.com', 'github.com',
  'stackoverflow.com', 'adobe.com', 'wordpress.org', 'cloudflare.com', 'twitch.tv',
  'spotify.com', 'dropbox.com', 'salesforce.com', 'slack.com', 'zoom.us',
  'medium.com', 'nytimes.com', 'cnn.com', 'bbc.co.uk', 'reuters.com',
  'nih.gov', 'cdc.gov', 'who.int', 'harvard.edu', 'mit.edu', 'stanford.edu',
  'python.org', 'nodejs.org', 'npmjs.com', 'w3.org', 'mozilla.org'
]);

export const FEATURE_NAMES = [
  'urlLength',
  'hostnameLength',
  'pathLength',
  'queryLength',
  'shannonEntropy',
  'numDots',
  'numHyphens',
  'numUnderscores',
  'numAt',
  'numDoubleSlash',
  'numPercents',
  'numDigits',
  'digitRatio',
  'numSubdomains',
  'longestSubdomainLength',
  'hasTldInSubdomain',
  'isIpAddress',
  'hasNonStandardPort',
  'hasPunycode',
  'isHttps',
  'sensitiveKeywordCount',
  'highRiskTld',
  'charContinuityRate',
  'vowelConsonantRatio',
  'brandInSubdomainMismatch',
  'suspiciousParamCount',
  'domainHyphenRatio',
  'hasHexTokens',
  'tldLength',
  'pathSlashCount',
  'specialCharRatio',
  'knownSafeDomainBoost'
];

/**
 * Calculates Shannon Entropy of a string: H = -sum(p * log2(p))
 */
export const calculateEntropy = (str) => {
  if (!str || str.length === 0) return 0;
  const len = str.length;
  const frequencies = {};
  for (let i = 0; i < len; i++) {
    const char = str[i];
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  let entropy = 0;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }
  return entropy;
};

/**
 * Parses and extracts a fixed 32-D numeric feature vector from any URL string
 */
export const extractFeatures = (rawUrl) => {
  let url = (rawUrl || '').trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch (err) {
    // If URL parsing fails, create fallback mock object
    parsed = {
      href: url,
      hostname: url.split('/')[0] || '',
      pathname: '',
      search: '',
      protocol: 'https:',
      port: ''
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const pathname = parsed.pathname || '';
  const search = parsed.search || '';
  const fullUrl = parsed.href || url;

  // 1. Structural lengths
  const urlLength = fullUrl.length;
  const hostnameLength = hostname.length;
  const pathLength = pathname.length;
  const queryLength = search.length;

  // 2. Shannon Entropy of full URL
  const shannonEntropy = calculateEntropy(fullUrl);

  // 3. Punctuation counts
  const numDots = (fullUrl.match(/\./g) || []).length;
  const numHyphens = (fullUrl.match(/-/g) || []).length;
  const numUnderscores = (fullUrl.match(/_/g) || []).length;
  const numAt = (fullUrl.match(/@/g) || []).length;
  const numDoubleSlash = (pathname.match(/\/\//g) || []).length + (search.match(/\/\//g) || []).length;
  const numPercents = (fullUrl.match(/%/g) || []).length;

  // 4. Numerical characters
  const numDigits = (fullUrl.match(/\d/g) || []).length;
  const digitRatio = urlLength > 0 ? numDigits / urlLength : 0;

  // 5. Subdomains
  const hostParts = hostname.split('.');
  const numSubdomains = hostParts.length > 2 ? hostParts.length - 2 : 0;
  const subdomainParts = hostParts.length > 2 ? hostParts.slice(0, -2) : [];
  let longestSubdomainLength = 0;
  subdomainParts.forEach(sub => {
    if (sub.length > longestSubdomainLength) longestSubdomainLength = sub.length;
  });

  const commonTlds = ['com', 'org', 'net', 'edu', 'gov', 'io', 'co'];
  const hasTldInSubdomain = subdomainParts.some(sub => commonTlds.includes(sub)) ? 1 : 0;

  // 6. IP Address & Port
  const isIpAddress = (validator.isIP(hostname, 4) || validator.isIP(hostname, 6)) ? 1 : 0;
  const hasNonStandardPort = (parsed.port && parsed.port !== '80' && parsed.port !== '443') ? 1 : 0;

  // 7. Punycode & HTTPS
  const hasPunycode = hostname.includes('xn--') ? 1 : 0;
  const isHttps = parsed.protocol === 'https:' ? 1 : 0;

  // 8. Sensitive Keyword density
  const lowerUrl = fullUrl.toLowerCase();
  let sensitiveKeywordCount = 0;
  SENSITIVE_KEYWORDS.forEach(kw => {
    if (lowerUrl.includes(kw)) sensitiveKeywordCount++;
  });

  // 9. High-risk TLD
  const tld = hostParts.length > 1 ? hostParts[hostParts.length - 1] : '';
  const highRiskTld = HIGH_RISK_TLDS.has(tld) ? 1 : 0;
  const tldLength = tld.length;

  // 10. Lexical Patterns: Char continuity & vowel ratio
  const consonantMatch = hostname.match(/[bcdfghjklmnpqrstvwxyz0-9]{3,}/gi) || [];
  let charContinuityRate = 0;
  consonantMatch.forEach(m => {
    if (m.length > charContinuityRate) charContinuityRate = m.length;
  });

  const vowels = (hostname.match(/[aeiou]/gi) || []).length;
  const consonants = (hostname.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length;
  const vowelConsonantRatio = consonants > 0 ? vowels / consonants : 0;

  // 11. Brand in subdomain mismatch (e.g. paypal.com.evil.xyz)
  const popularBrands = ['paypal', 'apple', 'microsoft', 'google', 'chase', 'netflix', 'amazon'];
  let brandInSubdomainMismatch = 0;
  const rootDomain = hostParts.slice(-2).join('.');
  popularBrands.forEach(b => {
    if (subdomainParts.some(sub => sub.includes(b)) && !rootDomain.includes(b)) {
      brandInSubdomainMismatch = 1;
    }
  });

  // 12. Query parameters
  const suspiciousParams = ['token', 'redirect', 'session', 'auth', 'cmd', 'user_id', 'code'];
  let suspiciousParamCount = 0;
  suspiciousParams.forEach(p => {
    if (search.toLowerCase().includes(p)) suspiciousParamCount++;
  });

  // 13. Domain hyphen ratio
  const domainHyphenCount = (hostname.match(/-/g) || []).length;
  const domainHyphenRatio = hostnameLength > 0 ? domainHyphenCount / hostnameLength : 0;

  // 14. Hex tokens
  const hasHexTokens = /[0-9a-f]{8,}/i.test(fullUrl) ? 1 : 0;

  // 15. Path slashes & special chars
  const pathSlashCount = (pathname.match(/\//g) || []).length;
  const specialChars = (fullUrl.match(/[^a-zA-Z0-9:/.]/g) || []).length;
  const specialCharRatio = urlLength > 0 ? specialChars / urlLength : 0;

  // 16. Known safe domain reputation
  let knownSafeDomainBoost = 0;
  if (KNOWN_SAFE_ROOT_DOMAINS.has(rootDomain) || KNOWN_SAFE_ROOT_DOMAINS.has(hostname)) {
    knownSafeDomainBoost = -1;
  }

  // Construct ordered feature vector
  return [
    urlLength,
    hostnameLength,
    pathLength,
    queryLength,
    shannonEntropy,
    numDots,
    numHyphens,
    numUnderscores,
    numAt,
    numDoubleSlash,
    numPercents,
    numDigits,
    digitRatio,
    numSubdomains,
    longestSubdomainLength,
    hasTldInSubdomain,
    isIpAddress,
    hasNonStandardPort,
    hasPunycode,
    isHttps,
    sensitiveKeywordCount,
    highRiskTld,
    charContinuityRate,
    vowelConsonantRatio,
    brandInSubdomainMismatch,
    suspiciousParamCount,
    domainHyphenRatio,
    hasHexTokens,
    tldLength,
    pathSlashCount,
    specialCharRatio,
    knownSafeDomainBoost
  ];
};

export default {
  extractFeatures,
  FEATURE_NAMES,
  calculateEntropy
};
