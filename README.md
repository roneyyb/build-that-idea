# Agent Creation and Management System

A comprehensive web application for creating and managing AI agents. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- Multi-step wizard for creating agents
  - Basic Information
  - Appearance Customization
  - Monetization Settings
- Agent Management Dashboard
  - Sort and filter agents
  - Search functionality
  - Analytics and metrics
- Detailed Agent Views
  - Performance statistics
  - Message history
  - Configuration editing

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **Charts**: Recharts

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                # Next.js app router pages
├── components/         # Reusable components
├── lib/               # Utilities and API
└── types/             # TypeScript interfaces
```

## Development

- **Code Style**: The project uses ESLint and TypeScript for code quality
- **State Management**: React Context for global state
- **API Integration**: Mock API with simulated latency for development

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT
