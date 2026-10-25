# SMARTWASTE – Smart Waste Segregation, Awareness and Tracking Platform
**Government of Karnataka Focused Municipal Waste Management Application**

---

## 🌿 Overview
**SMARTWASTE** is a full-stack municipal civic platform engineered to promote source segregation, empower citizens to report waste dumps with GPS and photo evidence, enable doorstep collection for bulk/e-waste, provide real-time grievance tracking, and give municipal officers powerful operational workflows.

---

## 🏛️ Key Features

### 1. Government of Karnataka Integration & Visual Identity
- Official Karnataka header with state colors (`#DC2626`, `#F59E0B`, `#166534`, `#0F172A`)
- Cascading administrative hierarchy: **State → District → Taluk → City/Zone → Ward/Locality → Street**
- Pre-populated with verified Karnataka municipal entities (BBMP Bengaluru, Mysuru MCC, Mangaluru, Hubballi-Dharwad, Belagavi, Tumakuru)
- Transparent academic scope disclosure adhering to major project guidelines.

### 2. Tri-Role Access Control (RBAC)
- **Citizen**:
  - 8-step waste complaint reporting with GPS detection and photo evidence
  - Capacity-checked doorstep bulk and recyclable pickup requests
  - Real-time status tracker with verification timeline
  - 5-star cleanup satisfaction feedback
  - Eco-Points and Badges (Green Citizen, Segregation Master, Active Reporter)
- **Waste Collection Staff**:
  - Beat assignment view (today's schedule and priority tasks)
  - Status updates: Dispatched / In Progress / Complete
  - Upload "After Collection" proof photo and record collected waste weight in Kg
- **Administrator (IAS / Municipal Commissioner)**:
  - Live database-backed analytics and performance charts
  - Complaint verification queue (Verify, assign staff with priority & SLA due date, or reject with reason)
  - Staff management & secure provisioning
  - Tamper-evident municipal audit trail
  - CSV exports for complaints and pickups

### 3. Waste Segregation Awareness & 14 Streams
- Comprehensive educational manuals for all 14 waste streams:
  1. Wet / Biodegradable Waste (Green Bin)
  2. Dry / Recyclable Waste (Blue Bin)
  3. Paper and Cardboard
  4. Plastic Waste
  5. Glass Waste
  6. Metal Waste
  7. E-Waste (Electronic Waste)
  8. Sanitary Waste (Red Cross wrapper)
  9. Domestic Hazardous Waste
  10. Garden and Green Waste
  11. Construction and Demolition (C&D) Waste
  12. Bulky Waste
  13. Biomedical Waste
  14. Other / Mixed Waste (Inert reject)
- **Interactive Waste Sorting Game**: Drag and drop 10 waste items into Green, Blue, Red, or Black bins with real-time scoring and sound/visual effects.
- **Multiple-Choice Segregation Quiz**: 10 randomized interactive questions with instant scoring, explanations, and badge awarding.
- **Home Composting & 3R Guide**: Step-by-step guidance on nitrogen (greens) and carbon (browns) composting.

### 4. Multilingual Support
Full translation dictionary across:
- **English**
- **ಕನ್ನಡ (Kannada)**
- **हिन्दी (Hindi)**

---

## 🔑 Test Demo Accounts

For demonstration and evaluation, the following pre-seeded test accounts can be accessed via the 1-click credential buttons in the Sign In dialog:

| Role | Name | Email | Password |
|---|---|---|---|
| **Administrator** | Dr. Ramesh Narayan (IAS) | `admin.smartwaste@karnataka.gov.in` | `SmartWaste@2026` |
| **Collection Staff** | Manjunath Gowda | `manjunath.gowda@smartwaste.org` | `SmartWaste@2026` |
| **Citizen** | Priyanka Shettigar | `priyanka.shettigar@gmail.com` | `SmartWaste@2026` |

---

## 🚀 Running & Developing

```bash
# Install dependencies
npm install

# Start development full-stack server (runs on http://0.0.0.0:3000)
npm run dev

# Build production bundle
npm run build

# Start production server
npm start
```
