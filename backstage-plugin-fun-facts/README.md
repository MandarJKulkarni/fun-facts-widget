# Fun Facts Backstage Widget

Welcome to the **Fun Facts** plugin for Backstage!

This plugin provides a delightful widget for your Backstage home page that displays random fun facts fetched from a PostgreSQL database. It consists of two parts: a frontend widget plugin and an associated backend plugin that exposes the database via a REST API.

## Architecture

The plugin is split into two packages:
- `backstage-plugin-fun-facts`: The frontend React component (the widget).
- `backstage-plugin-fun-facts-backend`: The Node.js Express backend that handles database migrations and provides a CRUD API over the `fun_facts` table.

## Prerequisites

- A running Backstage application.
- A functional PostgreSQL database connection configured in your host application's `app-config.yaml`. (Development setups using SQLite will also work transparently thanks to Backstage's Database manager).

---

## Backend Plugin Setup

The backend plugin handles the database connection, automatic migrations on startup, and exposes the API endpoints used by the widget.

1.  **Add the plugin to your Backstage workspace.**
    Copy the `backstage-plugin-fun-facts-backend` folder into your Backstage app's `plugins/` folder (or symlink it if developing locally).

2.  **Install dependencies.**
    From your Backstage root directory, run:
    ```bash
    yarn add --cwd packages/backend @internal/backstage-plugin-fun-facts-backend
    ```

3.  **Wire up the backend plugin.**
    Open your `packages/backend/src/index.ts` file and add the following line to register the fun facts backend module:
    ```typescript
    import { createBackend } from '@backstage/backend-defaults';

    const backend = createBackend();
    // ... other plugins ...
    
    // Add the Fun Facts backend plugin
    backend.add(import('@internal/backstage-plugin-fun-facts-backend'));
    
    backend.start();
    ```

When you start your Backstage backend, the plugin will automatically create the `fun_facts` table and seed it with an initial set of facts.

---

## Frontend Widget Setup

The frontend plugin provides the UI widget that fetches and displays the facts.

1.  **Add the plugin to your Backstage workspace.**
    Copy the `backstage-plugin-fun-facts` folder into your Backstage app's `plugins/` folder.

2.  **Install dependencies.**
    From your Backstage root directory, run:
    ```bash
    yarn add --cwd packages/app @internal/backstage-plugin-fun-facts
    ```

3.  **Integrate the widget into your App.**
    Open the file where you define your Home Page or Dashboard. Typically, this is `packages/app/src/components/home/HomePage.tsx`.
    
    Import and add the `<FunFactsWidget />` to your grid:
    
    ```tsx
    import React from 'react';
    import { Grid } from '@material-ui/core';
    // Import the widget
    import { FunFactsWidget } from '@internal/backstage-plugin-fun-facts';

    export const homePage = (
      <Grid container spacing={3}>
        {/* ... other standard widgets ... */}
        
        <Grid item xs={12} md={6}>
            {/* Display our fun facts prominently */}
            <FunFactsWidget />
        </Grid>
      </Grid>
    );
    ```

---

## Verification

1. Start your Backstage app:
   ```bash
   yarn dev
   ```
2. Navigate to your Backstage home page.
3. You should see the `🎶 Fun Facts` widget displaying a random fact. Clicking "Next Fact" will cycle through other facts fetched dynamically from your database via the API!

## API Access

If you wish to programmatically interact with the database, the backend exposes standard REST API endpoints. Assuming your backend runs on `localhost:7007`:

- `GET /api/fun-facts/facts` - List all facts
- `POST /api/fun-facts/facts` - Add a new fact (expects `{ "fact": "Your text here" }`)
- `PUT /api/fun-facts/facts/:id` - Update a fact
- `DELETE /api/fun-facts/facts/:id` - Delete a fact
