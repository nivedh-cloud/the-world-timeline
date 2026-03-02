# Copilot Instructions for New World Timeline App

## Project Overview
This is a modern React application built with Vite, featuring Material UI, Tailwind CSS, and Bootstrap for comprehensive UI development.

## Technology Stack
- **Build Tool**: Vite 7.3.1 - Lightning-fast frontend build tool
- **Framework**: React 19.2.0 with JSX support
- **UI Libraries**:
  - Material UI (MUI) 7.3.8 - Comprehensive React component library
  - Material UI Icons 7.3.8 - Icon library for MUI
  - Bootstrap 5.3.8 - Responsive CSS framework
  - Tailwind CSS 4.2.1 - Utility-first CSS framework
- **Styling**: Emotion (CSS-in-JS for Material UI)
- **PostCSS**: For processing Tailwind CSS directives

## Project Structure
The project uses a **feature-based folder structure** for scalability and maintainability:

```
src/
├── features/                    # Feature modules
│   └── timeline/               # Timeline feature
│       ├── components/         # Feature-specific components
│       ├── pages/              # Feature pages
│       ├── hooks/              # Feature hooks
│       ├── services/           # API/data services
│       ├── types/              # Feature types
│       └── index.js            # Barrel export
│
├── shared/                     # Shared across features
│   ├── components/             # Reusable components (Header, Footer)
│   ├── hooks/                  # Shared custom hooks
│   ├── utils/                  # Utility functions
│   ├── types/                  # Shared types
│   ├── constants/              # App constants
│   └── index.js                # Barrel export
│
├── assets/                     # Static assets
├── App.jsx                     # Root component
├── main.jsx                    # React entry point
├── index.css                   # Global styles
└── App.css                     # App styles
```

See `FOLDER_STRUCTURE.md` for detailed documentation on the architecture.

## Development Scripts
- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint to check code quality

## Key Features
1. **Material UI Integration** - Full suite of pre-built, accessible components
2. **Tailwind CSS** - Utility classes for rapid styling
3. **Bootstrap Support** - Bootstrap CSS framework for additional components
4. **JSX Support** - Modern React syntax with JSX
5. **Hot Module Replacement** - See changes instantly during development
6. **ESLint Configuration** - Code quality checks

## Getting Started
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open http://localhost:5173/ in your browser
4. Begin editing src/App.jsx to see changes live

## CSS Framework Usage Guide
- **Tailwind CSS**: Use inline utility classes like `className="flex justify-between items-center"`
- **Material UI**: Import components like `TextField`, `Button`, `Card` from @mui/material
- **Bootstrap**: Use Bootstrap class names like `list-group`, `list-group-item`
- **Custom CSS**: Add styles in App.css or component-specific CSS files

## Environment Variables
Currently, none are required. Add them to a `.env.local` file if needed for future features.

## Build & Deployment
- Development: `npm run dev`
- Production Build: `npm run build`
- The build output is in the `dist/` directory
