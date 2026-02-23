# DOM Tree Analyzer

A React-based application for analyzing and visualizing DOM tree structures with performance metrics and optimization suggestions.

## Features

- Parse HTML and JSX code
- Visualize DOM tree structure
- Analyze tree depth and complexity
- Performance metrics and optimization reports
- Binary tree conversion and visualization

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router
- Vitest for testing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd dom

# Install dependencies
npm install
# or
bun install
```

### Development

```sh
# Start the development server
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:8080`

### Build

```sh
# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing

```sh
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Project Structure

```
dom/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── utils/          # Utility functions
│   ├── workers/        # Web workers
│   ├── types/          # TypeScript types
│   └── hooks/          # Custom React hooks
├── public/             # Static assets
└── ...config files
```

## License

MIT
