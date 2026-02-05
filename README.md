# NextJS-Domination

## What Does Next.js Have That React Doesn't?

Next.js simplifies the development process and optimizes applications by providing a comprehensive framework built on top of React.

---

## Key Benefits

### 1. Architecture: Server & Client Components

**React:**
- Has functional and class-based components
- Components render primarily on the client side

**Next.js:**
- Components are categorized by where they run:
  - **Client Components**: Run in the browser (require `'use client'` directive)
  - **Server Components**: Run on the server (default behavior)
- Next.js automatically converts every component to a server component unless you specify otherwise
- Only use client components when you need browser-specific functionalities (event handlers, hooks like `useState`, browser APIs)

**Benefits:**
- Reduced JavaScript bundle size sent to the client
- Better security (sensitive data stays on server)
- Improved initial page load performance
- Direct access to backend resources (databases, file systems)

**Understanding Server Components:**
Since they are rendered on the server, they can access server-side resources directly (databases, file systems). This helps to reduce the amount of JavaScript sent to the client, improving performance. Server components are excellent when you need direct access to server-side resources like accessing files in a file system or when you want to keep sensitive information (such as access tokens and other keys) safe on the server.

**Understanding Client Components:**
Client components are rendered on the client side (browser). To use them in Next.js, you must add a `'use client'` directive at the top of the component.

Client components are pre-rendered on the server side to create a static shell and then hydrated on the client side. This means everything within the client component that doesn't require interactivity or isn't dependent on the browser is still rendered on the server. The code or parts that rely on the browser or require interactivity are left as placeholders during server-side pre-rendering. When they reach the client, the browser then renders the client components and fills in the placeholders left by the server.

**When to Use Each:**
- **Server Components** (default): Use for data fetching, accessing backend resources, keeping sensitive information on server
- **Client Components** (`'use client'`): Use when you need browser interactivity (clicking buttons, navigating, submitting forms, using hooks like `useState`, `useEffect`)

**Best Practice:**
Leave components as server-side components until you need browser interactivity, at which point you'll most likely get an error, then you can add the `'use client'` directive at the top.

---

### 2. Advanced Rendering Strategies

React 19 supports server components, but Next.js extends them with multiple rendering strategies:

#### 2.1. Client-Side Rendering (CSR)
- Happens in the browser
- Server sends minimal HTML and JavaScript
- Browser executes JavaScript to render components
- **Use case**: Highly interactive dashboards, real-time applications

#### 2.2. Server-Side Rendering (SSR)
- Webpage is rendered on the server before being sent to the browser
- Server processes and renders components
- Sends fully rendered HTML to the client
- **Use case**: Dynamic content that changes frequently, personalized pages

#### 2.3. Static Site Generation (SSG)
- Pages are pre-rendered at build time
- HTML is generated once and reused for each request
- **Use case**: Blogs, documentation, marketing pages

#### 2.4. Incremental Static Regeneration (ISR)
- Update static content after deployment without rebuilding the entire site
- Combines benefits of static and dynamic rendering
- **Use case**: E-commerce product pages, news sites

**Why Does It Matter?**

**SEO Benefits:**
- Client-side rendering makes it difficult for search engines to crawl and index websites (empty HTML initially)
- Next.js solves this by sending pre-rendered HTML, giving search engines plenty of content to rank
- Better Core Web Vitals scores
- Faster time-to-first-byte (TTFB)

---

### 3. File-Based Routing

**React:**
- Requires third-party libraries like React Router
- Manual route configuration
- Complex setup for nested routes

**Next.js:**
- Uses file-based routing system
- Each folder's name becomes a route path
- Special files: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- Automatic route handling and code splitting

**Example Structure:**
```
app/
├── page.tsx              → /
├── about/
│   └── page.tsx          → /about
├── blog/
│   ├── page.tsx          → /blog
│   └── [slug]/
│       └── page.tsx      → /blog/post-title
└── dashboard/
    ├── layout.tsx
    └── page.tsx          → /dashboard
```

**Advanced Routing Features:**
- Dynamic routes: `[id]`, `[slug]`
- Catch-all routes: `[...slug]`
- Parallel routes: `@folder`
- Intercepting routes: `(..)folder`
- Route groups: `(group)`

---

### 4. Automatic Code Splitting

**React:**
- Possible but requires manual configuration
- Becomes complex as the app grows
- Requires `React.lazy()` and `Suspense`

