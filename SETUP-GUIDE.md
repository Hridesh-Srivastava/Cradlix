# Baby Ecommerce Website - Complete Setup Guide

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- MongoDB database (local or cloud)
- Git installed

## 1. Project Setup

### Clone/Download the project and navigate to directory
\`\`\`bash
cd baby-ecommerce
\`\`\`

### Install all dependencies
\`\`\`bash
npm install
\`\`\`

### Install additional dependencies if needed
\`\`\`bash
npm install @next/font
npm install @radix-ui/react-accordion
npm install @radix-ui/react-alert-dialog
npm install @radix-ui/react-avatar
npm install @radix-ui/react-checkbox
npm install @radix-ui/react-collapsible
npm install @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-label
npm install @radix-ui/react-navigation-menu
npm install @radix-ui/react-popover
npm install @radix-ui/react-progress
npm install @radix-ui/react-radio-group
npm install @radix-ui/react-scroll-area
npm install @radix-ui/react-select
npm install @radix-ui/react-separator
npm install @radix-ui/react-sheet
npm install @radix-ui/react-slider
npm install @radix-ui/react-switch
npm install @radix-ui/react-tabs
npm install @radix-ui/react-toast
npm install @radix-ui/react-tooltip
npm install @hookform/resolvers
npm install @types/bcryptjs
npm install @types/jsonwebtoken
npm install @types/node
npm install @types/react
npm install @types/react-dom
npm install autoprefixer
npm install bcryptjs
npm install class-variance-authority
npm install clsx
npm install drizzle-orm
npm install drizzle-kit
npm install jsonwebtoken
npm install lucide-react
npm install mongoose
npm install next
npm install next-auth
npm install next-themes
npm install pg
npm install postcss
npm install react
npm install react-dom
npm install react-hook-form
npm install razorpay
npm install swiper
npm install tailwind-merge
npm install tailwindcss
npm install tailwindcss-animate
npm install typescript
npm install zod
\`\`\`

## 2. Database Setup

### PostgreSQL Setup (using pgAdmin 4)

1. Open pgAdmin 4
2. Create a new database named `baby_ecommerce`
3. Open Query Tool for the database
4. Copy and paste the entire content from `database/pgadmin-setup.sql`
5. Execute the queries
6. Verify all tables are created successfully

### MongoDB Setup

1. Create a MongoDB database (local or MongoDB Atlas)
2. Note down the connection string
3. The MongoDB collections will be created automatically when the app runs

## 3. Environment Variables

Create `.env.local` file in the root directory:

\`\`\`env
# Database URLs
POSTGRES_URL=postgresql://username:password@localhost:5432/baby_ecommerce
MONGODB_URI=mongodb://localhost:27017/baby_ecommerce
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/baby_ecommerce

# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-here-minimum-32-characters
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Razorpay Configuration (Get from Razorpay Dashboard)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Optional: For production
# NEXT_PUBLIC_APP_URL=https://yourdomain.com
\`\`\`

## 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Set authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy Client ID and Client Secret to `.env.local`

## 5. Razorpay Setup

1. Sign up at [Razorpay](https://razorpay.com/)
2. Complete KYC verification
3. Go to Settings → API Keys
4. Generate API keys
5. Add the policy links to your website as shown in the Razorpay dashboard
6. Copy Key ID and Key Secret to `.env.local`

## 6. Run the Application

### Development Mode
\`\`\`bash
npm run dev
\`\`\`

### Build for Production
\`\`\`bash
npm run build
npm start
\`\`\`

## 7. Access the Application

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin (requires admin role)
- **User Dashboard**: http://localhost:3000/account

## 8. Default Admin Access

After setting up the database, you can promote any user to admin by:

1. Sign in with Google OAuth
2. Update the user role in PostgreSQL:
\`\`\`sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@gmail.com';
\`\`\`

## 9. File Structure

\`\`\`
baby-ecommerce/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # Auth group routes
│   ├── account/                  # User dashboard
│   ├── admin/                    # Admin panel
│   ├── api/                      # API routes
│   ├── categories/               # Category pages
│   ├── checkout/                 # Checkout flow
│   ├── products/                 # Product pages
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/                   # React components
│   ├── account/                  # User account components
│   ├── admin/                    # Admin components
│   ├── auth/                     # Authentication components
│   ├── checkout/                 # Checkout components
│   ├── layout/                   # Layout components
│   ├── product/                  # Product components
│   ├── providers/                # Context providers
│   ├── sections/                 # Homepage sections
│   └── ui/                       # Reusable UI components
├── database/                     # Database setup files
├── lib/                          # Utility libraries
│   ├── auth/                     # Authentication utilities
│   ├── config/                   # Configuration files
│   ├── db/                       # Database utilities
│   ├── payment/                  # Payment utilities
│   └── types/                    # TypeScript types
├── public/                       # Static assets
├── scripts/                      # Database scripts
├── .env.local                    # Environment variables
├── .env.example                  # Environment template
├── drizzle.config.ts             # Drizzle ORM config
├── middleware.ts                 # Next.js middleware
├── next.config.mjs               # Next.js config
├── package.json                  # Dependencies
├── postcss.config.mjs            # PostCSS config
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
└── vercel.json                   # Vercel deployment config
\`\`\`

## 10. Troubleshooting

### Common Issues:

1. **Database Connection Error**: Check your connection strings in `.env.local`
2. **OAuth Error**: Verify redirect URIs in Google Cloud Console
3. **Payment Error**: Ensure Razorpay keys are correct and website is added to Razorpay dashboard
4. **Build Error**: Run `npm run build` to check for TypeScript errors

### Support:
- Check the console for detailed error messages
- Verify all environment variables are set correctly
- Ensure databases are running and accessible
