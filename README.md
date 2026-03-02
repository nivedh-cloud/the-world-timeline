# New World Timeline App

A modern React application built with Vite, featuring Material UI, Tailwind CSS, Bootstrap, and comprehensive UI frameworks for rapid development.

## 🚀 Features

- **Vite** - Lightning-fast frontend build tool with HMR (Hot Module Replacement)
- **React 19** - Latest React with JSX support
- **Material UI** - Professional-grade React component library
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Bootstrap 5** - Responsive CSS framework
- **Material Icons** - Comprehensive icon library
- **ESLint** - Code quality and consistency

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Development

### Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173/`

### Hot Module Replacement (HMR)
- Changes to React components update instantly in the browser
- Styles update without full page reload
- Development is fast and productive

### Linting
```bash
npm run lint
```

## 📚 Using the Frameworks

### Material UI
```jsx
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

function MyComponent() {
  return (
    <Card>
      <CardContent>
        <Button variant="contained">Click Me</Button>
        <TextField label="Enter text" />
      </CardContent>
    </Card>
  )
}
```

### Tailwind CSS
```jsx
<div className="flex justify-between items-center bg-gray-50 p-3 rounded">
  <span className="text-lg font-semibold">Item</span>
  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
    Action
  </button>
</div>
```

### Bootstrap
```jsx
<div className="list-group">
  <div className="list-group-item">Item 1</div>
  <div className="list-group-item">Item 2</div>
</div>
```

### Material Icons
```jsx
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

<Button startIcon={<AddIcon />}>Add</Button>
<Button startIcon={<DeleteIcon />}>Delete</Button>
```

## 🎨 Customization

### Tailwind Configuration
Edit `tailwind.config.js` to customize:
- Color schemes
- Spacing units
- Typography
- Responsive breakpoints

### Material UI Theming
Create a custom theme and wrap your app:
```jsx
import { ThemeProvider, createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
})

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

## 📁 Project Structure

```
src/
├── App.jsx              # Main application component
├── App.css              # Application styles
├── main.jsx             # React DOM mount point
├── index.css            # Global styles with Tailwind
└── assets/              # Static assets
```

## 🔧 Configuration Files

- `vite.config.js` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration for Tailwind
- `eslint.config.js` - ESLint rules and configuration
- `.gitignore` - Git ignore patterns

## 📦 Dependencies

### Runtime
- `react` - UI library
- `react-dom` - React DOM rendering
- `@mui/material` - Material UI components
- `@mui/icons-material` - Icon library
- `@emotion/react` & `@emotion/styled` - CSS-in-JS (required by MUI)
- `tailwindcss` - Utility-first CSS
- `bootstrap` - CSS framework
- `autoprefixer` - PostCSS plugin for vendor prefixes
- `postcss` - CSS transformation tool

### Dev Dependencies
- `vite` - Build tool
- `@vitejs/plugin-react` - React plugin for Vite
- `eslint` - Code linter
- Various TypeScript type definitions

## 🚢 Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory ready for deployment.

## 🌐 Deployment

The `dist/` folder can be deployed to:
- Netlify
- Vercel
- **GitHub Pages** (with CI/CD automation)
- AWS S3
- Any static hosting service

### 🚀 Automatic Deployment with GitHub Actions

This project includes automated CI/CD pipelines for GitHub Pages deployment:

#### Setup (First Time)
```bash
# Run the setup script (Windows)
.\scripts\setup-github.ps1

# Or on macOS/Linux
bash scripts/setup-github.sh
```

#### Automatic Workflow
1. **Push** code to `main` or `master` branch
2. **GitHub Actions** automatically:
   - ✅ Runs linting checks
   - ✅ Builds the project
   - ✅ Deploys to GitHub Pages
3. **View** your live site at: `https://username.github.io/new-world-timeline-app`

#### Workflow Files
- `.github/workflows/deploy.yml` - Main deployment pipeline
- `.github/workflows/pr-checks.yml` - Pull request quality checks

For detailed setup instructions, see [GITHUB_DEPLOYMENT.md](GITHUB_DEPLOYMENT.md)

## 📖 Resources

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Material UI Docs](https://mui.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Bootstrap Documentation](https://getbootstrap.com)

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

**Happy coding! 🎉**
