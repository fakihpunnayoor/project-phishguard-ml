import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractFeatures, FEATURE_NAMES } from './mlFeatureExtractor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelPath = path.join(__dirname, '..', 'models', 'trained_model.json');

// Friendly human-readable feature descriptions for explainable AI
const FEATURE_EXPLANATIONS = {
  highRiskTld: 'Statistical TLD Abuse Prior',
  isHttps: 'Transport Protocol (HTTPS vs HTTP)',
  domainHyphenRatio: 'Hyphen Density in Hostname',
  sensitiveKeywordCount: 'Targeted Security/Auth Keywords',
  hostnameLength: 'Excessive Hostname Length',
  pathLength: 'URL Path Complexity',
  hasTldInSubdomain: 'Decoy TLD in Subdomain Label',
  numDots: 'Subdomain & Path Dot Delimiters',
  shannonEntropy: 'URL Character Randomness (Entropy)',
  isIpAddress: 'Direct IP Address Hostname',
  hasPunycode: 'Punycode / Lookalike Homoglyph',
  hasNonStandardPort: 'Non-Standard Web Port',
  brandInSubdomainMismatch: 'Brand in Subdomain Mismatch',
  suspiciousParamCount: 'Authentication Query Parameters',
  numAt: 'Credential Concealment (@ Symbol)',
  numDoubleSlash: 'Open Redirect Path Sequence (//)',
  specialCharRatio: 'Special Character Obfuscation',
  knownSafeDomainBoost: 'Established Domain Trust History'
};

class MLEngine {
  constructor() {
    this.model = null;
    this.isLoaded = false;
    this.loadModel();
  }

  loadModel() {
    try {
      if (fs.existsSync(modelPath)) {
        const data = fs.readFileSync(modelPath, 'utf-8');
        this.model = JSON.parse(data);
        this.isLoaded = true;
        console.log(`[ML Engine] Loaded trained model (${this.model.architecture}) with accuracy: ${(this.model.metrics.accuracy * 100).toFixed(1)}% on ${this.model.datasetSamples} samples.`);
      } else {
        console.warn(`[ML Engine] Trained model not found at ${modelPath}. Running in heuristic fallback mode.`);
      }
    } catch (err) {
      console.error('[ML Engine] Error loading trained model:', err.message);
    }
  }

  predict(rawUrl) {
    if (!this.isLoaded || !this.model) {
      return {
        probability: 0.5,
        mlScore: 50,
        label: 'UNKNOWN',
        confidence: 50,
        topSignals: [],
        modelMetrics: { accuracy: 0, f1Score: 0, datasetSamples: 0 }
      };
    }

    const { weights, bias, scaler } = this.model;
    const rawFeatures = extractFeatures(rawUrl);
    const numFeatures = rawFeatures.length;

    // Standardize feature vector
    const zFeatures = new Array(numFeatures);
    let logit = bias;
    const contributions = [];

    for (let j = 0; j < numFeatures; j++) {
      const val = rawFeatures[j];
      const mean = scaler.means[j] || 0;
      const std = scaler.stds[j] || 1;
      const z = (val - mean) / std;
      zFeatures[j] = z;

      const impact = weights[j] * z;
      logit += impact;

      const featName = FEATURE_NAMES[j] || `feature_${j}`;
      contributions.push({
        feature: featName,
        title: FEATURE_EXPLANATIONS[featName] || featName,
        rawValue: val,
        impact: impact,
        absImpact: Math.abs(impact)
      });
    }

    // Sigmoid probability
    const probability = 1.0 / (1.0 + Math.exp(-Math.max(-30, Math.min(30, logit))));
    const mlScore = Math.min(100, Math.max(0, Math.round(probability * 100)));
    const label = probability >= 0.50 ? 'PHISHING' : 'LEGITIMATE';
    const confidence = probability >= 0.50 ? probability : 1 - probability;

    // Extract top contributing features
    contributions.sort((a, b) => b.absImpact - a.absImpact);
    const topSignals = contributions.slice(0, 5).map(c => ({
      feature: c.feature,
      title: c.title,
      direction: c.impact > 0 ? 'PHISHING_INDICATOR' : 'SAFETY_INDICATOR',
      scoreImpact: Number((c.impact * 10).toFixed(1)),
      value: String(c.rawValue)
    }));

    return {
      probability: Number(probability.toFixed(4)),
      mlScore,
      label,
      confidence: Number((confidence * 100).toFixed(1)),
      topSignals,
      modelMetrics: {
        accuracy: this.model.metrics.accuracy,
        precision: this.model.metrics.precision,
        recall: this.model.metrics.recall,
        f1Score: this.model.metrics.f1Score,
        datasetSamples: this.model.datasetSamples,
        trainedAt: this.model.trainedAt
      }
    };
  }
}

export const mlEngine = new MLEngine();
export default mlEngine;
