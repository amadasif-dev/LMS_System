# LMS Pro - Learning Management System

A production-ready SaaS LMS frontend built with React 18, TypeScript, Vite, Redux Toolkit, and Tailwind CSS.

## Features

- **Multi-tenant SaaS Architecture** - Supports multiple schools/tenants with isolated data
- **Role-based Access Control** - Super Admin, School Admin, Teacher, Student roles
- **JWT Authentication** - Secure authentication with refresh tokens
- **Modern UI/UX** - Responsive design with Tailwind CSS
- **State Management** - Redux Toolkit with 13 feature slices
- **Code Splitting** - Lazy-loaded routes for optimal performance

## Tech Stack

- React 18+
- TypeScript 5
- Vite (build tool)
- Redux Toolkit + React-Redux
- React Router DOM v6
- Tailwind CSS
- React Hook Form + Zod
- Chart.js (analytics)
- html2pdf.js (certificates)
- React Hot Toast (notifications)

## Project Structure

```
src/
├── core/
│   ├── api/           # Axios instance + API endpoints
│   ├── store/         # Redux store + slices
│   ├── guards/        # Route guards
│   └── utils/         # Helpers + constants
├── shared/
│   ├── components/    # Reusable UI components
│   └── layouts/       # Page layouts
├── features/          # Feature-based modules
│   ├── auth/
│   ├── admin/
│   ├── courses/
│   ├── students/
│   ├── teachers/
│   ├── quizzes/
│   ├── assignments/
│   ├── attendance/
│   ├── timetable/
│   ├── analytics/
│   ├── payments/
│   ├── certificates/
│   ├── chat/
│   ├── settings/
│   └── notifications/
└── routes/            # Route configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Server runs at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Environment Variables

Create `.env` file:

```
VITE_API_URL=http://localhost:5000/api
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## User Roles & Routes

| Role | Access |
|------|--------|
| Super Admin | `/admin/dashboard`, all schools management |
| School Admin | `/courses`, `/students`, `/teachers`, `/payments`, etc. |
| Teacher | `/courses`, `/students`, `/quizzes`, `/assignments`, etc. |
| Student | `/courses`, `/certificates`, `/chat` |

## API Integration

The app expects a REST API at the configured `VITE_API_URL`. See the server directory for backend implementation.

## License

MIT
