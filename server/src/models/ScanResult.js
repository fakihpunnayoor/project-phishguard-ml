import mongoose from 'mongoose';
import { isDbConnected } from '../config/database.js';

const scanResultSchema = new mongoose.Schema({
  url: { type: String, required: true, index: true },
  normalizedUrl: { type: String, required: true, index: true },
  domain: { type: String, required: true, index: true },
  threatScore: { type: Number, required: true, min: 0, max: 100 },
  riskCategory: {
    type: String,
    enum: ['SAFE', 'SUSPICIOUS', 'DANGEROUS'],
    required: true,
    index: true
  },
  lexicalScore: { type: Number, default: 0 },
  contentScore: { type: Number, default: 0 },
  networkScore: { type: Number, default: 0 },
  triggeredIndicators: [{
    indicator: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    severity: {
      type: String,
      enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'],
      default: 'MEDIUM'
    },
    scorePenalty: { type: Number, default: 0 }
  }],
  whoisData: {
    domainAgeDays: { type: Number, default: 0 },
    registrar: { type: String, default: 'Unknown / Private' },
    createdDate: { type: String, default: 'N/A' },
    expiresDate: { type: String, default: 'N/A' },
    nameServers: [{ type: String }]
  },
  tlsData: {
    valid: { type: Boolean, default: false },
    authorized: { type: Boolean, default: false },
    issuer: { type: String, default: 'None / Plaintext HTTP' },
    subject: { type: String, default: 'N/A' },
    validFrom: { type: String, default: 'N/A' },
    validTo: { type: String, default: 'N/A' },
    daysRemaining: { type: Number, default: 0 },
    protocol: { type: String, default: 'HTTP' }
  },
  dnsData: {
    aRecords: [{ type: String }],
    mxRecords: [{ type: Object }],
    nsRecords: [{ type: String }],
    resolved: { type: Boolean, default: false }
  },
  contentData: {
    hasPasswordInput: { type: Boolean, default: false },
    hasExternalFormAction: { type: Boolean, default: false },
    externalActionDomains: [{ type: String }],
    pageTitle: { type: String, default: '' },
    statusCode: { type: Number, default: 0 },
    isReachable: { type: Boolean, default: false }
  },
  scanDurationMs: { type: Number, default: 0 },
  clientIp: { type: String, default: '127.0.0.1' },
  scannedAt: { type: Date, default: Date.now, index: true }
}, {
  timestamps: true
});

const MongooseScanResult = mongoose.model('ScanResult', scanResultSchema);

// In-Memory resilient store for environments without MongoDB running
class MemoryScanStore {
  constructor() {
    this.records = [];
    this.idCounter = 1;
    this.seedInitialHistory();
  }

