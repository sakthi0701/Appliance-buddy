# Appliance Buddy - Full Stack Application

A comprehensive appliance management system with Supabase integration, featuring user authentication and complete CRUD operations.

## Project Structure

```
appliance-buddy-main/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── backend/                  # Node.js Express backend (optional)
│   ├── src/
│   ├── package.json
│   └── ...
├── shared/                   # Shared types and utilities
│   ├── types/
│   └── utils/
├── supabase/                 # Supabase configuration and schemas
│   ├── migrations/
│   └── schema.sql
└── README.md
```

## Technologies Used

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for component library
- **React Router** for navigation
- **React Query** for data fetching
- **Supabase** for authentication and database

### Backend (Optional)
- **Node.js** with Express
- **TypeScript**
- **Supabase Client** for database operations

### Database
- **Supabase** (PostgreSQL)
- Row Level Security (RLS)
- Real-time subscriptions

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd appliance-buddy-main
   ```

2. **Setup Supabase Database**
   - Create a new Supabase project
   - Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
   - Enable authentication in your Supabase dashboard

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   # Add your Supabase URL and anon key to .env.local
   npm run dev
   ```

4. **Backend Setup (Optional)**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Add your Supabase URL and service key to .env
   npm run dev
   ```

## Environment Variables

### Frontend (.env.local)
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend (.env)
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=3001
```

## Features

- 🔐 **User Authentication** - Sign up, sign in, password reset
- 📱 **Responsive Design** - Works on desktop and mobile
- 🏠 **Appliance Management** - Add, edit, delete appliances
- 🔧 **Maintenance Tracking** - Schedule and track maintenance tasks
- 📞 **Support Contacts** - Manage support contacts for each appliance
- 📄 **Document Links** - Store important document links
- 🔒 **Data Security** - Row Level Security ensures users only see their data
- 📊 **Real-time Updates** - Real-time data synchronization

## Development

### Frontend Development
```bash
cd frontend
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Backend Development
```bash
cd backend
npm run dev        # Start development server with auto-reload
npm run build      # Build TypeScript
npm run start      # Start production server
npm run test       # Run tests
```

## Deployment

### Frontend
- Deploy to Vercel, Netlify, or any static hosting service
- Ensure environment variables are set in your hosting platform

### Backend
- Deploy to Railway, Render, or any Node.js hosting service
- Ensure environment variables are configured

### Supabase
- Your Supabase project is already hosted
- Configure authentication providers as needed
- Set up edge functions if required

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
