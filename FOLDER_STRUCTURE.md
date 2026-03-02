# Feature-Based Folder Structure

This project uses a **feature-based architecture** which organizes code by business domains/features rather than by file type. This approach improves scalability and maintainability as the project grows.

## Folder Structure

```
src/
├── features/                           # Feature modules
│   └── timeline/                       # Timeline feature
│       ├── components/                 # Feature-specific components
│       ├── pages/                      # Feature pages/containers
│       │   └── TimelinePage.jsx        # Main timeline page
│       ├── hooks/                      # Feature-specific hooks
│       ├── services/                   # API calls, data fetching
│       ├── types/                      # TypeScript types/interfaces
│       └── index.js                    # Barrel export for clean imports
│
├── shared/                             # Shared across all features
│   ├── components/                     # Reusable UI components
│   │   ├── Header.jsx                  # App header
│   │   ├── Footer.jsx                  # App footer
│   │   └── index.js
│   ├── hooks/                          # Shared custom hooks
│   ├── utils/                          # Utility functions
│   ├── types/                          # Shared TypeScript types
│   ├── constants/                      # Constants, enums
│   └── index.js                        # Barrel export
│
├── assets/                             # Static assets (images, icons, etc.)
├── App.jsx                             # Root component
├── main.jsx                            # React entry point
├── index.css                           # Global styles
└── App.css                             # App-level styles
```

## Key Principles

### 1. **Feature Encapsulation**
Each feature is self-contained and organized under `src/features/<feature-name>`. This makes it easy to:
- Find all code related to a specific feature
- Understand feature dependencies
- Isolate and test features independently
- Remove features without breaking other parts

### 2. **Shared Code Location**
Code shared across multiple features lives in `src/shared/`:
- **components/**: Reusable components (Header, Footer, UI elements)
- **hooks/**: Shared custom hooks
- **utils/**: Helper functions
- **types/**: Common TypeScript types
- **constants/**: App-wide constants

### 3. **Barrel Exports (index.js)**
Each feature and the shared folder has an `index.js` that exports its public API:

```javascript
// src/features/timeline/index.js
export { default as TimelinePage } from './pages/TimelinePage'
```

This allows clean imports:
```javascript
// Instead of:
import TimelinePage from './features/timeline/pages/TimelinePage'

// Use:
import { TimelinePage } from './features/timeline'
```

## Creating a New Feature

To add a new feature (e.g., `dashboard`):

1. Create the feature directory:
   ```
   src/features/dashboard/
   ├── components/
   ├── pages/
   ├── hooks/
   ├── services/
   ├── types/
   └── index.js
   ```

2. Create your feature components

3. Export public components from `index.js`:
   ```javascript
   export { default as DashboardPage } from './pages/DashboardPage'
   ```

4. Use in App.jsx:
   ```javascript
   import { DashboardPage } from './features/dashboard'
   ```

## Adding Shared Components

1. Create the component in `src/shared/components/`
2. Export from `src/shared/components/index.js`
3. Use across the app:
   ```javascript
   import { Header, Footer } from './shared'
   ```

## Example: Using Features in App.jsx

```javascript
import Box from '@mui/material/Box'
import { Header, Footer } from './shared'
import { TimelinePage } from './features/timeline'

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flex: 1 }}>
        <TimelinePage />
      </Box>
      <Footer />
    </Box>
  )
}
```

## Benefits

✅ **Scalability**: Easy to add new features without affecting existing code  
✅ **Maintainability**: Related code is grouped together by feature  
✅ **Code Re-use**: Shared components/utilities prevent duplication  
✅ **Testing**: Features can be tested in isolation  
✅ **Team Collaboration**: Different team members can work on different features with minimal conflicts  

## Future Considerations

As the project grows, consider:
- Adding routing (React Router) to handle multiple pages
- Creating a `src/contexts/` folder for shared state (Context API)
- Adding a `src/store/` folder for centralized state management (Redux, Zustand, etc.)
- Creating feature-specific services for API calls in `features/*/services/`