  seedInitialHistory() {
    const samples = [
      {
        url: 'http://verify-bank.com/secure/login',
        normalizedUrl: 'http://verify-bank.com/secure/login',
        domain: 'verify-bank.com',
        threatScore: 92,
        riskCategory: 'DANGEROUS',
        lexicalScore: 85,
        contentScore: 95,
        networkScore: 90,
        triggeredIndicators: [
          { indicator: 'UNENCRYPTED_AUTH', title: 'Unencrypted Authentication', description: 'Credential login form transmitted over insecure plaintext HTTP', severity: 'CRITICAL', scorePenalty: 40 },
          { indicator: 'SUSPECT_KEYWORDS', title: 'Sensitive Keywords', description: 'URL path contains targeted authentication strings ("verify", "bank", "login")', severity: 'HIGH', scorePenalty: 25 },
          { indicator: 'NEW_DOMAIN', title: 'High-Risk Domain Age', description: 'Domain registered less than 14 days ago', severity: 'HIGH', scorePenalty: 25 }
        ],
        whoisData: {
          domainAgeDays: 12,
          registrar: 'SuspectReg.com',
          createdDate: '2026-09-01',
          expiresDate: '2027-09-01',
          nameServers: ['ns1.anonymousdns.to', 'ns2.anonymousdns.to']
        },
        tlsData: {
          valid: false,
          authorized: false,
          issuer: 'None / Insecure Plaintext HTTP',
          subject: 'N/A',
          validFrom: 'N/A',
          validTo: 'N/A',
          daysRemaining: 0,
          protocol: 'HTTP/1.1'
        },
        dnsData: {
          aRecords: ['185.220.101.5'],
          mxRecords: [],
          nsRecords: ['ns1.anonymousdns.to'],
          resolved: true
        },
        contentData: {
          hasPasswordInput: true,
          hasExternalFormAction: true,
          externalActionDomains: ['exfiltrate-creds.net'],
          pageTitle: 'Bank Secure Verification Login',
          statusCode: 200,
          isReachable: true
        },
        scanDurationMs: 412,
        scannedAt: new Date(Date.now() - 3 * 60 * 1000)
      },
      {
        url: 'https://my-bank.net',
        normalizedUrl: 'https://my-bank.net',
        domain: 'my-bank.net',
        threatScore: 12,
        riskCategory: 'SAFE',
        lexicalScore: 10,
        contentScore: 5,
        networkScore: 15,
        triggeredIndicators: [
          { indicator: 'VALID_TLS', title: 'Verified TLS / SSL', description: 'Domain served with valid certificate from trusted CA', severity: 'INFO', scorePenalty: 0 }
        ],
        whoisData: {
          domainAgeDays: 3280,
          registrar: 'Cloudflare, Inc.',
          createdDate: '2017-04-15',
          expiresDate: '2028-04-15',
          nameServers: ['ns1.cloudflare.com', 'ns2.cloudflare.com']
        },
        tlsData: {
          valid: true,
          authorized: true,
          issuer: 'Cloudflare Inc ECC CA-3',
          subject: 'my-bank.net',
          validFrom: '2026-01-01',
          validTo: '2027-01-01',
          daysRemaining: 110,
          protocol: 'TLSv1.3'
        },
        dnsData: {
          aRecords: ['104.21.55.10', '172.67.180.22'],
          mxRecords: [{ exchange: 'mail.my-bank.net', priority: 10 }],
          nsRecords: ['ns1.cloudflare.com'],
          resolved: true
        },
        contentData: {
          hasPasswordInput: true,
          hasExternalFormAction: false,
          externalActionDomains: [],
          pageTitle: 'MyBank - Official Online Banking',
          statusCode: 200,
          isReachable: true
        },
        scanDurationMs: 285,
        scannedAt: new Date(Date.now() - 15 * 60 * 1000)
      },
      {
        url: 'https://safe-site.org',
        normalizedUrl: 'https://safe-site.org',
        domain: 'safe-site.org',
        threatScore: 8,
        riskCategory: 'SAFE',
        lexicalScore: 5,
        contentScore: 5,
        networkScore: 10,
        triggeredIndicators: [
          { indicator: 'ESTABLISHED_DOMAIN', title: 'Established Domain History', description: 'Domain aged > 5 years with consistent WHOIS registration', severity: 'INFO', scorePenalty: 0 }
        ],
        whoisData: {
          domainAgeDays: 4500,
          registrar: 'Public Interest Registry',
          createdDate: '2013-11-12',
          expiresDate: '2029-11-12',
          nameServers: ['a.iana-servers.net', 'b.iana-servers.net']
        },
        tlsData: {
          valid: true,
          authorized: true,
          issuer: 'DigiCert Global Root G2',
          subject: 'safe-site.org',
          validFrom: '2025-05-10',
          validTo: '2027-05-10',
          daysRemaining: 240,
          protocol: 'TLSv1.3'
        },
        dnsData: {
          aRecords: ['93.184.216.34'],
          mxRecords: [],
          nsRecords: ['a.iana-servers.net'],
          resolved: true
        },
        contentData: {
          hasPasswordInput: false,
          hasExternalFormAction: false,
          externalActionDomains: [],
          pageTitle: 'Safe Site Project Home',
          statusCode: 200,
          isReachable: true
        },
        scanDurationMs: 198,
        scannedAt: new Date(Date.now() - 35 * 60 * 1000)
      }
    ];

    samples.forEach(s => {
      s._id = `mem_${this.idCounter++}`;
      s.createdAt = s.scannedAt;
      s.updatedAt = s.scannedAt;
      this.records.unshift(s);
    });
  }

