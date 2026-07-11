# React + TypeScript + Vite Project

A modern React application built with TypeScript, featuring Tailwind CSS for utility-first styling, Chakra UI for accessible component library, and React Icons for comprehensive icon support.

## 🚀 Tech Stack

- **[React 18](https://react.dev/)** - A JavaScript library for building user interfaces
- **[TypeScript](https://www.typescriptlang.org/)** - Typed superset of JavaScript
- **[Vite](https://vite.dev/)** - Next generation frontend tooling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Chakra UI](https://chakra-ui.com/)** - Accessible React component library
- **[React Icons](https://react-icons.github.io/react-icons/)** - Popular icon library with Font Awesome, Material Design, and more
- **[React Router](https://reactrouter.com/)** - Declarative routing for React applications
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library (required by Chakra UI)
- **[Emotion](https://emotion.sh/)** - CSS-in-JS library (required by Chakra UI)

## 📋 Prerequisites

- Node.js (version 16 or higher recommended)
- npm or yarn package manager

## 🛠️ Installation

1. Clone the repository or navigate to the project directory

2. Install dependencies:
```bash
npm install
```

## 🏃 Running the Project

### Development Mode

Start the development server with hot module replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Production Build

Build the project for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## 🎨 Styling Approaches

This project demonstrates multiple styling approaches:

### 1. Tailwind CSS
Use utility classes directly in your JSX:
```tsx
<div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-500 to-purple-600">
  <h1 className="text-3xl font-bold text-white">Hello World</h1>
</div>
```

### 2. Chakra UI Components
Import and use pre-built accessible components:
```tsx
import { Button, Card, CardBody } from '@chakra-ui/react'

<Card>
  <CardBody>
    <Button colorScheme="purple">Click Me</Button>
  </CardBody>
</Card>
```

### 3. React Icons
Import icons from various libraries:
```tsx
import { FaReact } from 'react-icons/fa'
import { SiTailwindcss } from 'react-icons/si'

<FaReact className="text-cyan-400 text-4xl" />
<Icon as={SiTailwindcss} boxSize={6} color="cyan.400" />
```

### 4. React Router
Set up navigation with React Router:
```tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

<BrowserRouter>
  <Link to="/about">About</Link>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
  </Routes>
</BrowserRouter>
```

## 📁 Project Structure

```
task-fe/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable components
│   │   └── Navigation.tsx
│   ├── pages/          # Route pages
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   └── Demo.tsx
│   ├── App.tsx         # Main app with router setup
│   ├── App.css         # Component-specific styles
│   ├── index.css       # Global styles with Tailwind directives
│   └── main.tsx        # Application entry point with ChakraProvider
├── index.html          # HTML template
├── tailwind.config.js  # Tailwind CSS configuration
├── postcss.config.js   # PostCSS configuration
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── package.json        # Project dependencies
```

## 🎯 Features Demonstrated

The application showcases:

- ✅ **Multi-page routing** with React Router (Home, About, Demo pages)
- ✅ **Navigation component** with active route highlighting
- ✅ **Tailwind utility classes** for responsive design
- ✅ **Chakra UI components** (Cards, Buttons, Badges, Navigation)
- ✅ **React Icons** from multiple icon sets
- ✅ **TypeScript** type safety throughout
- ✅ **Interactive components** with state management
- ✅ **Dark mode support** (via Chakra UI)
- ✅ **Gradient backgrounds** and modern UI patterns

## 🔧 Configuration Files

### Tailwind Configuration
Edit `tailwind.config.js` to customize Tailwind's behavior:
- Content paths for purging unused CSS
- Theme extensions (colors, fonts, spacing)
- Plugins

### Chakra UI Theme
The ChakraProvider in `src/main.tsx` can be customized with a theme object:
```tsx
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  // your custom theme
})

<ChakraProvider theme={theme}>
  <App />
</ChakraProvider>
```

## 📚 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run Oxlint code linter

## 🌐 Icon Libraries

React Icons includes icons from:
- Font Awesome
- Material Design
- Bootstrap Icons
- Heroicons
- Feather Icons
- And many more!

Browse icons at: https://react-icons.github.io/react-icons/

## 📖 Documentation Links

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vite.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Chakra UI Docs](https://chakra-ui.com/docs/get-started)
- [React Icons Search](https://react-icons.github.io/react-icons/)
- [React Router Docs](https://reactrouter.com/)

## 🤝 Best Practices

1. **Combine Tailwind and Chakra**: Use Tailwind for custom layouts and Chakra for complex interactive components
2. **Type Safety**: Leverage TypeScript for better developer experience and fewer bugs
3. **Component Organization**: Keep components focused and reusable
4. **Performance**: Vite provides fast HMR and optimized production builds
5. **Accessibility**: Chakra UI components are built with accessibility in mind

## 📝 License

This project is open source and available for learning and development purposes.

---

Built with ❤️ using React, TypeScript, and Vite