**Next.js:**
- Automated by default
- Each route only loads the code it needs
- Significantly speeds up page load times
- Reduces initial bundle size

**Benefits:**
- Faster initial page loads
- Better performance on slower networks
- Improved user experience

---

### 5. Built-In Optimizations

#### Font Optimization
- Reduces layout shifts (Cumulative Layout Shift - CLS)
- Pre-loads font files automatically
- Reduces reliance on external services like Google Fonts
- Uses `next/font` for automatic font optimization

**Example:**
```typescript
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
```

#### Image Optimization
- Automatic image compression
- Lazy loading by default
- Responsive images with `srcset`
- WebP/AVIF format conversion
- CDN support
- Prevents Cumulative Layout Shift

**Example:**
```typescript
import Image from 'next/image'

<Image 
  src="/photo.jpg" 
  alt="Description"
  width={500}
  height={300}
  priority={false}
/>
```

#### Script Optimization
- Optimizes third-party scripts
- Controls loading strategy (`beforeInteractive`, `afterInteractive`, `lazyOnload`)
- Prevents scripts from blocking page rendering

**Example:**
```typescript
import Script from 'next/script'

<Script 
  src="https://analytics.example.com/script.js"
  strategy="afterInteractive"
/>
```

---

### 6. API Routes & Server Actions

**Built-in Backend:**
- Create API endpoints without a separate backend server
- Full-stack development in one framework
- Serverless function support

**API Routes Example:**
```typescript
// app/api/users/route.ts
export async function GET() {
  const users = await db.users.findMany()
  return Response.json(users)
}
```

**Server Actions:**
- Call server-side functions directly from client components
- No need to create API endpoints for simple operations
- Built-in security and validation

**Example:**
```typescript
'use server'

export async function createUser(formData: FormData) {
  const name = formData.get('name')
  await db.user.create({ data: { name } })
}
```

---

### 7. Middleware

- Run code before a request is completed
- Modify responses, redirect, or rewrite URLs
- Authentication and authorization
- A/B testing and feature flags

**Example:**
```typescript
// middleware.ts
import { NextResponse } from 'next/server'

export function middleware(request) {
  if (!request.cookies.get('token')) {
    return NextResponse.redirect('/login')
  }
}
```

---

### 8. Data Fetching

**Multiple Strategies:**

#### Server Components (Recommended)
```typescript
async function Page() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'force-cache' // or 'no-store' for dynamic data
  })
  return <div>{data.title}</div>
}
```

#### Client Components
```typescript
'use client'
import { useEffect, useState } from 'react'

function Page() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
  }, [])
}
```

**Caching & Revalidation:**
- Request memoization
- Data caching with custom revalidation periods
- On-demand revalidation

---

### 9. Development Experience

**Fast Refresh:**
- Instant feedback on edits
- Preserves component state
- Better than traditional hot module replacement

**TypeScript Support:**
- Built-in TypeScript support
- Automatic type checking
- Better IDE integration

**Error Handling:**
- Detailed error messages
- Error boundaries with `error.tsx`
- Custom 404 pages with `not-found.tsx`

**Environment Variables:**
- Built-in support for `.env` files
- Server-only and client-side variables
- Type-safe environment variables

---

### 10. Deployment & Scaling

**Automatic Scaling:**
- Next.js takes care of scaling automatically
- Works seamlessly with Vercel (zero-config deployment)
- Compatible with other platforms (AWS, Azure, GCP)

**Edge Runtime:**
- Deploy functions globally at the edge
- Reduced latency for users worldwide
- Faster response times

**Build Optimizations:**
- Automatic tree shaking
- Minification and compression
- Output file tracing

---

### 11. Metadata & SEO

Next.js provides powerful built-in tools for managing metadata and improving SEO:

