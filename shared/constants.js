/**
 * Shared Risk Categories & Thresholds across PhishGuard Client and Server
 */
export const RISK_LEVELS = {
  SAFE: 'SAFE',
  SUSPICIOUS: 'SUSPICIOUS',
  DANGEROUS: 'DANGEROUS'
};

export const RISK_THRESHOLDS = {
  SAFE_MAX: 29,
  SUSPICIOUS_MIN: 30,
  SUSPICIOUS_MAX: 69,
  DANGEROUS_MIN: 70
};

export const SEVERITY_LEVELS = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
  INFO: 'INFO'
};

export const CACHE_SOURCES = {
  REDIS: 'REDIS',
  DATABASE: 'DATABASE',
  PIPELINE_ENGINE: 'PIPELINE_ENGINE'
};
