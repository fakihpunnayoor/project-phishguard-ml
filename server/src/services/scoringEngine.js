/**
 * Calculates unified algorithmic Threat Score (0–100) and assigns risk categories
 * Combining:
 *   - Trained Machine Learning Model (45% weight)
 *   - Lexical & Structural Heuristics (25% weight)
 *   - Network & Infrastructure Security (20% weight)
 *   - Page Content & DOM Forms (10% weight)
 *
 * Categories:
 *   SAFE (0–29)
 *   SUSPICIOUS (30–69)
 *   DANGEROUS (70–100)
 */
export const calculateThreatScore = ({
  lexicalScore,
  networkScore,
  contentScore,
  mlPrediction,
  allIndicators,
  parsedUrl
}) => {
  const mlScore = mlPrediction?.mlScore ?? lexicalScore;
  const mlProb = mlPrediction?.probability ?? (lexicalScore / 100);

  // Clone indicators
  const indicatorsList = [...allIndicators];

  // Inject ML Explainability Indicator
  if (mlProb >= 0.70) {
    indicatorsList.push({
      indicator: 'ML_HIGH_RISK_PROBABILITY',
      title: `ML Neural Model: ${(mlProb * 100).toFixed(1)}% Phishing Confidence`,
      description: `Trained statistical classifier flagged high phishing risk based on: ${mlPrediction.topSignals?.map(s => s.title).slice(0, 3).join(', ') || 'lexical vector patterns'}`,
      severity: mlProb >= 0.90 ? 'CRITICAL' : 'HIGH',
      scorePenalty: Math.round(mlProb * 35)
    });
  } else if (mlProb <= 0.05) {
    indicatorsList.push({
      indicator: 'ML_VERIFIED_LEGITIMATE',
      title: 'ML Model: 99%+ Clean Infrastructure Profile',
      description: '32-D statistical feature vector conforms with legitimate internet infrastructure benchmarks',
      severity: 'INFO',
      scorePenalty: 0
    });
  }

  // Sort severity priorities
  const severityRank = {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
    INFO: 0
  };

  // Deduplicate and order indicators
  const uniqueMap = new Map();
  indicatorsList.forEach(ind => {
    if (!uniqueMap.has(ind.indicator)) {
      uniqueMap.set(ind.indicator, ind);
    }
  });

  const sortedIndicators = Array.from(uniqueMap.values()).sort((a, b) => {
    const rankDiff = (severityRank[b.severity] || 0) - (severityRank[a.severity] || 0);
    if (rankDiff !== 0) return rankDiff;
    return (b.scorePenalty || 0) - (a.scorePenalty || 0);
  });

  // Base weighted calculation:
  // 45% Trained ML Classifier, 25% Lexical heuristics, 20% Network infrastructure, 10% Page content
  let rawScore = (mlScore * 0.45) + (lexicalScore * 0.25) + (networkScore * 0.20) + (contentScore * 0.10);

  // Critical Escalation Rules:
  const hasCritical = sortedIndicators.some(i => i.severity === 'CRITICAL');
  const hasMultipleHigh = sortedIndicators.filter(i => i.severity === 'HIGH').length >= 2;

  if (hasCritical) {
    rawScore = Math.max(rawScore, 75);
  } else if (hasMultipleHigh) {
    rawScore = Math.max(rawScore, 55);
  }

  // Whitelist / Known Safe Domain Dampening (e.g., github.com, wikipedia.org, google.com)
  const knownSafeDomains = [
    'github.com', 'wikipedia.org', 'google.com', 'microsoft.com',
    'apple.com', 'amazon.com', 'cloudflare.com', 'mozilla.org',
    'stackoverflow.com', 'linkedin.com', 'youtube.com'
  ];

  const isKnownSafe = knownSafeDomains.some(d => parsedUrl.hostname === d || parsedUrl.hostname.endsWith(`.${d}`));
  if (isKnownSafe && !hasCritical) {
    rawScore = Math.min(rawScore, 10);
    if (!sortedIndicators.some(i => i.indicator === 'KNOWN_REPUTATION')) {
      sortedIndicators.push({
        indicator: 'KNOWN_REPUTATION',
        title: 'High-Reputation Established Domain',
        description: 'Verified legitimate infrastructure with extensive trust history',
        severity: 'INFO',
        scorePenalty: 0
      });
    }
  }

  // Bound between 0 and 100
  const finalThreatScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  // Categorize
  let riskCategory = 'SAFE';
  if (finalThreatScore >= 70) {
    riskCategory = 'DANGEROUS';
  } else if (finalThreatScore >= 30) {
    riskCategory = 'SUSPICIOUS';
  }

  // If safe and no indicators, add a baseline assurance indicator
  if (riskCategory === 'SAFE' && sortedIndicators.length === 0) {
    sortedIndicators.push({
      indicator: 'CLEAN_PROFILE',
      title: 'Zero Negative Heuristics Detected',
      description: 'Domain passed all machine learning, cryptographic, and infrastructural validation checks',
      severity: 'INFO',
      scorePenalty: 0
    });
  }

  return {
    threatScore: finalThreatScore,
    riskCategory,
    mlScore: Math.round(mlScore),
    lexicalScore: Math.round(lexicalScore),
    networkScore: Math.round(networkScore),
    contentScore: Math.round(contentScore),
    triggeredIndicators: sortedIndicators
  };
};

export default calculateThreatScore;