#### Static Metadata
Define metadata in your `layout.tsx` or `page.tsx`:

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Website',
  description: 'Welcome to my awesome website',
  keywords: ['Next.js', 'React', 'JavaScript'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'My Website',
    description: 'Welcome to my awesome website',
    url: 'https://mywebsite.com',
    siteName: 'My Website',
    images: [
      {
        url: 'https://mywebsite.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Website',
    description: 'Welcome to my awesome website',
    creator: '@yourusername',
    images: ['https://mywebsite.com/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
```

#### Dynamic Metadata
Generate metadata based on route parameters:

```typescript
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetchPost(params.slug);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default function BlogPost({ params }: Props) {
  // Your page component
}
```

#### JSON-LD for Structured Data
Add structured data for better search engine understanding:

```typescript
// app/blog/[slug]/page.tsx
export default function BlogPost({ post }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.coverImage,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>{/* Your content */}</article>
    </>
  );
}
```

#### Sitemap Generation
Create a sitemap for better crawling:

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://mywebsite.com/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: 'https://mywebsite.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://mywebsite.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...postEntries,
  ];
}
```

#### Robots.txt
Create a robots.txt file:

```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://mywebsite.com/sitemap.xml',
  };
}
```

---

## When to Use Next.js vs React

### Use **React** when:
- Building a simple single-page application (SPA)
- SEO is not a priority
- You need maximum flexibility in choosing tools
- Building a component library

### Use **Next.js** when:
- SEO is critical (blogs, e-commerce, marketing sites)
- You need server-side rendering or static generation
- You want built-in optimizations out of the box
- You're building a full-stack application
- Performance is a top priority
- You want a batteries-included framework

---

## Conclusion

Next.js extends React with powerful features that solve common web development challenges. It provides:

✅ Superior SEO capabilities  
✅ Multiple rendering strategies  
✅ Built-in performance optimizations  
✅ File-based routing  
✅ Full-stack capabilities  
✅ Excellent developer experience  
✅ Production-ready features out of the box  

All these great optimizations and features come right out of the box with Next.js, making it the go-to choice for modern React applications that need to scale.

---

## Getting Started

### Installation

Create a new Next.js application using the latest version:

```bash
npx create-next-app@latest
```

During setup, you'll be prompted to configure:
- Project name
- TypeScript (recommended: Yes)
- ESLint (recommended: Yes)
- Tailwind CSS (recommended: Yes)
- `src/` directory (optional)
- App Router (recommended: Yes)
- Import alias customization

### Running the Development Server

```bash
npm run dev
```

Your application will be available at `http://localhost:3000`

### Other Useful Commands

```bash
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

---

## New Features in Next.js 15+

### Turbopack File System Caching

Turbopack is Next.js's new bundler that provides significantly faster compile times across restarts. All internal Vercel apps are already using this feature.

**Benefits:**
- Up to 76.7% faster local server startup
- Up to 96.3% faster code updates with Fast Refresh
- Up to 45.8% faster initial route compile

**How to Enable:**

In `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  }
};

export default nextConfig;
```

**Note:** This feature is currently experimental but highly stable and recommended for all projects.

---

## Project Structure

Understanding your Next.js project structure is crucial for efficient development. Here's what each file and folder does:

### Configuration Files

#### `tsconfig.json`
TypeScript configuration file that defines:
- What should be type-checked
- Files to ignore
- Compiler options
- Type checking rules
- Path aliases

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### `postcss.config.mjs`
Configuration file for PostCSS, a tool that processes CSS with plugins:
- Autoprefixer (adds vendor prefixes)
- Tailwind CSS integration
- CSS nesting
- Minification

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

#### `package.json`
Defines your project's:
- Dependencies and devDependencies
- Scripts (dev, build, start, lint)
- Project metadata (name, version)
- Engine requirements

```json
{
  "name": "my-nextjs-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "^15.0.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "^15.0.0"
  }
}
```

#### `package-lock.json`
Automatically generated file that:
- Locks exact versions of all dependencies
- Ensures consistent installs across environments
- Records the dependency tree
- Should be committed to version control

#### `next-env.d.ts`
TypeScript declaration file for Next.js:
- Auto-generated (do not edit)
- Provides Next.js type definitions
- Ensures TypeScript recognizes Next.js types
- Automatically updated when you run the dev server

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
```

#### `next.config.ts`
Main configuration file for Next.js features:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  
  // Image optimization domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: 'my-value',
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ];
  },
  
  // Headers
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

#### `eslint.config.mjs`
ESLint configuration for code linting:
- Enforces code style and best practices
- Catches common errors
- Integrates with Next.js rules

```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
```

### Folders

#### `public/`
Contains static assets:
- Images, fonts, icons
- Served directly at the root URL
- Not processed by webpack
- Files accessible via `/filename.ext`

**Example:**
```
public/
├── favicon.ico
├── logo.png
├── fonts/
│   └── custom-font.woff2
└── images/
    └── hero.jpg
```

