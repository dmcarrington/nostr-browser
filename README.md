# NOSTR Relay Browser

A web application for browsing and publishing events on [Nostr](https://nostr.com/) relays. Built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- Connect to any Nostr relay via WebSocket URL
- Browse events with filtering by event kind and author (npub/hex pubkey)
- View event details including content, tags, and metadata
- Post JSON events to a connected relay (kind 30078 application-specific data)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm

## Getting Started

### Install dependencies

```sh
npm install
```

### Run the development server

```sh
npm run dev
```

This starts the Vite dev server with hot module replacement. Open the URL shown in the terminal (typically http://localhost:5173).

### Build for production

```sh
npm run build
```

This runs the TypeScript compiler followed by the Vite production build. Output is written to the `dist/` directory.

### Preview the production build

```sh
npm run preview
```

Serves the `dist/` directory locally so you can verify the production build before deploying.

### Lint

```sh
npm run lint
```

## Usage

1. Enter a Nostr relay WebSocket URL (e.g. `wss://relay.damus.io`) and click **Connect**.
2. Use the **Browse** tab to view events. Filter by event kind or author public key.
3. Use the **Post JSON** tab to publish application-specific data (kind 30078) to the connected relay.

## Tech Stack

- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/) 5.9
- [Vite](https://vite.dev/) 7
- [Tailwind CSS](https://tailwindcss.com/) 4
- [nostr-tools](https://github.com/nbd-wtf/nostr-tools) for Nostr protocol support
