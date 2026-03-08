# Fun Facts Plugin for Backstage

The Fun Facts plugin adds a customizable widget to your Backstage Home page that displays random, interesting facts to your users. Whether it's company trivia, engineering milestones, or just fun general knowledge, this plugin provides an engaging way to share information.

This feature is comprised of two packages:
- **`@internal/backstage-plugin-fun-facts`**: The frontend UI widget.
- **`@internal/backstage-plugin-fun-facts-backend`**: The backend API handling database operations.

## Architecture & Overview

The widget operates using a standard Backstage client-server architecture:

1. **Database:** The backend leverages Backstage's `coreServices.database`. On startup, it automatically runs Knex migrations to create a `fun_facts` table in your PostgreSQL (or SQLite) database and seeds it with default facts.
2. **Backend API:** An Express router exposes aRESTful CRUD API (`GET`, `POST`, `PUT`, `DELETE` at `/api/fun-facts/facts`).
3. **Frontend Client:** The React component uses Backstage's `DiscoveryApi` and `FetchApi` to securely connect to the backend, retrieve the facts, and display them randomly to the user.

---

## 1. Backend Integration

The backend plugin connects to your database and serves the API.

### Installation

Navigate to your Backstage repository root and add the backend plugin to your `packages/backend`:

```bash
yarn add --cwd packages/backend @internal/backstage-plugin-fun-facts-backend
```

### Configuration

Open your backend initialization file (typically `packages/backend/src/index.ts`) and register the Fun Facts backend:

```typescript
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

// ... existing plugins ...

// Add Fun Facts backend
backend.add(import('@internal/backstage-plugin-fun-facts-backend'));

backend.start();
```

The plugin will automatically use your existing database configuration defined in your `app-config.yaml` to create and populate the `fun_facts` table.

---

## 2. Frontend Integration

The frontend plugin contains the actual UI widget you will display to your users.

### Installation

Navigate to your Backstage repository root and add the frontend plugin to your `packages/app`:

```bash
yarn add --cwd packages/app @internal/backstage-plugin-fun-facts
```

### Adding the Widget to the Home Page

Most Backstage instances utilize a Home Plugin to display widgets. You can embed the Fun Facts widget into your existing Home Page grid.

Open your Home Page component (e.g., `packages/app/src/components/home/HomePage.tsx`) and add the widget:

```tsx
import React from 'react';
import { Grid } from '@material-ui/core';

// 1. Import the widget
import { FunFactsWidget } from '@internal/backstage-plugin-fun-facts';

export const homePage = (
  <Grid container spacing={3}>
    
    {/* ... your existing widgets stack ... */}
    
    {/* 2. Add the widget to your layout */}
    <Grid item xs={12} md={6}>
        <FunFactsWidget />
    </Grid>
    
  </Grid>
);
```

---

## Verification & Usage

Once both plugins are installed and wired up:

1. Start your Backstage instance: `yarn dev`
2. Navigate to your Home page in the browser.
3. You should see the **Fun Facts** widget displaying a pulled fact! Click "Next Fact" to cycle through them.

### API Endpoints

You can manage the facts programmatically via the REST API (assuming default local configuration at `http://localhost:7007`):

- **List all facts:** `GET /api/fun-facts/facts`
- **Create a fact:** `POST /api/fun-facts/facts`
  - Body: `{ "fact": "Your new fun fact here!" }`
- **Update a fact:** `PUT /api/fun-facts/facts/:id`
  - Body: `{ "fact": "Updated fact text" }`
- **Delete a fact:** `DELETE /api/fun-facts/facts/:id`