Access in your code:
```typescript
<Image src="/logo.png" alt="Logo" width={100} height={100} />
```

#### `app/`
The heart of your Next.js application using the App Router:

**Core Files:**

##### `page.tsx` - Route Component
- Defines the UI for a specific route
- The root `page.tsx` represents the homepage (`/`)
- Must be present to make a route publicly accessible
- Always a **Server Component** by default (unless marked with `'use client'`)

**Example:**
```typescript
// app/page.tsx - This is your homepage at "/"
export default function Home() {
  return (
    <main>
      <h1>Welcome to Next.js!</h1>
      <p>This is your homepage</p>
    </main>
  );
}
```

**Dynamic Routes Example:**
```typescript
// app/blog/[slug]/page.tsx - This handles /blog/any-post-title
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <article>Blog post: {params.slug}</article>;
}
```

##### `layout.tsx` - Main Entry Point & Wrapper
- The **root layout** is the main entry point of your application
- Wraps all pages and nested layouts
- Required in the root `app/` directory
- Persists across route changes (doesn't re-render)
- Can define shared UI like headers, footers, navigation
- Must include `<html>` and `<body>` tags in the root layout

**Example:**
```typescript
// app/layout.tsx - Root layout (required)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My Next.js App',
  description: 'Created with Next.js 15',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <nav>Navigation here</nav>
        </header>
        {children} {/* Your page content renders here */}
        <footer>Footer here</footer>
      </body>
    </html>
  );
}
```

**Nested Layouts Example:**
```typescript
// app/dashboard/layout.tsx - Layout only for dashboard routes
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard">
      <aside>Sidebar</aside>
      <main>{children}</main>
    </div>
  );
}
```

##### `globals.css` - Global Styles
- Contains global CSS styles for your entire application
- Imported in the root `layout.tsx`
- Applies to all routes
- Typically includes:
  - CSS resets
  - Tailwind directives
  - Global typography
  - CSS variables
  - Base styles

**Example:**
```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

a {
  color: inherit;
  text-decoration: none;
}
```

##### `favicon.ico` - Site Icon
- Your website's favicon (the small icon in browser tabs)
- Placed in the `app/` directory
- Automatically served at `/favicon.ico`
- Supported formats: `.ico`, `.png`, `.svg`
- Can also create dynamic favicons using `icon.tsx` or `apple-icon.tsx`

**Static Favicon:**
```
app/
└── favicon.ico          # Simple approach
```

**Dynamic Favicon (Advanced):**
```typescript
// app/icon.tsx - Generate dynamic favicon
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        N
      </div>
    ),
    { ...size }
  );
}
```

**Additional Core Files:**
- `loading.tsx` - Loading UI that shows while content is loading
- `error.tsx` - Error boundary for handling errors
- `not-found.tsx` - Custom 404 page

**Example Structure:**
```
app/
├── layout.tsx              # Root layout (required)
├── page.tsx                # Home page (/)
├── loading.tsx             # Loading UI
├── error.tsx               # Error handling
├── not-found.tsx           # 404 page
├── globals.css             # Global styles
│
├── about/
│   └── page.tsx            # /about
│
├── blog/
│   ├── page.tsx            # /blog
│   ├── loading.tsx         # Loading UI for blog
│   └── [slug]/
│       └── page.tsx        # /blog/[slug]
│
├── dashboard/
│   ├── layout.tsx          # Dashboard layout
│   ├── page.tsx            # /dashboard
│   ├── settings/
│   │   └── page.tsx        # /dashboard/settings
│   └── profile/
│       └── page.tsx        # /dashboard/profile
│
├── api/
│   ├── users/
│   │   └── route.ts        # API: /api/users
│   └── posts/
│       └── [id]/
│           └── route.ts    # API: /api/posts/[id]
│
└── components/             # Reusable components (optional)
    ├── Header.tsx
    ├── Footer.tsx
    └── ui/
        ├── Button.tsx
        └── Card.tsx
```

**Special Files in App Router:**

| File | Purpose |
|------|---------|
| `layout.tsx` | Shared UI for a segment and its children |
| `page.tsx` | Unique UI of a route and make routes publicly accessible |
| `loading.tsx` | Loading UI for a segment and its children |
| `not-found.tsx` | Not found UI for a segment and its children |
| `error.tsx` | Error UI for a segment and its children |
| `global-error.tsx` | Global error UI |
| `route.ts` | Server-side API endpoint |
| `template.tsx` | Re-rendered layout UI |
| `default.tsx` | Fallback UI for Parallel Routes |

#### `src/` (Optional)
Some developers prefer to organize code inside a `src/` directory:

```
src/
└── app/              # Same as app/ folder
    ├── layout.tsx
    ├── page.tsx
    └── ...
```

**Benefits:**
- Cleaner root directory
- Separation of code from config files
- Familiar to developers from other frameworks

#### `node_modules/`
Contains all installed npm packages:
- Auto-generated by npm/yarn/pnpm
- Should NOT be committed to git
- Always listed in `.gitignore`

#### `.next/`
Build output directory:
- Generated during `npm run build` or `npm run dev`
- Contains optimized production code
- Should NOT be committed to git
- Automatically regenerated

---

## Common Patterns & Real-World Examples

### 1. Authentication Pattern

**Server-Side Session Check:**
```typescript
// app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

export default async function DashboardPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login');
  }
  
  return <div>Welcome, {session.user.name}!</div>;
}
```

**Middleware Protection:**
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  
  // Protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};
```

### 2. Data Fetching Patterns

**Parallel Data Fetching:**
```typescript
// app/dashboard/page.tsx
async function getUser() {
  const res = await fetch('https://api.example.com/user');
  return res.json();
}

async function getPosts() {
  const res = await fetch('https://api.example.com/posts');
  return res.json();
}

export default async function Dashboard() {
  // These run in parallel!
  const [user, posts] = await Promise.all([
    getUser(),
    getPosts(),
  ]);
  
  return (
    <div>
      <h1>{user.name}</h1>
      <PostList posts={posts} />
    </div>
  );
}
```

**Sequential Data Fetching:**
```typescript
// app/user/[id]/page.tsx
async function getUser(id: string) {
  const res = await fetch(`https://api.example.com/user/${id}`);
  return res.json();
}

async function getUserPosts(userId: string) {
  const res = await fetch(`https://api.example.com/posts?userId=${userId}`);
  return res.json();
}

export default async function UserPage({ params }: { params: { id: string } }) {
  // First get user
  const user = await getUser(params.id);
  // Then get their posts (needs user.id)
  const posts = await getUserPosts(user.id);
  
  return (
    <div>
      <UserProfile user={user} />
      <UserPosts posts={posts} />
    </div>
  );
}
```

**Client-Side Data Fetching:**
```typescript
'use client'

import { useEffect, useState } from 'react';

export default function RealTimeData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/realtime');
      const json = await res.json();
      setData(json);
      setLoading(false);
    }
    
    fetchData();
    
    // Poll every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return <div>{JSON.stringify(data)}</div>;
}
```

### 3. Form Handling with Server Actions

**Simple Form:**
```typescript
// app/contact/page.tsx
import { redirect } from 'next/navigation';

