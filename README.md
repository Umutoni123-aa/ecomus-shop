# Ecomus Shop

A simple e-commerce web app built with React, Tailwind CSS, Axios, and TanStack Query.

## Tech Stack

- React 19
- React Router v7
- Tailwind CSS
- Axios
- TanStack Query
- React Hot Toast
- Vite

## Setup

```bash
git clone https://github.com/Umutoni123-aa/ecomus-shop
cd ecomus-shop
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=https://e-commas-apis-production-e0f8.up.railway.app
```

Run the project:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Features

- Browse products
- Search and filter products
- View product details
- Add, update, and remove cart items
- Checkout and place orders
- View order history
- Loading, empty, and error states

## State Management

- **TanStack Query:** Products, cart, and orders
- **useState:** Search, quantity, and other UI data

## Challenge

Some products had no variants, but the API required a `variantId`. I solved this by automatically creating a default variant when needed, so adding to the cart always works.

## Notes

- Product IDs use `id` instead of `_id`.
- The `.gitignore` file excludes `node_modules` and `.env`.