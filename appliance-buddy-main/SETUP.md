# Setup Instructions

This document provides step-by-step instructions for setting up the Appliance Buddy application after the restructuring.

## Project Structure Overview

```
appliance-buddy-main/
├── frontend/                 # React TypeScript frontend
│   ├── src/                 # Frontend source code
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.ts       # Vite configuration
│   ├── tailwind.config.ts   # Tailwind CSS configuration
│   └── .env.example         # Environment variables template
├── backend/                  # Node.js Express backend
│   ├── src/                 # Backend source code
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   ├── services/        # Business logic
│   │   └── server.ts        # Main server file
│   ├── package.json         # Backend dependencies
│   ├── tsconfig.json        # TypeScript configuration
│   └── .env.example         # Environment variables template
├── shared/                   # Shared code between frontend and backend
│   ├── types/               # TypeScript type definitions
│   │   ├── appliance.ts     # Appliance-related types
│   │   └── database.ts      # Supabase database types
│   └── utils/               # Shared utilities
├── supabase/                 # Supabase configuration
│   └── schema.sql           # Database schema and RLS policies
├── package.json             # Root workspace configuration
└── README.md                # Main documentation
```

## Installation Steps

### 1. Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### 2. Install Dependencies

```bash
# Install all dependencies for both frontend and backend
npm run install:all

# Or install individually:
npm run install:frontend
npm run install:backend
```

### 3. Database Setup

1. Create a new Supabase project at https://supabase.com
2. Go to the SQL Editor in your Supabase dashboard
3. Copy and run the contents of `supabase/schema.sql`
4. Enable authentication in Authentication > Settings
5. Configure email authentication (or other providers as needed)

### 4. Environment Configuration

#### Frontend Environment
```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Backend Environment (Optional)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=3001
NODE_ENV=development
```

### 5. Development

#### Frontend Only (Direct Supabase Integration)
```bash
# Start frontend development server
npm run dev:frontend

# The app will be available at http://localhost:5173
```

#### Full Stack (Frontend + Backend)
```bash
# Terminal 1: Start backend
npm run dev:backend

# Terminal 2: Start frontend
npm run dev:frontend

# Frontend: http://localhost:5173
# Backend API: http://localhost:3001
```

### 6. Build for Production

```bash
# Build frontend
npm run build:frontend

# Build backend
npm run build:backend
```

## Authentication Flow

The application includes a complete authentication system:

1. **AuthProvider**: Manages authentication state using Supabase Auth
2. **AuthGuard**: Protects routes and redirects unauthenticated users
3. **AuthForm**: Provides sign in, sign up, and password reset UI

Users must sign up/sign in to access the application. All data is automatically scoped to the authenticated user through Row Level Security policies.

## Key Features Implemented

- ✅ **User Authentication** - Complete auth flow with Supabase
- ✅ **Appliance Management** - CRUD operations for appliances
- ✅ **Maintenance Tracking** - Schedule and track maintenance tasks
- ✅ **Support Contacts** - Manage support contacts for each appliance
- ✅ **Document Links** - Store important document references
- ✅ **Row Level Security** - Data isolation between users
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Real-time Data** - Automatic synchronization with Supabase

## Migration Notes

### What Changed
1. **File Organization**: All frontend code moved to `frontend/` directory
2. **Shared Types**: Common types moved to `shared/types/`
3. **Import Paths**: Updated to reference shared types from `../../../shared/types/`
4. **Configuration**: Separate package.json files for frontend and backend
5. **Supabase Schema**: Moved to `supabase/schema.sql`

### Import Path Updates
The following files were updated to use shared types:
- `frontend/src/lib/supabase.ts`
- `frontend/src/services/applianceService.ts`
- `frontend/src/hooks/useAppliances.ts`
- `frontend/src/data/mockAppliances.ts`
- `frontend/src/components/ApplianceCard.tsx`
- `frontend/src/components/ApplianceForm.tsx`

## Next Steps

1. **Backend Development**: Implement API endpoints in `backend/src/routes/`
2. **Additional Features**: Add file upload, notifications, etc.
3. **Testing**: Add unit and integration tests
4. **Deployment**: Deploy frontend and backend to your preferred platforms

## Troubleshooting

### Common Issues

1. **Module not found errors**: Ensure you've run `npm install` in the correct directories
2. **Supabase connection issues**: Verify your environment variables are correct
3. **Authentication not working**: Check that you've enabled email auth in Supabase
4. **Database errors**: Ensure the schema has been applied correctly

### Getting Help

- Check the Supabase documentation: https://supabase.com/docs
- Review the React documentation: https://react.dev
- Check the project README.md for additional information

## Development Workflow

```bash
# Start development
npm run dev:frontend

# Lint code
npm run lint

# Build for production
npm run build:frontend

# Test the production build
cd frontend && npm run preview
```", "original_text": "new_file"}]