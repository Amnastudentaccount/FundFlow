# 💸 FundFlow

### AI-Powered Group Payments & Family Fund

FundFlow is an AI-powered financial agent that manages family money pools, pays emergency bills, tracks loans, and enforces hard spending rules with a one-tap kill switch.

> Built for the **PayPal Hackathon**.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Local Setup](#-local-setup)
- [Limitations & Notes for Judges](#️-limitations--notes-for-judges)
- [Sponsor Tools Used](#-sponsor-tools-used)

---

## 🚀 Key Features

| Feature | Description |
|---|---|
| **Emergency Bill Scanning** | Upload a medical bill and the AI (DeepRead API + Claude) extracts vendor details, amounts, and due dates instantly. |
| **Smart Buy (AI Shopping)** | Ask Steward AI (powered by the Channel3 API) to find products from natural-language queries, e.g. *"Find a good phone for my mom under $250."* |
| **Family Loans & Schedule** | Track money lent to family members with automated installment schedules. |
| **Contribute & Pool** | Add money to the family pool using the PayPal Sandbox. |
| **Kill Switch** | A one-tap safety button that instantly pauses all automated AI actions and voids pending PayPal authorizations. |
| **Trust Log** | A complete, immutable audit trail of every contribution, payment, and AI decision. |

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS (exported from Figma)

**Backend**
- Python (FastAPI)
- SQLModel

**Database**
- PostgreSQL (via Docker)

**AI & APIs**
- **DeepRead API**: vision/OCR for bill scanning
- **Anthropic Claude**: AI reasoning and fallback extraction
- **Channel3 API**: real-time product search
- **PayPal Sandbox**: Orders, Payouts, and Invoicing (adapter pattern with Mock and Real clients)

**Deployment**
- Docker & Render

---

## 💻 Local Setup

### Prerequisites

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)
- Python 3.10+
- Node.js and [pnpm](https://pnpm.io/)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/FundFlow.git
cd FundFlow
```

### 2. Configure environment variables

Create a `.env` file in the `backend/` directory:

```env
# PayPal Settings
PAYPAL_MOCK_MODE=true
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com

# AI Settings
ANTHROPIC_API_KEY=
DEEPREAD_API_KEY=

# Channel3 Settings (Product Search)
CHANNEL3_API_KEY=

# Database URL
DATABASE_URL=postgresql://fundflow:fundflow@localhost:5432/fundflow
```

### 3. Start the database

```bash
docker compose up -d db
```

### 4. Run the backend (FastAPI)

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```

The backend runs at **http://localhost:8000**.

### 5. Run the frontend (React + Vite)

In a new terminal:

```bash
cd frontend
pnpm install
pnpm dev
```

The frontend runs at **http://localhost:5173**.

---

## ⚠️ Limitations & Notes for Judges

- **PayPal Sandbox availability:** The PayPal Sandbox is not officially available in Pakistan, so our demo video and live testing primarily run on `MockPayPalClient`. It simulates the exact API flow (`CREATED → AUTHORIZED → CAPTURED / VOIDED`).
- **Real client:** `RealPayPalClient` is fully implemented in `backend/paypal/real_client.py`. Provide valid Sandbox credentials in `.env` and set `PAYPAL_MOCK_MODE=false`, and the app will automatically make real PayPal API calls.
- **AI fallbacks:** To keep the demo from breaking on API rate limits or errors (e.g. Anthropic/Gemini 503s), our AI endpoints use `try/except` fallbacks that return mock data if an upstream API fails.

---

## 🏆 Sponsor Tools Used

- **Channel3 API:** powers the Smart Buy agentic product search.
- **DeepRead API:** provides accurate OCR for bill scanning.
- **Docker:** consistent local development and deployment.

---

<p align="center">Built with ❤️ for the PayPal Hackathon.</p>
