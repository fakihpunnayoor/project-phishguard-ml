import { parseAndNormalizeUrl, analyzeHeuristics } from '../services/heuristicEngine.js';
import { auditNetwork } from '../services/networkEngine.js';
import { auditPageContent } from '../services/contentEngine.js';
import { calculateThreatScore } from '../services/scoringEngine.js';
import { mlEngine } from '../services/mlEngine.js';
import { ScanRepository } from '../models/ScanResult.js';
import { getCache, setCache, getRedisStatus } from '../config/redis.js';
import { getDBStatus } from '../config/database.js';

export const scanUrl = async (req, res, next) => {
  const startTime = Date.now();
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid Request',
        message: 'A target URL string is required in the request body.'
      });
    }

    const parsed = parseAndNormalizeUrl(url);
    if (!parsed.valid) {
      return res.status(400).json({
        success: false,
        error: 'Malformed URL',
        message: `Could not parse target URL: ${parsed.error}`
      });
    }

    const cacheKey = `phishguard:scan:${parsed.url}`;

    // 1. Check Redis Cache Lookup
    const cachedResult = await getCache(cacheKey);
    if (cachedResult) {
      return res.status(200).json({
        success: true,
        cached: true,
        cacheSource: 'REDIS',
        scanDurationMs: Date.now() - startTime,
        data: cachedResult
      });
    }

    // 2. Check Database for recent scan of same normalized URL (within last 10 minutes)
    const recentDbScan = await ScanRepository.findOne({ normalizedUrl: parsed.url });
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    if (recentDbScan && new Date(recentDbScan.scannedAt) > tenMinutesAgo) {
      await setCache(cacheKey, recentDbScan, parseInt(process.env.REDIS_TTL || '3600', 10));

      return res.status(200).json({
        success: true,
        cached: true,
        cacheSource: 'DATABASE',
        scanDurationMs: Date.now() - startTime,
        data: recentDbScan
      });
    }

    // 3. Pipeline Execution: Trained Machine Learning Classifier
    const mlPrediction = mlEngine.predict(parsed.url);

    // 4. Pipeline Execution: Structural Heuristics
    const heuristicResults = analyzeHeuristics(parsed);

    // 5. Pipeline Execution: Network, WHOIS & TLS Audit
    const networkResults = await auditNetwork(parsed);

    // 6. Pipeline Execution: Content & DOM Analysis
    const contentResults = await auditPageContent(parsed);

    // 7. Master Threat Scoring Calculation with ML
    const allIndicators = [
      ...heuristicResults.indicators,
      ...networkResults.indicators,
      ...contentResults.indicators
    ];

    const scoreOutput = calculateThreatScore({
      lexicalScore: heuristicResults.lexicalScore,
      networkScore: networkResults.networkScore,
      contentScore: contentResults.contentScore,
      mlPrediction,
      allIndicators,
      parsedUrl: parsed
    });

    const totalDuration = Date.now() - startTime;

    // 8. Assemble Document with ML Metadata
    const scanDocument = {
      url: parsed.url,
      normalizedUrl: parsed.url,
      domain: parsed.hostname,
      threatScore: scoreOutput.threatScore,
      riskCategory: scoreOutput.riskCategory,
      mlScore: scoreOutput.mlScore,
      mlPrediction: {
        probability: mlPrediction.probability,
        confidence: mlPrediction.confidence,
        label: mlPrediction.label,
        topSignals: mlPrediction.topSignals,
        modelMetrics: mlPrediction.modelMetrics
      },
      lexicalScore: scoreOutput.lexicalScore,
      networkScore: scoreOutput.networkScore,
      contentScore: scoreOutput.contentScore,
      triggeredIndicators: scoreOutput.triggeredIndicators,
      whoisData: networkResults.whoisData,
      tlsData: networkResults.tlsData,
      dnsData: networkResults.dnsData,
      contentData: contentResults.contentData,
      scanDurationMs: totalDuration,
      clientIp: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
      scannedAt: new Date()
    };

    // 9. Persist to MongoDB (or resilient in-memory store)
    const savedRecord = await ScanRepository.create(scanDocument);

    // 10. Cache in Redis (1 Hour TTL)
    await setCache(cacheKey, savedRecord, parseInt(process.env.REDIS_TTL || '3600', 10));

    return res.status(200).json({
      success: true,
      cached: false,
      cacheSource: 'PIPELINE_ENGINE',
      scanDurationMs: totalDuration,
      data: savedRecord
    });
  } catch (error) {
    next(error);
  }
};

export const getScanHistory = async (req, res, next) => {
  try {
    const { category, search, limit = 30 } = req.query;
    const filter = {};

    if (category && ['SAFE', 'SUSPICIOUS', 'DANGEROUS'].includes(category.toUpperCase())) {
      filter.riskCategory = category.toUpperCase();
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { url: { $regex: q, $options: 'i' } },
        { domain: { $regex: q, $options: 'i' } }
      ];
    }

    const records = await ScanRepository.findRecent(filter, parseInt(limit, 10));

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

export const getScanStats = async (req, res, next) => {
  try {
    const stats = await ScanRepository.getAggregatedStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

export const getScanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const record = await ScanRepository.findById(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Scan record with ID ${id} was not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    next(error);
  }
};

export const getHealth = async (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    system: 'PhishGuard Threat Intelligence API v1.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    redis: getRedisStatus(),
    database: getDBStatus()
  });
};

export default {
  scanUrl,
  getScanHistory,
  getScanStats,
  getScanById,
  getHealth
};