async function submitForm(formData: FormData) {
  'use server'
  
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');
  
  // Save to database
  await db.messages.create({
    data: { name, email, message }
  });
  
  redirect('/thank-you');
}

export default function ContactPage() {
  return (
    <form action={submitForm}>
      <input name="name" required />
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button type="submit">Send</button>
    </form>
  );
}
```

**Form with Validation:**
```typescript
// app/actions/user.ts
'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().min(18),
});

export async function createUser(formData: FormData) {
  const validatedFields = userSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    age: Number(formData.get('age')),
  });
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  await db.user.create({
    data: validatedFields.data,
  });
  
  revalidatePath('/users');
  return { success: true };
}
```

### 4. Loading States

**Streaming with Suspense:**
```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react';

async function UserData() {
  const user = await fetch('https://api.example.com/user', {
    cache: 'no-store'
  }).then(r => r.json());
  
  return <div>{user.name}</div>;
}

async function Posts() {
  // Simulate slow API
  await new Promise(resolve => setTimeout(resolve, 3000));
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  
  return <PostList posts={posts} />;
}

export default function Dashboard() {
  return (
    <div>
      <Suspense fallback={<div>Loading user...</div>}>
        <UserData />
      </Suspense>
      
      <Suspense fallback={<div>Loading posts...</div>}>
        <Posts />
      </Suspense>
    </div>
  );
}
```

**Using loading.tsx:**
```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
    </div>
  );
}
```

### 5. Error Handling

**Error Boundary:**
```typescript
// app/dashboard/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

