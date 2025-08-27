# Aveyo Campus - Next.js Implementation

A modern, responsive landing page for Aveyo Campus built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Modern Design**: Dark theme with gradient backgrounds and professional typography
- **Responsive Layout**: Optimized for desktop and mobile devices
- **Performance Optimized**: Built with Next.js 14 for fast loading and SEO
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for rapid styling

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main homepage component
├── public/
│   └── images/              # Static image assets (to be added)
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies
```

## Design System

- **Colors**: Dark theme (#0D0D0D) with white accents
- **Typography**: PP Telegraf font family with Inter fallback
- **Border Radius**: 2px (small), 3px (default)
- **Spacing**: Consistent spacing using Tailwind's scale

## Sections

1. **Hero Section**: Welcome message with call-to-action buttons
2. **Stats Section**: Key performance metrics
3. **Incentives**: Feature cards highlighting benefits
4. **About Section**: Company culture and values
5. **Career Building**: How the program works

## Customization

The design closely follows the Figma specifications with:
- Exact color matching
- Proper typography hierarchy
- Responsive grid layouts
- Interactive hover states

## Deployment

```bash
npm run build
npm start
```

Built with ❤️ for Aveyo Campus
