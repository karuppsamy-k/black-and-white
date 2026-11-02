# black-and-white

# Black & White - Traditional Sweets & Snacks Multi-Module Web Platform

A comprehensive, scalable multi-module e-commerce web platform for authentic South Indian traditional sweets, savories, and bakery delicacies.

Built with **React.js**, **Vite**, **Tailwind CSS**, and **Firebase** (Authentication & Cloud Firestore).

---

## 🌟 Modules Overview

The application is structured into three dedicated modules sharing a unified Firebase backend:

1. **Customer Module**:
   - Clean, traditional aesthetic with sweets & snacks catalog.
   - City and shop browsing, category filtering, search, and sweet details.
   - Cart, order placement, real-time tracking, and customer address management.
   - Secure customer authentication with 10-digit mobile number and password.
   - Dedicated access point to the **Shopkeeper Portal**; all administrator navigation is strictly hidden.

2. **Shopkeeper Module** (`/shopkeeper/login`):
   - Dedicated portal for sweet shop merchants and confectioneries.
   - Mobile-based login with status gating (`Approved`, `Pending`, `Rejected`, `Deactivated`).
   - Merchant registration with business details, city, and FSSAI license compliance.
   - Merchant dashboard for inventory management, order fulfillment, sales reports, and store profile.

3. **Admin Module** (`/admin/login`):
   - Secure back-office operations for platform governance.
   - **Customer Management**: View customer profiles, contact numbers, order histories, and account status toggles.
   - **Shopkeeper Management**: Merchant verification, FSSAI compliance auditing, city filtering, and store activation.
   - **Shop Approvals**: Review and approve/reject new confectionery applications.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router DOM v6
- **Styling**: Tailwind CSS, Lucide React Icons
- **Backend & Cloud**: Google Firebase (Authentication, Cloud Firestore, Cloud Storage)
- **State Management**: React Context API
- **Code Quality**: ESLint

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/karuppsamy-k/black-and-white.git
   cd black-and-white
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory based on `.env.example`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

6. Run code linting:
   ```bash
   npm run lint
   ```

---

## 🔒 Security & Role-Based Access Control (RBAC)

- Firebase Authentication manages cryptographic bcrypt hashing and JWT tokens. Passwords and sensitive credentials are never stored in Firestore collections.
- Client-side navigation guards ([`ProtectedRoute`](src/routes/ProtectedRoute.jsx) & [`RoleBasedRoute`](src/routes/RoleBasedRoute.jsx)) enforce role boundaries.
- Cloud Firestore security rules ([`firestore.rules`](firestore.rules)) protect customer, shopkeeper, and admin collections.

---

## 📄 License

This project is licensed under the MIT License.