**Not Found Page:**
```typescript
// app/blog/[slug]/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>Post Not Found</h2>
      <p>Could not find the requested blog post.</p>
      <a href="/blog">Back to Blog</a>
    </div>
  );
}
```

### 6. Revalidation Strategies

**Time-based Revalidation (ISR):**
```typescript
// Revalidate every hour
export const revalidate = 3600;

async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 }
  });
  return res.json();
}
```

**On-Demand Revalidation:**
```typescript
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  
  if (secret !== process.env.REVALIDATION_SECRET) {
    return Response.json({ message: 'Invalid secret' }, { status: 401 });
  }
  
  // Revalidate specific path
  revalidatePath('/blog');
  
  // Or revalidate by tag
  revalidateTag('posts');
  
  return Response.json({ revalidated: true });
}
```

**Tagged Cache:**
```typescript
// Fetch with tags
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { tags: ['posts'] }
  });
  return res.json();
}

// Revalidate all requests tagged with 'posts'
revalidateTag('posts');
```

### 7. Database Integration

**Using Prisma:**
```typescript
// app/posts/page.tsx
import { prisma } from '@/lib/prisma';

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>By {post.author.name}</p>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  );
}
```

### 8. Internationalization (i18n)

**Basic Setup:**
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'es', 'fr'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = 'en'; // Default locale
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}
```

**Language-specific Content:**
```typescript
// app/[lang]/page.tsx
const dictionaries = {
  en: {
    welcome: 'Welcome',
    description: 'This is the homepage',
  },
  es: {
    welcome: 'Bienvenido',
    description: 'Esta es la página principal',
  },
};

export default function Home({ params }: { params: { lang: string } }) {
  const dict = dictionaries[params.lang] || dictionaries.en;
  
  return (
    <div>
      <h1>{dict.welcome}</h1>
      <p>{dict.description}</p>
    </div>
  );
}
```

---

## Best Practices

### Project Organization

1. **Use the `app/` Directory Structure**
   - Keep route-specific components in their route folders
   - Share common components in `app/components/` or `src/components/`
   - Use route groups `(group)` for organization without affecting URLs

2. **File Naming Conventions**
   - Use PascalCase for component files: `UserCard.tsx`
   - Use kebab-case for utility files: `format-date.ts`
   - Use lowercase for route folders: `blog/`, `dashboard/`

3. **Environment Variables**
   - Use `.env.local` for local development secrets
   - Use `.env.production` for production-specific variables
   - Prefix client-side variables with `NEXT_PUBLIC_`
   - Never commit `.env.local` to git

4. **Import Aliases**
   - Use `@/` for cleaner imports: `import { Button } from '@/components/ui/Button'`
   - Configured in `tsconfig.json` under `paths`

5. **Type Safety**
   - Always use TypeScript
   - Define interfaces for props and data structures
   - Enable strict mode in `tsconfig.json`

### Performance Optimization

1. **Images**
   - Always use `next/image` component
   - Specify width and height
   - Use `priority` for above-the-fold images

2. **Fonts**
   - Use `next/font` for optimal font loading
   - Prefer variable fonts when possible

3. **Code Splitting**
   - Use dynamic imports for heavy components:
   ```typescript
   const HeavyComponent = dynamic(() => import('./HeavyComponent'))
   ```

4. **Caching**
   - Use appropriate caching strategies in fetch requests
   - Leverage ISR for semi-static content

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js GitHub](https://github.com/vercel/next.js)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [Next.js Discord Community](https://discord.gg/nextjs)
- [Vercel Deployment Docs](https://vercel.com/docs)

---

## Quick Reference

### Common Commands
```bash
npx create-next-app@latest          # Create new app
npm run dev                         # Start development server
npm run build                       # Build for production
npm run start                       # Start production server
npm run lint                        # Run ESLint
```

### Important Conventions
- Server Components by default (no `'use client'`)
- Use `'use client'` for interactivity
- Use `'use server'` for server actions
- File-based routing in `app/` directory
- Special files: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`

### Component Decision Flow
```
Need browser interactivity? (onClick, useState, etc.)
├─ YES → Use Client Component ('use client')
└─ NO  → Use Server Component (default)
```

---

