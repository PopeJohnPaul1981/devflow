# DevFlow — Project Management Dashboard

DevFlow is a project management web application built with Next.js and React. It provides a central interface for managing projects, tasks, team members, reports, and application settings.

The project demonstrates modern frontend development, reusable UI components, data visualisation, browser-based persistence, and Git-based development workflows.

## Features

- **Dashboard:** Central overview of project management information.
- **Project Management:** Create and manage projects through a dedicated interface.
- **Task Management:** View and manage tasks through a dedicated page.
- **Team Management:** Access a dedicated team management interface.
- **Reports:** Present project information using data visualisation.
- **Settings:** Dedicated application settings page.
- **Browser-Based Persistence:** Store supported application data in the browser using localStorage.
- **Responsive Interface:** Designed for use across different screen sizes.

*Note: The exact functionality of each page depends on the current implementation.*

## Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Recharts
- Browser localStorage
- Git and GitHub

## Application Pages

| Page | Route |
|---|---|
| Home | `/` |
| Dashboard | `/dashboard` |
| Projects | `/projects` |
| Tasks | `/tasks` |
| Team | `/team` |
| Reports | `/reports` |
| Settings | `/settings` |

## Getting Started

### Prerequisites

Install Node.js and npm before running the project.

### 1. Clone the repository

```bash
git clone https://github.com/PopeJohnPaul1981/devflow.git
```

### 2. Open the project directory

```bash
cd devflow
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the application

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Quality Checks

Run the following commands before submitting changes:

```bash
npm run lint
npm run build
```

These commands check code quality and verify that the application can be built for production.

## Data Storage

DevFlow uses browser-based storage for supported application data. This project does not require a separate database server in its current configuration.

Because browser storage is local to the browser, data should not be assumed to synchronise between different browsers or devices.

## Development

The project uses the Next.js App Router and TypeScript. When adding features, keep components maintainable, preserve existing functionality, and test changes using the lint and production-build commands.

## Future Improvements

Potential improvements include:

- More detailed project and task workflows.
- Additional reporting and filtering capabilities.
- Improved application documentation and screenshots.
- Further responsive-design and accessibility testing.

## Author

**Johnpaul Ubah**

- GitHub: [PopeJohnPaul1981](https://github.com/PopeJohnPaul1981)
- Repository: [DevFlow](https://github.com/PopeJohnPaul1981/devflow)

## License

No license has been specified yet. 
