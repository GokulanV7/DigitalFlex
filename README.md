# 🌟 Evaltree - Premium Digital Collectibles Platform 🌟

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)

Welcome to **Evaltree**, the ultimate blockchain-powered platform for creating, trading, and collecting unique digital assets! 🚀 Join exclusive raffles and unlock premium membership tiers to experience the future of digital ownership.

## 🎯 What is Evaltree?

Evaltree is a cutting-edge web application designed to revolutionize how you interact with digital collectibles. Whether you're an artist, collector, or trader, Evaltree offers a seamless experience with powerful features backed by a robust frontend and backend architecture. Dive in and explore! 🕹️

## 📂 Project Structure

Here's a quick overview of how our project is organized. Curious about a specific component? Click to learn more!

- **`/frontend`** - All frontend-related files and assets, the heart of the user experience!
  - **`/src`** - Frontend source code.
    - **`/components`** - Reusable UI elements.
      - `Chatbot.tsx` - Meet Eva, your Evaltree assistant! 🤖
      - `CollectibleCard.tsx` - Stunning cards for each collectible.
      - `MarketOrders.tsx` - Real-time market data at your fingertips.
    - **`/pages`** - Main routes of the app.
      - `Marketplace.tsx` - Browse and buy collectibles! 🛒
      - `Trading.tsx` - Trade with real-time charts. 📈
      - `Dashboard.tsx` - Your personal hub. 📊
    - **`/integrations/supabase`** - Database and auth magic with Supabase.
  - **`/public`** - Static assets like icons and images.
    - `favicon.ico` - Our shiny favicon! ✨
  - **Configuration Files** - Build and style configurations like `vite.config.ts`, `tailwind.config.ts`, and more.
- **`/backend`** - Backend server logic to power Evaltree's operations.
  - `server.js` - Main backend file handling API requests, including chat integration and Stripe payments. 💳
  - `.env` - Environment variables for sensitive backend configurations (not committed to Git).
- **`/supabase`** - Configuration and migrations for our backend database.
  - **`/migrations`** - Database schema updates and triggers.
  - **`/functions`** - Edge functions like Stripe checkout.

Want to explore the full structure? Clone the repo and dive into the code! 🔍

## 🛠️ Technologies We Use

We're built on a modern tech stack to ensure speed, reliability, and scalability across frontend and backend:

### Frontend Technologies
- **Vite** - Lightning-fast build tool. ⚡
- **TypeScript** - Strongly typed JavaScript for safer coding. 🛡️
- **React** - Dynamic user interfaces. 🎨
- **Tailwind CSS** - Styling made easy and beautiful. 💅
- **Supabase Client** - Seamless integration with backend services. 🔗

### Backend Technologies
- **Node.js** - Server-side JavaScript runtime. 🌐
- **Express** - Fast, unopinionated web framework for Node.js. 🚀
- **Stripe** - Secure payments for your collectibles. 💳
- **Supabase** - Backend-as-a-Service for auth and database. 🔒
- **Groq API** - AI-powered chat assistance for trading strategies. 🧠

## 🚀 Get Started Now!

Ready to join the Evaltree community? Follow these steps to run the project locally:

### Prerequisites
- **Node.js & npm**: Ensure you have Node.js installed. [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Setup Instructions
1. **Clone the Repo**:
   ```bash
   git clone <YOUR_GIT_URL>
   cd Interproject
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   - For frontend: Add Supabase and Stripe publishable keys to `frontend/.env`. Check `.env.example` for guidance.
   - For backend: Add Supabase, Stripe secret key, and Groq API key to `backend/.env`. Ensure this file is not committed to Git.

4. **Run the Backend Server**:
   ```bash
   cd backend && node server.js
   ```
   Ensure it's running on the port specified in your environment (default: 3002).

5. **Run the Frontend Development Server**:
   Open a new terminal tab:
   ```bash
   cd frontend && npm run dev
   ```
   Open `http://localhost:5173` to see Evaltree in action! 🌐

## ✨ Key Features

- **Create Collectibles** - Mint your own digital assets. 🎨
- **Trade & Marketplace** - Buy, sell, and trade with ease. 💹
- **Exclusive Raffles** - Win rare collectibles! 🎰
- **User Dashboard** - Track your collection and stats. 📈
- **Secure Payments** - Powered by Stripe for peace of mind. 🔐
- **AI Chat Assistant** - Get trading advice from Eva, powered by Groq API. 🤖

## 🤝 Contribute to Evaltree

Love Evaltree? Help us make it even better! Here's how to contribute:

1. Fork this repository. 🍴
2. Create a branch for your feature (`git checkout -b feature/awesome-feature`).
3. Commit your changes (`git commit -m 'Add awesome feature'`).
4. Push to your branch (`git push origin feature/awesome-feature`).
5. Open a Pull Request. 🙌

## 📬 Contact Us

Have questions or ideas? Reach out to the Evaltree team! Drop us a message or join our community (links coming soon). 💬

## © 2024 Evaltree

All rights reserved. Built with passion for Alatree Ventures internship showcase. 💜