  async create(doc) {
    const newDoc = {
      ...doc,
      _id: `mem_${this.idCounter++}`,
      scannedAt: doc.scannedAt || new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.records.unshift(newDoc);
    // Keep max 200 items in memory
    if (this.records.length > 200) {
      this.records.pop();
    }
    return newDoc;
  }

  async findOne(query) {
    if (query._id) {
      return this.records.find(r => r._id === query._id) || null;
    }
    if (query.normalizedUrl) {
      return this.records.find(r => r.normalizedUrl === query.normalizedUrl) || null;
    }
    if (query.url) {
      return this.records.find(r => r.url === query.url) || null;
    }
    if (query.domain) {
      return this.records.find(r => r.domain === query.domain) || null;
    }
    return null;
  }

  async find(filter = {}, sort = { scannedAt: -1 }, limit = 20) {
    let result = [...this.records];
    if (filter.riskCategory) {
      result = result.filter(r => r.riskCategory === filter.riskCategory);
    }
    if (filter.$or) {
      result = result.filter(r => {
        return filter.$or.some(cond => {
          if (cond.url && cond.url.$regex) {
            const re = new RegExp(cond.url.$regex, cond.url.$options || 'i');
            return re.test(r.url);
          }
          if (cond.domain && cond.domain.$regex) {
            const re = new RegExp(cond.domain.$regex, cond.domain.$options || 'i');
            return re.test(r.domain);
          }
          return false;
        });
      });
    }

    // Sort by scannedAt desc
    result.sort((a, b) => new Date(b.scannedAt) - new Date(a.scannedAt));
    if (limit) {
      result = result.slice(0, limit);
    }
    return result;
  }

  async countDocuments(filter = {}) {
    if (!filter || Object.keys(filter).length === 0) {
      return this.records.length;
    }
    if (filter.riskCategory) {
      return this.records.filter(r => r.riskCategory === filter.riskCategory).length;
    }
    return this.records.length;
  }

  async getStats() {
    const total = this.records.length;
    const dangerous = this.records.filter(r => r.riskCategory === 'DANGEROUS').length;
    const suspicious = this.records.filter(r => r.riskCategory === 'SUSPICIOUS').length;
    const safe = this.records.filter(r => r.riskCategory === 'SAFE').length;
    
    // Calculate average threat score
    const avgScore = total > 0 
      ? Math.round(this.records.reduce((acc, r) => acc + (r.threatScore || 0), 0) / total)
      : 0;

    return {
      total,
      dangerous,
      suspicious,
      safe,
      avgScore
    };
  }
}

const memoryStore = new MemoryScanStore();

// Universal Repository Interface
export const ScanRepository = {
  async create(data) {
    if (isDbConnected()) {
      try {
        const item = new MongooseScanResult(data);
        return await item.save();
      } catch (err) {
        console.warn('MongoDB save failed, falling back to memory store:', err.message);
        return await memoryStore.create(data);
      }
    }
    return await memoryStore.create(data);
  },

  async findOne(query) {
    if (isDbConnected()) {
      try {
        const found = await MongooseScanResult.findOne(query).sort({ scannedAt: -1 }).lean();
        if (found) return found;
      } catch (err) {
        console.warn('MongoDB findOne failed, falling back to memory store:', err.message);
      }
    }
    return await memoryStore.findOne(query);
  },

  async findRecent(filter = {}, limit = 30) {
    if (isDbConnected()) {
      try {
        const items = await MongooseScanResult.find(filter)
          .sort({ scannedAt: -1 })
          .limit(limit)
          .lean();
        return items;
      } catch (err) {
        console.warn('MongoDB findRecent failed, falling back to memory store:', err.message);
      }
    }
    return await memoryStore.find(filter, { scannedAt: -1 }, limit);
  },

  async findById(id) {
    if (isDbConnected() && !id.startsWith('mem_')) {
      try {
        const item = await MongooseScanResult.findById(id).lean();
        if (item) return item;
      } catch (err) {
        console.warn('MongoDB findById failed, falling back to memory store:', err.message);
      }
    }
    return await memoryStore.findOne({ _id: id });
  },

  async getAggregatedStats() {
    if (isDbConnected()) {
      try {
        const [total, dangerous, suspicious, safe] = await Promise.all([
          MongooseScanResult.countDocuments(),
          MongooseScanResult.countDocuments({ riskCategory: 'DANGEROUS' }),
          MongooseScanResult.countDocuments({ riskCategory: 'SUSPICIOUS' }),
          MongooseScanResult.countDocuments({ riskCategory: 'SAFE' })
        ]);
        const avgResult = await MongooseScanResult.aggregate([
          { $group: { _id: null, avgScore: { $avg: '$threatScore' } } }
        ]);
        const avgScore = avgResult.length > 0 ? Math.round(avgResult[0].avgScore) : 0;
        return { total, dangerous, suspicious, safe, avgScore };
      } catch (err) {
        console.warn('MongoDB aggregate stats failed, falling back to memory store:', err.message);
      }
    }
    return await memoryStore.getStats();
  }
};

export default MongooseScanResult;
