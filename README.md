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

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
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
├── lib/                # Utilities and API
└── types/              # TypeScript interfaces
```

## API Documentation

### Endpoints

#### `GET /api/agents`
- Fetch all agents.
- **Response:** Array of agent objects.

#### `POST /api/agents`
- Create a new agent.
- **Body:** See Agent Object schema below.
- **Response:** Created agent object.

#### `GET /api/agents/[id]`
- Fetch agent by ID.
- **Response:** Agent object or 404 if not found.

#### `POST /api/agents/[id]`
- Update agent by ID.
- **Body:** See Agent Object schema below.
- **Response:** Updated agent object.

#### `DELETE /api/agents/[id]`
- Delete agent by ID.
- **Response:** `{ success: true }` on success.

### Agent Object Schema
| Field         | Type                | Required | Description                  |
|---------------|---------------------|----------|------------------------------|
| name          | string              | Yes      | Agent name                   |
| description   | string              | Yes      | Agent description            |
| instructions  | string              | Yes      | System instructions          |
| logo          | string              | No       | Logo image (base64 or URL)   |
| quickReplies  | string[]            | No       | Quick reply options          |
| theme         | string              | No       | Theme name                   |
| pricing       | string              | No       | Pricing info                 |
| model         | string              | Yes      | Model name                   |
| subscription  | boolean             | No       | Subscription enabled         |
| public        | boolean             | No       | Public visibility            |
| status        | "active"/"inactive" | Yes      | Agent status                 |
| createdAt     | string (ISO date)   | No       | Creation timestamp           |
| type          | string              | No       | Agent type                   |
| tokenUsage    | number              | No       | Usage count                  |
| maxTokens     | number              | No       | Max tokens                   |
| id            | string              | No       | Unique agent ID              |
| accessType    | "free"/"paid"        | No       | Access type                  |

## Extending the Project
- To add new agent fields, update `src/components/create-agent/schema.ts` and `src/components/create-agent/context.tsx`.
- Update API logic in `src/app/api/agents/[id]/route.ts` if backend changes are needed.
- Add new UI steps/components in `src/components/create-agent/`.

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