**Last Updated:** January 2026  
**Next.js Version:** 15.x  
**React Version:** 19.x

# Next.js 16 - Complete Routing & Layouts Guide

## React Compiler Support (Stable)

Next.js 16 introduces built-in integration for **automatic memoization** using the React Compiler. This eliminates the need for manual `useMemo` and `useCallback` hooks.

### How It Works
- Automatically memoizes components to reduce unnecessary re-renders
- Analyzes code at build time and optimizes rendering behavior
- No manual optimization required

### Setup

**Install the plugin:**
```bash
npm install babel-plugin-react-compiler@latest
```

**Enable in `next.config.ts`:**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true, // Enable React Compiler
  experimental: {
    turbopackFileSystemCacheForDev: true,
  }
};

export default nextConfig;
```

---

## File-Based Routing

Next.js uses **file-based routing** where pages and layouts exist within the `/app` folder. Components that are not pages should be placed in a separate `/components` folder outside `/app`.

### Basic Route Example

**File:** `/app/about/page.tsx`
```tsx
const Page = () => {
  return (
    <div>
      <h1>About</h1>
    </div>
  );
};

export default Page;
```

**URL:** `localhost:3000/about`

### Key Differences
- **React:** Uses React Router
- **Next.js:** Uses file-based routing where folder names become route names
- `page.tsx` is a special file that renders the UI for that route

---

## Nested Routes

For routes like `/dashboard/users` and `/dashboard/analytics`, use **nested folders**.

**File:** `/app/dashboard/users/page.tsx`
```tsx
const Users = () => {
  return (
    <div>
      <h1>Dashboard Users</h1>
      
      <ul className="mt-10">
        <li>User-1</li>
        <li>User-2</li>
        <li>User-3</li>
        <li>User-4</li>
      </ul>
    </div>
  );
};

export default Users;
```

**File:** `/app/dashboard/analytics/page.tsx`
```tsx
const Analytics = () => {
  return (
    <div>
      <h1>Analytics Page</h1>
    </div>
  );
};

export default Analytics;
```

---

## Dynamic Routes

Dynamic routes allow parts of the URL to change based on user input or data. To create a dynamic route, wrap the changing part in **square brackets**.

### Example: User Details

**File:** `/app/dashboard/users/[id]/page.tsx`
```tsx
const UserDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  
  return (
    <div>
      <h1>Showing details for user #{id}</h1>
    </div>
  );
};

export default UserDetails;
```

**URLs:**
- `dashboard/users/user1`
- `dashboard/users/user2`
- `dashboard/users/user3`

### Page Params
The value in `[id]` gets populated in the `params` object, which you can access in your component.

---

## Layouts

Layouts allow you to share UI elements (like navbars and footers) across multiple pages.

### Root Layout

**File:** `/app/layout.tsx`
```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Welcome to Next.js!",
  description: "Check out Next.js for more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        Navbar
        {children}
        Footer
      </body>
    </html>
  );
}
```

### Nested Layout (Dashboard)

**File:** `/app/dashboard/layout.tsx`
```tsx
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <p>Dashboard Navbar</p>
      {children}
    </div>
  );
};

export default Layout;
```

**Important:** Name nested layouts as `layout.tsx` (same as root layout) so Next.js can recognize them.

---

## Route Groups

Route Groups allow you to organize route segments and project structure **without impacting the URL path**. This is useful when you want separate layouts for different sections of your app.

### Use Case
You want different navbars for dashboard and non-dashboard routes, but don't want the root layout to appear in dashboard routes.

### How It Works
Wrap folder names in **parentheses** `()` to create route groups that won't show up in the URL.

**Structure:**
```
/app/(dashboard)  → All dashboard-related routes
/app/(root)       → Non-dashboard routes
```

### Example: Separate Layouts

**File:** `/app/(root)/layout.tsx`
```tsx
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <p>Navbar</p>
      {children}
    </div>
  );
};

export default Layout;
```

**File:** `/app/(dashboard)/layout.tsx`
```tsx
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <p>Dashboard Navbar</p>
      {children}
    </div>
  );
};

