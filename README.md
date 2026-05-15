# ProjectFlow

> A premium React SaaS-style productivity and project-management platform for organizing workspaces, projects, tasks, deadlines, files, activity, and focused work.

![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=111)
![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES%20Modules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-Animations-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![LocalStorage](https://img.shields.io/badge/Persistence-LocalStorage-c4531a?style=for-the-badge)

ProjectFlow is a feature-rich frontend productivity application inspired by modern SaaS tools like Asana, ClickUp, Linear, and Notion. It combines workspace management, project planning, Kanban boards, task tracking, file attachments, analytics, onboarding, mock authentication, activity history, and a premium warm editorial interface into one polished React application.

This project is frontend-only. Authentication, collaboration, invitations, and persistence are simulated using localStorage so the full product experience can be explored without a backend.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Project Motivation](#project-motivation)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [System Architecture](#system-architecture)
- [Application Workflow](#application-workflow)
- [Folder Structure](#folder-structure)
- [UI/UX Design System](#uiux-design-system)
- [State Management Analysis](#state-management-analysis)
- [Routing System](#routing-system)
- [Animation System](#animation-system)
- [Productivity Features](#productivity-features)
- [How To Run The Project](#how-to-run-the-project)
- [Example Workflow](#example-workflow)
- [Learning Outcomes](#learning-outcomes)
- [Future Improvements](#future-improvements)
- [Challenges Faced](#challenges-faced)
- [Final Project Evaluation](#final-project-evaluation)
- [Author](#author)

---

## Project Overview

ProjectFlow is a frontend SaaS-style productivity and project-management application built with React and Vite. It is designed to feel like a modern collaborative workspace where users can create workspaces, organize projects, manage tasks, track deadlines, upload task attachments, review activity, and measure productivity.

The application targets users who want a clean, visual, and structured way to manage work:

- students managing assignments and deadlines
- startup teams organizing product launches
- designers planning creative sprints
- developers tracking features, bugs, and releases
- individuals building a personal productivity system

From a technical perspective, ProjectFlow demonstrates advanced frontend concepts:

- modular Context API architecture
- route-based application structure
- protected frontend routes
- localStorage persistence
- dynamic task filtering
- drag-and-drop Kanban interactions
- animated UI transitions
- responsive dashboard layouts
- component composition
- onboarding and personalization flows

The project is intentionally designed as a premium frontend product rather than a simple task-list demo. It focuses on product thinking, interface hierarchy, reusable state patterns, and realistic SaaS workflows.

---

## Project Motivation

ProjectFlow was built to explore how a production-style productivity interface can be designed and engineered using only frontend technologies.

The main goals were:

- Build a realistic React SaaS application without relying on a backend.
- Practice scalable Context API architecture.
- Design a premium dashboard UI with strong visual hierarchy.
- Combine multiple productivity workflows into one coherent product.
- Implement onboarding, authentication, protected routes, project views, task systems, and persistence.
- Explore motion design with Framer Motion in a subtle, professional way.
- Create a portfolio-quality project that demonstrates both engineering and UI/UX ability.

The application takes inspiration from:

- Asana for work organization and team productivity
- ClickUp for productivity density and flexible workflows
- Linear for polish, motion, and command-style interaction
- Notion for calm workspace design and structured information

---

## Key Features

### Landing Page

ProjectFlow includes a cinematic SaaS landing page designed around calm productivity and clarity.

It includes:

- premium hero section
- product storytelling sections
- animated mockup previews
- pricing section
- warm editorial layout
- clear call-to-action flow

The landing page introduces the product as more than a task manager. It frames ProjectFlow as a calm workspace for ambitious people who want to reduce chaos and focus on meaningful progress.

### Authentication

The app includes frontend-only authentication using mock login and signup flows.

Authentication features:

- login page
- signup page
- localStorage session persistence
- protected workspace access
- logout support

Because the project is frontend-only, authentication is simulated. This allows the app to demonstrate real auth flow architecture without needing a backend service.

### Onboarding & Personalization

ProjectFlow includes a premium onboarding flow that personalizes the user experience before entering the workspace.

Onboarding asks:

- what kind of work the user manages
- how the user prefers to work
- which workspace theme they prefer
- whether they want to invite teammates

The onboarding experience includes:

- animated step transitions
- progress indicator
- interactive option cards
- workspace preview panel
- teammate invite chips
- responsive layout

This improves UX because users do not land in a generic dashboard. Instead, the workspace feels shaped around their intent.

### Workspace System

ProjectFlow supports multiple workspaces.

Each workspace contains:

- workspace name
- description
- members
- invitations
- projects
- settings

Users can:

- create workspaces
- switch workspaces
- manage projects inside a workspace
- simulate teammate invitations

The workspace model makes the app feel closer to a real collaborative SaaS product rather than a single-project task board.

### Project Management

Inside each workspace, users can manage multiple projects.

Project features include:

- project tabs
- project creation
- project deletion
- project colors
- project deadlines
- project-specific task collections
- project-specific activity history

Projects are stored inside the active workspace, which keeps data scoped and organized.

### Kanban Board

The Kanban board is the central planning view.

It supports:

- multiple columns
- draggable task cards
- task movement between statuses
- column-specific task creation
- visual task priority
- comments and attachment indicators
- checklist progress preview

The board helps users understand project status visually and move work through stages such as Backlog, Design, Development, Review, and Done.

### Task Management

Tasks are the core unit of work in ProjectFlow.

Each task can include:

- title
- description
- priority
- status column
- deadline
- tag
- assignees
- checklist
- comments
- attachments

Task management is handled through modals and detail views. Users can create, edit, move, comment on, and delete tasks.

### Calendar View

The calendar view helps users understand deadlines across time.

It improves productivity by showing:

- due dates
- deadline distribution
- upcoming work
- project schedule context

This view is useful for users who think in dates rather than board columns.

### Analytics Dashboard

ProjectFlow includes an analytics/overview section for project insight.

Analytics can show:

- task completion status
- workload distribution
- overdue tasks
- progress indicators
- project health signals

This turns the app from a task board into a lightweight productivity dashboard.

### File Attachments

Tasks support file uploads through a drag-and-drop attachment system.

Attachment features:

- drag-and-drop upload
- click-to-browse upload
- attachment list
- file metadata
- view/download links
- persistence using base64 data URLs

This is useful for reviewing project progress later. A user can upload briefs, mockups, documents, screenshots, or reference files to a task and return to them days or months later.

### Notifications

ProjectFlow includes notifications and toast feedback.

Notifications are used for:

- task creation
- task completion
- deadline alerts
- focus session completion
- important user feedback

This improves interaction clarity because users receive immediate confirmation after important actions.

### Focus Timer

The app includes an immersive focus timer experience.

Focus mode provides:

- 59:59 deep focus timer
- fullscreen focus overlay
- pause/resume controls
- stop control
- calm productivity copy
- premium ambient interface

This feature turns ProjectFlow into more than a planner. It also helps users execute the work they planned.

### Responsive Layout

The dashboard is designed to adapt across screen sizes.

Responsive improvements include:

- collapsible sidebar
- wrapping toolbar controls
- horizontal board scrolling
- mobile-friendly onboarding
- adaptive project tabs
- modal scaling
- compact dashboard layouts

This makes the app more usable on laptops, tablets, and smaller screens.

### Recent Activity System

Each project has its own activity stream.

Activity events are generated when users:

- create tasks
- edit tasks
- move tasks
- complete tasks
- add comments
- upload attachments
- assign members
- change deadlines

Activity objects follow this structure:

```js
{
  id: "act-123",
  type: "comment",
  message: "Commented on \"Landing Hero\".",
  taskId: "t1",
  createdAt: "2026-05-15T12:00:00.000Z",
  user: "Alex Reed"
}
```

The activity panel is collapsible by default so it does not permanently reduce Kanban board visibility. When expanded, it becomes a scrollable, animated activity history using Lucide icons and Framer Motion transitions.

### Animations & Transitions

ProjectFlow uses Framer Motion to create subtle, premium interactions.

Animation areas include:

- onboarding step transitions
- command palette open/close
- modal transitions
- activity panel expansion
- task card hover movement
- focus mode overlay
- landing page reveals

Animations are intentionally restrained. The goal is a polished SaaS feel, not distracting motion.

### Local Persistence

ProjectFlow persists data using localStorage.

Persisted data includes:

- auth session
- users
- onboarding state
- workspaces
- projects
- tasks
- comments
- attachments
- activity logs
- notifications
- current workspace selection

This allows the app to behave like a real product during local usage without requiring a backend.

---

## Technologies Used

### Frontend

| Technology | Purpose |
| --- | --- |
| React | Component-based UI architecture |
| Vite | Fast development server and production build tool |
| JavaScript | Application logic and data handling |
| CSS | Custom design system, layout, responsiveness, and animations |

### Libraries

| Library | Purpose |
| --- | --- |
| React Router | Page routing, protected routes, workspace/project URLs |
| Framer Motion | UI animations, transitions, collapsible panels, onboarding motion |
| Lucide React | Professional icon system |

### Concepts Demonstrated

- Context API
- component composition
- derived state
- global UI state
- route protection
- dynamic rendering
- localStorage persistence
- drag-and-drop behavior
- responsive dashboard design
- animation systems
- mock authentication
- SaaS onboarding flows

---

## System Architecture

ProjectFlow uses a modular Context API architecture. Instead of placing every state concern in one large provider, the application separates state by responsibility.

```txt
AppProvider
├── AuthProvider
│   └── authentication, user session, onboarding state
├── NotificationProvider
│   └── toasts and notifications
├── UIProvider
│   └── modals, filters, focus mode, sidebar, command palette
├── WorkspaceProvider
│   └── workspaces, projects, workspace switching, persistence
├── ProjectProvider
│   └── current project and filtered task derivation
└── AppBridge
    └── combines context APIs for legacy-compatible component access
```

### Data Model

```js
workspace = {
  id,
  name,
  description,
  members,
  invitations,
  projects,
  settings
}

project = {
  id,
  name,
  color,
  deadline,
  columns,
  tasks,
  activity
}

task = {
  id,
  title,
  desc,
  priority,
  column,
  deadline,
  assignees,
  tag,
  comments,
  attachments,
  checklist,
  createdAt,
  updatedAt
}
```

### State Flow

```txt
User interaction
    ↓
Component event handler
    ↓
Context action / state updater
    ↓
Workspace or UI state changes
    ↓
Derived project/task data recalculates
    ↓
UI rerenders
    ↓
localStorage sync persists state
```

### Persistence Flow

```txt
Initial app load
    ↓
Read localStorage
    ↓
Migrate old project state if needed
    ↓
Create workspace model
    ↓
Render current workspace and project
    ↓
Write changes back to localStorage
```

---

## Application Workflow

The user journey follows a complete SaaS-style product flow:

```txt
Landing Page
    ↓
Login / Signup
    ↓
Onboarding & Personalization
    ↓
Workspace Selection
    ↓
Project Selection
    ↓
Task Management
    ↓
Calendar / Analytics
    ↓
Focus Mode
    ↓
Progress Review Through Activity + Attachments
```

### Workflow Explanation

1. The user starts on the landing page and learns what ProjectFlow does.
2. The user signs up or logs in through mock authentication.
3. Onboarding asks about work type, planning style, visual theme, and teammates.
4. A starter workspace is generated based on onboarding preferences.
5. The user enters the dashboard and selects a project.
6. Tasks are created, assigned, tagged, prioritized, and moved through the Kanban board.
7. Deadlines can be reviewed in the calendar view.
8. Project health can be reviewed in analytics.
9. Task files and comments preserve progress context.
10. Recent Activity helps users understand what changed over time.
11. Focus Mode supports deep execution once planning is complete.

---

## Folder Structure

```txt
projectflow/
├── public/
├── src/
│   ├── components/
│   │   ├── analytics/
│   │   ├── board/
│   │   ├── calendar/
│   │   ├── common/
│   │   ├── landing/
│   │   ├── layout/
│   │   ├── list/
│   │   ├── modals/
│   │   └── notifications/
│   ├── context/
│   ├── data/
│   ├── hooks/
│   ├── pages/
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

### Folder Responsibilities

#### `components/`

Contains reusable UI sections grouped by product area.

- `analytics/`: overview and project insight UI
- `board/`: Kanban columns, task cards, drag/drop board behavior
- `calendar/`: calendar deadline visualization
- `common/`: shared UI like attachments, command palette, focus mode, toasts
- `landing/`: marketing landing page sections
- `layout/`: app shell, header, sidebar, toolbar, activity timeline
- `list/`: table/list task view
- `modals/`: task, project, and detail modal experiences
- `notifications/`: notification panel UI

#### `context/`

Contains global state providers and persistence utilities.

- `AuthContext.jsx`
- `WorkspaceContext.jsx`
- `ProjectContext.jsx`
- `UIContext.jsx`
- `NotificationContext.jsx`
- `AppContext.jsx`
- `storageUtils.js`

#### `data/`

Contains seeded project, task, column, and member data used for the demo experience.

#### `hooks/`

Contains reusable logic such as:

- app actions
- focus timer behavior

#### `pages/`

Contains route-level screens:

- landing
- authentication
- onboarding
- workspace
- settings

#### `utils/`

Contains helper functions for:

- date formatting
- overdue detection
- member lookup
- file size formatting
- local collaborator persistence

#### `index.css`

Contains the full custom styling system:

- design tokens
- dashboard layout
- landing page styles
- onboarding styles
- responsive rules
- component states
- motion-ready interaction styling

---

## UI/UX Design System

ProjectFlow uses a warm editorial SaaS aesthetic. The goal is to feel calm, polished, and focused rather than generic or overly corporate.

### Visual Direction

- cream paper backgrounds
- terracotta accent color
- muted greens, blues, reds, and purples for semantic UI
- serif display headings
- compact SaaS dashboard density
- soft shadows and subtle borders
- restrained motion

### Design Inspiration

| Product | Inspiration |
| --- | --- |
| Asana | Work organization and project clarity |
| ClickUp | Productivity density and multi-view planning |
| Linear | Motion polish and command-driven workflows |
| Notion | Calm workspace feel and editorial simplicity |

### Interaction Philosophy

ProjectFlow avoids overwhelming users with unnecessary decoration. Instead, it uses:

- clear hierarchy
- compact controls
- readable task cards
- contextual panels
- hover feedback
- collapsible information
- animated transitions only where they support understanding

### Responsiveness

The layout adapts through:

- collapsing sidebar behavior
- horizontal board scrolling
- wrapping toolbars
- mobile onboarding layout
- responsive grids
- scaled modals

---

## State Management Analysis

ProjectFlow uses React Context API for global state.

### Global State

Global state includes:

- authenticated user
- onboarding completion
- workspaces
- projects
- current workspace
- current project
- notifications
- active view
- filters
- modals
- focus timer state
- command palette state

### Local State

Local component state is used for:

- modal form inputs
- onboarding step index
- activity panel expanded/collapsed state
- drag state
- search inputs
- invite chip input

### Derived State

Derived state is calculated for:

- current project
- filtered tasks
- overdue tasks
- due today tasks
- recently updated tasks
- completed tasks
- progress percentage

### Persistence

The app writes workspace, project, task, activity, auth, and notification data to localStorage. This keeps the experience persistent across browser refreshes.

---

## Routing System

ProjectFlow uses React Router for page navigation.

Primary routes include:

```txt
/                         Landing page
/login                    Login page
/signup                   Signup page
/onboarding               Personalization flow
/dashboard                Redirect to current workspace
/workspace/:workspaceId   Workspace dashboard
/workspace/:workspaceId/project/:projectId
/calendar                 Calendar view
/analytics                Analytics view
/settings                 Settings page
```

### Protected Routes

Workspace routes are protected. If a user is not authenticated, they are redirected to login.

### Dynamic Routes

Workspace and project routes use URL parameters:

```txt
/workspace/w-default/project/p1
```

This makes navigation more realistic and closer to a production SaaS application.

---

## Animation System

ProjectFlow uses Framer Motion for polished interaction design.

Animation examples:

- landing page reveals
- onboarding step transitions
- activity panel expand/collapse
- modal entrance animations
- task card hover lift
- command palette transitions
- focus mode overlay entrance
- invite chip add/remove animations

The animation style is:

- fast
- subtle
- smooth
- premium
- transform/opacity focused

The goal is to support usability and emotional quality without making the interface feel distracting.

---

## Productivity Features

ProjectFlow is designed around real productivity workflows.

### Focus Timer

The 59:59 focus mode helps users move from planning to execution.

### Analytics

Analytics help users understand project progress, task completion, and workload signals.

### Progress Tracking

Progress bars and task counts show how much work is done, pending, or overdue.

### Deadlines

Deadlines are visible on task cards, calendar views, filters, and analytics.

### Priorities

Tasks can be marked as:

- critical
- high
- medium
- low

### Activity Logs

Activity history helps users understand what happened recently and return to earlier progress.

### Workspace Collaboration

Users can simulate teammate invites and assign members to tasks.

---

## How To Run The Project

### 1. Clone The Repository

```bash
git clone <repository-url>
cd projectflow
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The app will usually run at:

```txt
http://localhost:5173
```

### 4. Build For Production

```bash
npm run build
```

### 5. Run Linting

```bash
npm run lint
```

---

## Example Workflow

Here is a realistic workflow inside ProjectFlow:

1. A user lands on the marketing page and clicks the primary CTA.
2. They create an account using the signup page.
3. During onboarding, they select `Startup`, `Kanban`, and `Warm Professional`.
4. ProjectFlow creates a personalized workspace called `Startup Team`.
5. The user creates a project named `Product Launch`.
6. They add tasks for design, development, QA, marketing, and launch prep.
7. Each task gets a priority, deadline, assignee, tag, and optional attachment.
8. Teammates are simulated through invite chips and assignment controls.
9. Tasks are moved through the Kanban board as work progresses.
10. Comments and files are added to preserve decision history.
11. The Recent Activity panel records progress automatically.
12. The user checks analytics to review completion and overdue work.
13. They open Focus Mode for a deep work session.
14. Days later, they return to attachments and activity logs to understand what changed.

---

## Learning Outcomes

Developers studying this project can learn:

- how to structure a medium-sized React application
- how to split Context API responsibilities
- how to build protected frontend routes
- how to persist complex state with localStorage
- how to design multi-workspace data models
- how to implement Kanban-style task movement
- how to build modals and detail panels
- how to use Framer Motion thoughtfully
- how to create SaaS-style onboarding
- how to design responsive dashboards
- how to balance UI polish with maintainable code
- how to build portfolio projects that feel product-focused

---

## Future Improvements

ProjectFlow is currently a frontend-only application. The next evolution would be turning it into a full-stack collaborative platform.

### Backend Integration

- REST or GraphQL API
- database-backed workspaces
- persistent users, projects, and tasks
- server-side validation

### Real Authentication

- email/password auth
- OAuth login
- refresh tokens
- password reset
- account management

### Cloud File Storage

- upload files to cloud storage
- generate secure file URLs
- support file previews
- handle large documents safely

### Real-Time Collaboration

- websocket updates
- live task movement
- active teammate presence
- real-time comments
- shared activity feeds

### AI Productivity Assistant

- summarize project activity
- suggest next tasks
- detect overdue risk
- generate sprint plans
- summarize uploaded documents

### Recurring Tasks

- daily, weekly, and monthly recurring tasks
- recurring reminders
- habit-style productivity workflows

### Mobile App

- React Native version
- mobile-first task capture
- push notifications
- offline mode

### Advanced Permissions

- owner/admin/member roles
- project-level permissions
- private projects
- invitation controls

### Advanced Analytics

- team velocity
- cycle time
- workload by member
- completion trends
- project health scoring

### Theme System

- full dark mode
- custom workspace themes
- design token customization

---

## Challenges Faced

### localStorage Limitations

localStorage is useful for frontend demos, but it has limitations:

- limited storage size
- no server sync
- no real user isolation
- base64 file data can become heavy

### UI Complexity

ProjectFlow contains many dashboard features. Keeping the interface clear required:

- collapsible panels
- compact controls
- careful spacing
- strong visual hierarchy
- responsive layouts

### Context Scaling

A productivity app has many state concerns. Splitting state into multiple contexts helped reduce complexity while keeping the architecture beginner-friendly.

### Responsive Dashboards

Dashboard UIs are harder to make responsive than landing pages because they contain dense controls, boards, tables, panels, and modals. ProjectFlow addresses this through wrapping toolbars, horizontal board scrolling, and adaptive layouts.

### Animation Balance

Too much animation can make productivity apps feel slow. ProjectFlow uses motion only where it adds clarity, feedback, or premium feel.

### Workspace Synchronization

Switching between workspaces requires keeping URL state, current workspace state, current project state, and persisted settings aligned. The current implementation keeps this simple while still supporting dynamic workspace routes.

---

## Final Project Evaluation

ProjectFlow is an advanced frontend portfolio project that demonstrates both engineering depth and product design thinking.

### Frontend Engineering Quality

The project shows strong understanding of:

- React component architecture
- Context API state management
- derived state
- route-based navigation
- local persistence
- reusable UI patterns
- modular feature organization

### UI/UX Quality

The interface feels closer to a real SaaS product than a basic tutorial app. The warm editorial aesthetic, dashboard density, onboarding flow, motion design, and activity system create a polished user experience.

### Architecture Quality

The architecture is suitable for a frontend-only SaaS prototype. It separates concerns clearly while remaining approachable for learning and extension.

### Portfolio Quality

ProjectFlow is portfolio-ready because it demonstrates:

- product-level thinking
- advanced React concepts
- UI/UX design ability
- realistic workflows
- scalable frontend organization
- thoughtful documentation

### Learning Value

This project is valuable for developers who want to understand how real productivity tools are structured at the frontend level, especially before adding a backend.

---

## Author

**Lokendra Joshi**


ProjectFlow was created as a premium frontend SaaS productivity project to demonstrate modern React architecture, polished interface design, and real-world product workflows.
