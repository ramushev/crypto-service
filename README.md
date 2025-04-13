# Crypto Service

A tiny microservice providing **authenticated encryption** and **decryption** (AES‑256‑GCM) via a simple HTTP API. Ideal for centralizing your encryption policy, isolating CPU‑bound crypto work, and scaling independently.

---

## Table of Contents

- [Features](#features)  
- [Prerequisites](#prerequisites)  
- [Installation](#installation)  
- [Configuration](#configuration)  
- [Running the Service](#running-the-service)  
- [API Reference](#api-reference)  
  - [Health Check](#health-check)  
  - [Encrypt](#encrypt)  
  - [Decrypt](#decrypt)  
- [Usage Examples](#usage-examples)  
- [Docker](#docker)  
- [License](#license)  

---

## Features

- **AES‑256‑GCM** authenticated encryption (confidentiality + integrity)  
- Stateless, no external dependencies or databases  
- Versioned under `/v1/` for future algorithm support  
- Zero‑downtime rolling updates via `/health` probe  
- Pure Node.js using built‑in `crypto` module  

---

## Prerequisites

- Node.js ≥ 18  
- npm 
- A 32‑byte hex‑encoded encryption key  

---

## Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/your-org/crypto-service.git
   cd crypto-service
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

## Configuration

The service requires a single environment variable:

| Variable     | Description                                    | Example                                 |
|--------------|------------------------------------------------|-----------------------------------------|
| `CRYPTO_KEY` | 32‑byte hex‑encoded key for AES‑256‑GCM (64 hex chars) | `export CRYPTO_KEY=4f3c2a1b...` |

Make sure to keep this key secret and rotate it via your secrets manager.

---

## Running the Service

```bash
export CRYPTO_KEY=<your-64-hex-char-key>
npm start
```

By default, the service listens on port `3000`. You can override with:

```bash
PORT=8080 npm start
```

Key generation example: `openssl rand -hex 32`


---

## API Reference

### Health Check

- **Endpoint:** `GET /health`  
- **Response:**
  ```json
  { "status": "ok" }
  ```

---

### Encrypt

- **Endpoint:** `POST /v1/encrypt`  
- **Headers:** `Content-Type: application/json`  
- **Body:**
  ```json
  {
    "text": "Hello, world!",
    "aad": "optional AAD string"
  }
  ```
- **Response:**
  ```json
  {
    "algorithm": "aes-256-gcm",
    "iv":        "<base64 IV>",
    "authTag":   "<base64 auth tag>",
    "ciphertext":"<base64 ciphertext>"
  }
  ```

---

### Decrypt

- **Endpoint:** `POST /v1/decrypt`  
- **Headers:** `Content-Type: application/json`  
- **Body:**
  ```json
  {
    "iv":         "<base64 IV>",
    "authTag":    "<base64 auth tag>",
    "ciphertext": "<base64 ciphertext>",
    "aad":        "same AAD string"
  }
  ```
- **Response:**
  ```json
  { "text": "Hello, world!" }
  ```

---

## Usage Examples

### Encrypt

```bash
curl -X POST http://localhost:3000/v1/encrypt \
  -H "Content-Type: application/json" \
  -d '{
        "text": "Top secret data",
        "aad":  "session-1234"
      }'
```

### Decrypt

```bash
curl -X POST http://localhost:3000/v1/decrypt \
  -H "Content-Type: application/json" \
  -d '{
        "iv":         "3q2+7w==",
        "authTag":    "XyZabc123==",
        "ciphertext": "QWxhZGRpbjpPcGVuU2VzYW1l",
        "aad":        "session-1234"
      }'
```

---

## Docker

Build and run with Docker:

```bash
export CRYPTO_KEY=<your-64-hex-char-key>
docker build -t crypto-service:1.0.0 .
docker run -p 3000:3000 \
  -e CRYPTO_KEY \
  crypto-service:1.0.0
```

---

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT License.  
