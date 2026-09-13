# PhishGuard – Full-Stack Threat Intelligence & URL Analysis Platform

PhishGuard is a high-performance, cybersecurity operations center (SOC) platform designed for autonomous real-time URL threat intelligence, structural heuristic feature extraction, cryptographic validation, and multi-factor threat classification.

---

## 🛡️ Key Features

### 1. Automated Feature Extraction & Heuristic Engine
- **IP Hostname Detection:** Identifies IPv4/IPv6, hex, and octal address schemes used to bypass domain reputation.
- **Lexical Analysis:** Detects excessive URL length, suspicious double slashes (`//`), credential spoofing (`@` symbols), non-standard ports, and brand-squatting hyphens.
- **Sensitive Keyword Correlation:** Identifies authentication tokens (`login`, `verify`, `bank`, `wallet`, `security`, `credential`, etc.).
- **High-Risk TLD Weighting:** Flags domains on historically malicious or low-regulation TLDs (`.top`, `.xyz`, `.cam`, `.buzz`, `.tk`, `.ml`, `.ga`, `.cf`, `.gq`).
- **Homograph & Punycode:** Detects `xn--` and mixed-script lookalike character deceptions.

### 2. Infrastructure & Network Safety Verification
- **DNS Resolution:** Live lookup of A, AAAA, MX, and NS records via Node's asynchronous DNS engine.
- **TLS / SSL Cryptographic Audit:** Inspects cipher suites, certificate validity, expiration dates, days remaining, and detects plaintext HTTP authentication traps.
- **WHOIS & RDAP Intelligence:** Resolves registrar identity, registration timestamp, and domain age. Domains under 14 days old receive critical risk escalation.
- **DOM & Content Inspection:** Analyzes webpage markup using Cheerio to detect password input forms on HTTP and cross-domain credential exfiltration actions.

### 3. Multi-Layer Threat Scoring (0–100)
- **Composite Score Formula:** Weighted formula combining Lexical (40%), Network Infrastructure (35%), and Page Content (25%) heuristics.
- **Risk Categorization:**
  - `SAFE`: 0–29 (Green glow, verified infrastructure)
  - `SUSPICIOUS`: 30–69 (Amber alert, elevated risk profile)
  - `DANGEROUS`: 70–100 (Neon crimson/orange 3D badge, critical indicators)

### 4. High-Performance Caching & Resilience Architecture
- **Redis Cache (ioredis):** Checks domain scan results in Redis with a 3600s (1h) TTL before invoking the pipeline.
- **Graceful Fallback:** If Redis is offline, seamlessly switches to an in-memory LRU cache.
- **Database Persistence (Mongoose):** Records persisted to MongoDB. If MongoDB is disconnected, operates transparently with an in-memory store so the application runs standalone with zero setup friction.

### 5. Cyberpunk SOC UI (React + Tailwind CSS)
- Dark obsidian glassmorphic theme (`#070b12`, `#0b0f19`, `#0f172a`).
- Real-time 3D faceted Hexagonal Danger Badge with neon flaming glow.
- Dual speedometer circular SVG gauges for Lexical and Content analysis.
- Vertical LED audio-style spectrum level meters (10 to 60+).
- Real-Time Audit Log Table with search filtering, status tags, and forensic breakdown inspection.
- Interactive System Architecture Visualizer matching the operational pipeline diagram.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- *(Optional)* Redis and MongoDB (the system gracefully operates in-memory if daemons are not running)

### Single-Command Launch (Monorepo)
```bash
# 1. Install all dependencies across monorepo
npm run install:all

# 2. Launch both Server (Port 5000) and Client (Port 5173) concurrently
npm run dev
```

### Manual Service Spin-up
#### Backend:
```bash
cd server
npm install
npm run dev
# Server listens on http://localhost:5000
```

#### Frontend:
```bash
cd client
npm install
npm run dev
# Client preview available on http://localhost:5173
```

---

## 📡 API Reference

### `POST /api/scan`
Analyzes target URL and returns full threat report.
- **Request Body:**
  ```json
  {
    "url": "http://verify-bank.com/secure/login"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "cached": false,
    "cacheSource": "PIPELINE_ENGINE",
    "scanDurationMs": 412,
    "data": {
      "url": "http://verify-bank.com/secure/login",
      "domain": "verify-bank.com",
      "threatScore": 92,
      "riskCategory": "DANGEROUS",
      "lexicalScore": 85,
      "contentScore": 95,
      "networkScore": 90,
      "triggeredIndicators": [
        {
          "indicator": "UNENCRYPTED_AUTH",
          "title": "Unencrypted Authentication",
          "description": "Credential login form transmitted over insecure plaintext HTTP",
          "severity": "CRITICAL",
          "scorePenalty": 40
        }
      ],
      "whoisData": {
        "domainAgeDays": 12,
        "registrar": "SuspectReg.com",
        "createdDate": "2026-09-01"
      },
      "tlsData": {
        "valid": false,
        "protocol": "HTTP/1.1"
      }
    }
  }
  ```

### `GET /api/history`
Fetches recent scan history. Supports query parameters `?category=DANGEROUS` and `?search=keyword`.

### `GET /api/stats`
Returns aggregated metrics: total scans, safe, suspicious, dangerous counts, and platform average score.

### `GET /api/scan/:id`
Retrieves detailed breakdown for a specific historical audit ID.

### `GET /api/health`
Health and infrastructure status of Redis cache, MongoDB database, and system uptime.
