# 🧩 Bundle Challenge – Dev Guide

This project is composed of two parts:

- **Frontend**: Theme extension using a Web Component for product bundles.
- **Backend**: Shopify Functions (CartTransform) and Checkout UI Extensions.

---

## 🖼 Frontend (Theme)

**Repository:**  
🔗 [https://github.com/domarenon/bundle-challenge-template](https://github.com/domarenon/bundle-challenge-template)

**Live Preview Theme:**  
🔗 [https://bundle-challenge-template.myshopify.com/?preview_theme_id=144702144678](https://bundle-challenge-template.myshopify.com/?preview_theme_id=144702144678)  
🔒 **Store Password**: `yeofig`

### 🛠 How to work with the theme

1. Clone the repository:

git clone https://github.com/domarenon/bundle-challenge-template
cd bundle-challenge-template

2. Make sure the Shopify CLI is installed:

npm install -g @shopify/cli

3. Authenticate and pull the theme:

shopify login
shopify theme pull --store bundle-challenge-template.myshopify.com

4. Start the development server:

shopify theme dev --store bundle-challenge-template.myshopify.com

✅ Important: Any change must be made in a new branch based on main and submitted as a Pull Request.

## 🧠 Backend (Functions & Checkout UI)

**Repository:** 
🔗 [https://github.com/domarenon/bundle-backend](https://github.com/domarenon/bundle-backend)

### 🔌 Related Pull Requests

🛒 Shopify Function (CartTransform) – Bundle Discount
PR: [https://github.com/domarenon/bundle-backend/pull/1](https://github.com/domarenon/bundle-backend/pull/1)

🎉 Checkout UI Extension – Discount Banner
PR: [https://github.com/domarenon/bundle-backend/pull/2](https://github.com/domarenon/bundle-backend/pull/2)

### 🛠 How to work with the backend

1. Clone the repository:

git clone https://github.com/domarenon/bundle-backend
cd bundle-backend

2. Chose the app:

cd checkout-banner 
or
cd bundle-function

3. Install dependencies:

npm install

4. Start the development environment:

npm run dev

5. Build and deploy (if needed):

npm run build
or
npm run deploy

## 📌 Final Notes

### Make sure to log in with the Shopify CLI before using dev or deploy