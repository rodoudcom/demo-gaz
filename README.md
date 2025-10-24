# Pledge - B2B Gas Distribution Management System

A comprehensive multi-role admin panel and ordering system for managing gas bottle distribution across filiales, regions, and points of sale.

## 🚀 Overview

Pledge is a modern B2B platform designed to streamline gas distribution operations through role-based access control, inventory management, and automated ordering processes.

### Key Features

- **Multi-Role Dashboard** - 4 distinct user roles with specific permissions
- **Product Management** - Shopify-like variant system with photo uploads
- **Order Processing** - Public ordering interface for retail shops
- **Fleet Management** - Truck and driver (livreur) assignment system
- **Real-time Stock Control** - Distributor-specific pricing and inventory
- **Responsive Design** - Mobile-friendly interface using Tailwind CSS

---

## 📋 Table of Contents

1. [Project Structure](#project-structure)
2. [User Roles & Permissions](#user-roles--permissions)
3. [Architecture](#architecture)
4. [Installation](#installation)
5. [Demo Accounts](#demo-accounts)
6. [Technologies Used](#technologies-used)
7. [Page Organization](#page-organization)
8. [State Management](#state-management)
9. [Deployment](#deployment)

---

## 🗂️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Header.jsx       # Page header with title and subtitle
│   ├── Modal.jsx        # Reusable modal component
│   ├── Sidebar.jsx      # Role-based navigation sidebar
│   ├── DataTable.jsx    # Reusable data table with actions
│   └── Layout.jsx       # Main layout wrapper
│
├── pages/               # Page components organized by role
│   ├── public/          # Public pages (no auth required)
│   │   ├── Login.jsx
│   │   ├── ShopOrder.jsx      # Public order interface
│   │   └── OrderSuccess.jsx   # Order confirmation
│   │
│   ├── admin/           # Admin-only pages
│   │   ├── Dashboard.jsx
│   │   ├── Filiales.jsx
│   │   ├── Regions.jsx
│   │   └── Users.jsx
│   │
│   ├── countrymanager/  # Country Manager pages
│   │   ├── Dashboard.jsx
│   │   ├── Regions.jsx
│   │   ├── Users.jsx
│   │   ├── Products.jsx       # Product & variant management
│   │   └── Settings.jsx
│   │
│   ├── commercial/      # Commercial pages
│   │   ├── Dashboard.jsx
│   │   ├── Distributors.jsx
│   │   └── Shops.jsx          # Point of sale management
│   │
│   └── distributor/     # Distributor pages
│       ├── Dashboard.jsx
│       ├── Livreurs.jsx       # Driver management
│       ├── Trucks.jsx         # Fleet management
│       ├── Products.jsx       # Inventory & pricing
│       └── Settings.jsx
│
├── store/               # Zustand state management
│   ├── authStore.js     # Authentication state
│   ├── userStore.js     # User management
│   ├── filialeStore.js  # Filiale management
│   └── regionStore.js   # Region management
│
├── App.js               # Main app with routing
└── index.css            # Global styles + Tailwind
```

---

## 👥 User Roles & Permissions

### 1. Admin (Global)
**Access Level:** System-wide

**Permissions:**
- Manage all filiales (countries)
- Create and manage regions within filiales
- Create users (Admin, Country Manager)
- View global statistics

**Navigation:**
```
/admin/dashboard
/admin/filiales
/admin/regions
/admin/users
```

---

### 2. Country Manager (Filiale-level)
**Access Level:** Single filiale/country

**Permissions:**
- Manage regions within their filiale
- Create users (Commercial, Distributor) in their country
- Manage products and variants for their market
- Configure regional settings

**Navigation:**
```
/countrymanager/dashboard
/countrymanager/regions
/countrymanager/users
/countrymanager/products
/countrymanager/settings
```

**Key Features:**
- Product variant combinations (e.g., Color × Size)
- Photo uploads for products and variants
- Default pricing with distributor overrides
- Currency and order limit configuration

---

### 3. Commercial (Region-level)
**Access Level:** Assigned region(s)

**Permissions:**
- Manage distributors in their region
- Manage point of sale shops
- View sales statistics

**Navigation:**
```
/commercial/dashboard
/commercial/distributors
/commercial/shops
```

**Key Features:**
- Distributor assignment to regions
- Shop authentication methods (Email/Password or QR Code)
- GPS coordinates for delivery tracking
- Shop contact management

---

### 4. Distributor (Warehouse-level)
**Access Level:** Own inventory and fleet

**Permissions:**
- Manage delivery drivers (livreurs)
- Manage truck fleet
- Set distributor-specific product prices
- Control stock availability
- Configure delivery fees and thresholds

**Navigation:**
```
/distributor/dashboard
/distributor/livreurs
/distributor/trucks
/distributor/products
/distributor/settings
```

**Key Features:**
- **Livreur Management:** Photo upload, username/password
- **Truck Management:**
    - Assign multiple livreurs to trucks
    - Filter by free/occupied trucks
    - Track capacity (max tonnage)
- **Product Pricing:** Override base prices per variant
- **Stock Control:** Enable/disable variants independently

---

## 🏗️ Architecture

### Frontend Architecture

```
┌─────────────────────────────────────────┐
│           React Application             │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────┐      ┌──────────────┐    │
│  │  Public   │      │ Authenticated│    │
│  │  Routes   │      │   Routes     │    │
│  │           │      │              │    │
│  │  Login    │      │  Protected   │    │
│  │  Order    │      │  Dashboard   │    │
│  │  Success  │      │  Management  │    │
│  └───────────┘      └──────────────┘    │
│                                         │
│  ┌────────────────────────────────┐     │
│  │   Zustand State Management     │     │
│  │  - Auth Store                  │     │
│  │  - User Store                  │     │
│  │  - Filiale Store               │     │
│  │  - Region Store                │     │
│  └────────────────────────────────┘     │
│                                         │
│  ┌────────────────────────────────┐     │
│  │    Reusable Components         │     │
│  │  - DataTable                   │     │
│  │  - Modal                       │     │
│  │  - Header                      │     │
│  │  - Sidebar                     │     │
│  └────────────────────────────────┘     │
└─────────────────────────────────────────┘
```

### Data Flow

```
User Action → Component → Store (Zustand) → Local State Update
                                          ↓
                                    (Future: API Call)
```

### Role-Based Routing

```javascript
<Route 
  path="/admin/*" 
  element={<ProtectedRoute allowedRoles={['Admin']} />}
/>

<Route 
  path="/countrymanager/*" 
  element={<ProtectedRoute allowedRoles={['Country Manager']} />}
/>

// Similar for Commercial and Distributor
```

**How it works:**
1. User logs in via `/login`
2. Auth store saves user role and token
3. User redirected to `/{role}/dashboard`
4. ProtectedRoute checks role before rendering
5. Sidebar dynamically shows role-specific menu

---

## 🎯 Page Organization

### Organization Principles

**1. Role-Based Folder Structure**
- Each role has its own `/pages/{role}/` folder
- Prevents permission confusion
- Easy to add/remove features per role

**2. Naming Convention**
```
/pages/{role}/{Feature}.jsx

Examples:
/pages/admin/Users.jsx
/pages/distributor/Trucks.jsx
/pages/commercial/Shops.jsx
```

**3. Component Reusability**
- Common components in `/components/`
- Store logic in `/store/`
- Shared utilities avoid code duplication

**4. Route Pattern**
```
/{role}/{feature}

Examples:
/admin/dashboard
/countrymanager/products
/distributor/livreurs
/shop-order (public, no role prefix)
```

---

## 🚀 Installation

### Prerequisites
- Node.js v16+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/your-repo/pledge.git

# Navigate to project directory
cd pledge

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Environment Setup

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=your_api_url_here
REACT_APP_ENV=development
```

---

## 🔑 Demo Accounts

Access the system with these pre-configured accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@pledge.com | admin123 |
| Country Manager | sarah.cm@pledge.com | cm123 |
| Commercial | john.commercial@pledge.com | comm123 |
| Distributor | distributor@pledge.com | dist123 |

**Public Order Page:** No authentication required, accessible via "Place an Order" button on login page.

---

## 🛠️ Technologies Used

### Core Technologies
- **React 18** - Frontend framework
- **React Router v6** - Client-side routing
- **Zustand** - Lightweight state management
- **Tailwind CSS** - Utility-first styling

### UI Components
- **Lucide React** - Icon library
- **Custom components** - DataTable, Modal, Header

### Development Tools
- **Create React App** - Build tooling
- **ESLint** - Code linting
- **Prettier** - Code formatting (recommended)

### Fonts
- **Nunito** - Headers and bold text
- **Roboto** - Body text and forms

---

## 📊 State Management

### Zustand Stores

**1. Auth Store (`authStore.js`)**
```javascript
{
  user: { id, fullname, email, role, filialeId },
  token: "jwt-token",
  isAuthenticated: boolean,
  login: (credentials) => void,
  logout: () => void
}
```

**2. User Store (`userStore.js`)**
```javascript
{
  users: [...],
  filters: { role, filialeId, search },
  loading: boolean,
  fetchUsers: () => void,
  createUser: (data) => void,
  updateUser: (id, data) => void,
  deleteUser: (id) => void
}
```

**3. Filiale Store (`filialeStore.js`)**
```javascript
{
  filiales: [...],
  loading: boolean,
  fetchFiliales: () => void,
  // Similar CRUD methods
}
```

**4. Region Store (`regionStore.js`)**
```javascript
{
  regions: [...],
  filters: { filialeId, search },
  fetchRegions: () => void,
  // Similar CRUD methods
}
```

### Persistence
- Auth state persisted to localStorage
- Survives page refresh
- Key: `auth-storage`

---

## 🚢 Deployment

### Cloudflare Pages Setup

1. **Build Configuration**
    - Build command: `npm run build`
    - Build output directory: `build`
    - Root directory: `/`

2. **Required Files**

Create `public/_redirects`:
```
/*    /index.html   200
```

This enables React Router to handle all routes.

3. **Environment Variables**
   Set in Cloudflare Pages dashboard under Settings → Environment variables

4. **Deploy**
```bash
# Push to GitHub
git push origin main

# Cloudflare automatically deploys on push
```

### Build Locally
```bash
# Test production build
npm run build

# Serve locally
npx serve -s build
```

---

## 🎨 Design System

### Color Palette
- **Primary Red:** `#ED0000` (Pledge brand)
- **Background:** `#F9FAFB` (Gray-50)
- **Surface:** White
- **Text:** `#1F2937` (Gray-900)
- **Border:** `#E5E7EB` (Gray-200)

### Typography
- **Headers:** Nunito, semi-bold
- **Body:** Roboto, regular
- **Sizes:** 12px (xs) → 30px (4xl)

### Component Standards
- **Buttons:** 25px border-radius
- **Inputs:** 8px border-radius
- **Cards:** 12px border-radius
- **Spacing:** 4px increments (4, 8, 12, 16, 24, 32)

---

## 📈 Future Enhancements

### Backend Integration
- [ ] REST API connection
- [ ] Real-time database (Firebase/Supabase)
- [ ] JWT authentication
- [ ] File upload to cloud storage

### Features
- [ ] Order tracking with status updates
- [ ] SMS/Email notifications
- [ ] Payment gateway integration
- [ ] Analytics dashboard with charts
- [ ] Export reports (PDF, Excel)
- [ ] Multi-language support (i18n)
- [ ] Mobile app (React Native)

### DevOps
- [ ] CI/CD pipeline
- [ ] Automated testing (Jest, React Testing Library)
- [ ] Docker containerization
- [ ] Monitoring and logging

---

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 📞 Support

For questions or support, contact: support@pledge.com

---

## 🙏 Acknowledgments

- Design inspiration from modern B2B platforms
- Built with ❤️ by the Pledge team

---

**Version:** 1.0.0  
**Last Updated:** October 24, 2025
