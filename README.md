# Austros ATLA World Encyclopedia

A lightweight encyclopedia for Avatar: The Last Airbender built with React, TypeScript and Vite. Raw markdown data is parsed and enriched into `public/enriched-data.json`, and the search index is built client-side using FlexSearch.

## Tech Stack
- React
- Vite
- TypeScript
- Tailwind CSS
- FlexSearch

## Getting Started
1. `npm install`
2. `npm run build:data` to generate `public/enriched-data.json`
3. `npm run build:tailwind` after any style change
4. `npm run dev` to start the development server

After changing styles or `tailwind.config.js`, run `npm run build:tailwind` to regenerate CSS. 
