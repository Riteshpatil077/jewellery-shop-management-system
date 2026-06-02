<div align="center">

# 💍 श्री कृष्णा ज्वेलर्स
### Shree Krishna Jewellers — Smart Jewelry Shop Management System

[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20PostgreSQL-blue?style=for-the-badge)](#)
[![ORM](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma)](#)
[![License](https://img.shields.io/badge/License-MIT-gold?style=for-the-badge)](#)
[![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=for-the-badge)](#)

> *"शुद्धतेची आणि विश्वासाची परंपरा"*
> A tradition of purity and trust — now powered by modern technology.

---

</div>

## 📖 Overview

**श्री कृष्णा ज्वेलर्स** is a full-featured, bilingual (Marathi + English) jewelry shop management system built for real-world use. It empowers jewelry shop owners to manage their inventory, daily transactions, customer accounts, loans, and profit analysis — all from a single, beautiful dashboard.

Designed to run seamlessly on **mobile** and **desktop** browsers, it's fast, intuitive, and built for the busy jeweler who needs information at their fingertips.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🛒 Transaction Management
- Record **Sales**, **Purchases**, and **Orders**
- Built-in **Exchange (मोड)** with purity & fine weight calculation
- Track advance payments and balance amounts
- WhatsApp & Email order sharing 📱

</td>
<td width="50%">

### 📊 Profit & Loss Analysis
- Real-time profit dashboard
- Per-item profit receipt with print support 🖨️
- Auto-fetch purchase rate from inventory
- Compare buy vs sell rates instantly

</td>
</tr>
<tr>
<td>

### 💎 Inventory Management
- Product catalog with metal type, weight, rate per gram
- Stock availability tracking
- Linked to sales for auto-fill & profit tracking

</td>
<td>

### 👥 Customer Management
- Full customer profiles with Aadhaar & mobile
- Transaction history per customer
- Business volume tracking

</td>
</tr>
<tr>
<td>

### 🏦 Loan & Collateral Tracking
- Record gold/silver collateral items
- Interest calculation with repayment tracking
- Active / Closed / Defaulted loan status

</td>
<td>

### 📅 Collections / EMI Plans
- Monthly installment tracking
- Advance payment recording
- Due date reminders

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TailwindCSS, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **API** | RESTful JSON API |
| **Print** | Browser Native Print API |
| **Share** | WhatsApp Deep Link, `mailto:` Protocol |

---

## 📂 Project Structure

```
श्री कृष्णा ज्वेलर्स/
├── 📁 backend/
│   ├── 📁 prisma/
│   │   └── schema.prisma         # Database schema
│   ├── 📁 routes/
│   │   ├── transactions.js       # Sales, Purchase, Order APIs
│   │   ├── products.js           # Inventory APIs
│   │   ├── customers.js          # Customer APIs
│   │   ├── loans.js              # Loan management
│   │   ├── collections.js        # EMI installments
│   │   └── reports.js            # Report generation
│   ├── seed.js                   # Database seeder
│   └── server.js                 # Express server entry
│
├── 📁 frontend/
│   └── 📁 src/
│       ├── 📁 pages/
│       │   ├── Transactions.jsx  # Daily transactions + Profit receipt
│       │   ├── Dashboard.jsx     # Overview & metrics
│       │   ├── Products.jsx      # Inventory management
│       │   ├── Customers.jsx     # Customer management
│       │   ├── Loans.jsx         # Loan tracking
│       │   ├── Collections.jsx   # EMI / installment plans
│       │   └── Reports.jsx       # Business reports
│       ├── 📁 services/
│       │   └── api.js            # Axios API service layer
│       └── App.jsx               # Main app with routing
│
├── .gitignore
└── README.md                     # You are here!
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **PostgreSQL** v14+
- **npm** or **yarn**

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Riteshpatil077/jewellery-shop-management-system.git
cd jewellery-shop-management-system
```

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/krishna_jewellers?schema=public"
PORT=5000
```

Push the database schema:

```bash
npx prisma db push
```

(Optional) Seed with sample data:

```bash
node seed.js
```

Start the backend server:

```bash
node server.js
```

### 3️⃣ Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

🎉 Open **http://localhost:5173** in your browser!

---

## 📱 Mobile Support

This system is designed **mobile-first**. Access it from any smartphone browser on your local network:

```
http://<your-computer-ip>:5173
```

Key mobile features:
- Touch-friendly buttons and form inputs
- Swipeable transaction list
- WhatsApp order sharing in one tap
- Print to thermal printer via mobile Chrome

---

## 🖨️ Print Features

| Receipt Type | Description |
|---|---|
| **नफा रसीद** (Profit Receipt) | Per-item profit breakdown with signatures |
| **Order Sheet** | Customer order details for WhatsApp/Email |

Print behavior:
- Modal hides navigation & UI chrome automatically
- Black & white optimized for thermal/ink printers
- Signature lines included for authorization

---

## 📊 Key Business Modules

### 💹 Profit Calculation Formula

```
नफा (Profit) = ((विक्री दर - खरेदी दर) × वजन) + मजुरी
```

```
Profit = ((Sale Rate - Purchase Rate) × Weight) + Making Charges
```

### 🔄 Exchange (मोड) Calculation

```
Fine Weight = Exchange Weight × (Purity % / 100)
Exchange Value = Fine Weight × Today's Rate
```

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Backend server port (default: 5000) |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Developer

**Ritesh Patil**
- 🐙 GitHub: [@Riteshpatil077](https://github.com/Riteshpatil077)

---

## 📄 License

This project is licensed under the **MIT License** — free to use for personal and commercial purposes.

---

<div align="center">

**Built with ❤️ for श्री कृष्णा ज्वेलर्स**

*"Technology at the service of tradition"*

⭐ If this project helped you, give it a star!

</div>