export default Layout;
```

### Next.js 16 Enhancement: Layout Deduplication

**Optimized navigations and prefetching** with layout deduplication and incremental prefetching make transitions much faster.

**How it works:**
- When prefetching multiple URLs that share the same layout, the layout is downloaded **only once** instead of per link
- This optimization happens **automatically** with no code changes required
- This is the **biggest update** in Next.js 16 routing

---

## Error Handling

Next.js provides a special **`error.tsx`** file to catch errors and display them in a custom UI.

### Creating an Error Boundary

Similar to layouts, you can create multiple `error.tsx` files for different routes or route groups.

**Example: Throwing an Error**

**File:** `/app/(root)/about/page.tsx`
```tsx
const Page = () => {
  throw new Error("Not implemented");
  
  return (
    <div>
      <h1>About Page</h1>
    </div>
  );
};

export default Page;
```

### Custom Error UI

Instead of seeing the default error screen, create a custom error UI.

**File:** `/app/(root)/error.tsx`
```tsx
'use client' // Error boundaries must be Client Components
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={() => reset()} // Attempt to recover by re-rendering
      >
        Try again
      </button>
    </div>
  )
}
```

### Important Notes
- **Error files must be Client Components** (`'use client'`)
- Only the **closest error file** to the route takes priority
- Unlike `layout.tsx` which displays everything from its parent, the error file works differently
- You won't see content from both `global-error.tsx` and route-specific `error.tsx`
- Errors **bubble up** to the nearest parent error file, not all of them

### Global Error Handling

**File:** `/app/global-error.tsx`
```tsx
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong globally!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
```

---

## Loading UI

The **`loading.tsx`** file shows a loading progress indicator while data is being fetched. This is especially useful for users with slow internet connections.

### How It Works
- Works very similarly to error handling
- Shows loading progress while data is being fetched
- As simple as adding a new `loading.tsx` file within the app

### How to Create a Loading UI

**File:** `/app/loading.tsx` or `/app/(dashboard)/loading.tsx`
```tsx
export default function Loading() {
  return (
    <div>
      <p>Loading...</p>
      {/* Add your spinner or skeleton UI here */}
    </div>
  );
}
```

### Benefits
- Automatically displays while the page is loading
- Can be placed at different route levels for granular control
- Improves user experience during data fetching

---

## Next.js 16: Unauthorized & Forbidden Files

Next.js 16 introduces special **`unauthorized.tsx`** and **`forbidden.tsx`** files that work similarly to `loading.tsx`.

### Unauthorized File

**File:** `/app/unauthorized.tsx`
```tsx
export default function Unauthorized() {
  return (
    <div>
      <h1>401 - Unauthorized</h1>
      <p>You need to log in to access this page.</p>
    </div>
  );
}
```

### Forbidden File

**File:** `/app/forbidden.tsx`
```tsx
export default function Forbidden() {
  return (
    <div>
      <h1>403 - Forbidden</h1>
      <p>You don't have permission to access this resource.</p>
    </div>
  );
}
```

### Use Cases
- Display custom UI for authentication errors (401)
- Show permission-denied messages (403)
- Improve user experience with proper error messaging
- Work similarly to loading UI

---

## Summary of Special Files

Next.js uses special file naming conventions for different purposes:

| File Name | Purpose | Client/Server | Notes |
|-----------|---------|---------------|-------|
| `page.tsx` | Route UI | Server/Client | Defines the UI for a route |
| `layout.tsx` | Shared UI | Server/Client | Wraps child routes, persists across navigation |
| `error.tsx` | Error UI | **Client** | Catches and displays errors |
| `loading.tsx` | Loading UI | Server/Client | Shows while content loads |
| `unauthorized.tsx` | 401 Error | Server/Client | Custom unauthorized page (Next.js 16) |
| `forbidden.tsx` | 403 Error | Server/Client | Custom forbidden page (Next.js 16) |
| `global-error.tsx` | Global Error | **Client** | Catches errors not caught by other error boundaries |

---

## Summary

Next.js 16 provides powerful routing features:

✅ **React Compiler** for automatic optimization  
✅ **File-based routing** with nested routes  
✅ **Dynamic routes** using `[param]` syntax  
✅ **Layouts** for shared UI elements  
✅ **Route Groups** `(folder)` for organization without URL impact  
✅ **Layout Deduplication** for faster navigation (biggest update!)  
✅ **Error handling** with `error.tsx`  
✅ **Loading states** with `loading.tsx`  
✅ **Unauthorized/Forbidden** pages for better UX (New in Next.js 16!)  

All these features work together to create a fast, organized, and user-friendly application structure with automatic optimizations.