# SHA-256 Hash Lab – Secure Text & File Hash Generator

> **Cryptography and Network Security (CNS) Mini Project**  
> *A visual, beginner-friendly, and interactive laboratory demonstrating one-way cryptographic hashing, data integrity, and the avalanche effect.*

---

## 🌟 What Makes This Project Easy to Understand?

Most cryptography demonstrations are filled with dense math and complex technical jargon. This project breaks down **SHA-256** into visual, tangible concepts that anyone can grasp in 60 seconds:

### 1. 🍓 The Fruit Smoothie Analogy (Why Hashing is "One-Way")
> *You can blend strawberries, bananas, and milk into a smoothie in 5 seconds. But you can NEVER un-blend the smoothie back into fresh strawberries!*  
> That is why SHA-256 is an irreversible **one-way function**.

### 2. 👆 The Human Fingerprint Analogy (Why Every File Has a Unique Hash)
> *Just like every human has a unique fingerprint, every file on a computer has a 64-character SHA-256 fingerprint. If an attacker changes even 1 pixel in a photo or 1 comma in a 500-page document, the fingerprint changes completely.*

### 3. 📦 The Tamper-Evident Seal Analogy (Data Integrity)
> *Think of the safety seal on a medicine bottle or an Amazon delivery package. When you download a file, you check its SHA-256 seal. If the seal matches, nobody infected or altered your file.*

---

## 🚀 Live Interactive Modes

The application features a clean, tabbed navigation bar allowing you to explore one concept at a time without feeling overwhelmed:

| Mode Tab | What It Does | Why It Matters in CNS |
| :--- | :--- | :--- |
| **1. Visual Guide** | Live 5-Step machine (Input $\rightarrow$ Binary $\rightarrow$ Padding $\rightarrow$ 64-Round Blender $\rightarrow$ 64-character Hash) | Shows the internal lifecycle of how raw text becomes a digest. |
| **2. Text Hasher** | Type any sentence to get its 64-character SHA-256 digest with live speed and copy buttons. | Demonstrates determinism and fixed 256-bit output length. |
| **3. File Checksum** | Drag and drop any file (`.pdf`, `.png`, `.zip`, `.exe`) to compute its digital fingerprint in RAM. | Demonstrates software download verification and malware detection. |
| **4. Tamper Detector** | Compares two hashes side-by-side with a 🟢 **MATCH** or 🔴 **MISMATCH** alert, plus a *"Simulate Hacker Tampering"* button! | Demonstrates cryptographic data integrity and man-in-the-middle detection. |
| **5. Avalanche Effect** | Side-by-side comparison where changing 1 letter flips $\approx 50\%$ of all bits in the output hash. | Demonstrates the Strict Avalanche Criterion (SAC) and Shannon diffusion. |

---

## 🛠️ Technology Stack

- **Frontend:** HTML5, Modern CSS3 (Dark Cyber Theme, responsive grid, neon accents)
- **Programming:** Vanilla JavaScript (ES6+)
- **Cryptographic Engine:** Browser-native **W3C Web Crypto API (`window.crypto.subtle`)**
- **Architecture:** 100% Client-Side (Zero server dependencies, completely offline-capable)

---

## 📂 Project Structure

```text
d:\cns project\
├── index.html            # Main web application dashboard & tabbed visualizer
├── css/
│   └── style.css         # Modern, high-contrast dark cybersecurity styles
├── js/
│   ├── crypto-engine.js  # Clean cryptographic utilities (Web Crypto API wrapper)
│   └── app.js            # Interactive UI controller, tab switching, and visualizer
└── README.md             # Project documentation & presentation guide
```

---

## 🏃 How to Run the Project

The project is already live on your local machine:
- 🌐 **Browser URL:** `http://localhost:8000`
- 📁 **Direct File Launch:** Double-click [index.html](file:///d:/cns%20project/index.html) in Windows File Explorer.

---

**Course:** Cryptography and Network Security (CNS)  
**Deliverable:** Working Web Application + Visual Educational Mini Project
