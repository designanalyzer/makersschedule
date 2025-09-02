# Next.js + TypeScript SaaS Calendar App Structure

This project uses a professional, scalable file structure for a multi-user SaaS calendar app, ready for Supabase integration. The main features include:

- Main calendar view (week view Mon–Sun) with task list sidebar
- Side navbar
- Footer
- Landing page
- Login page
- Profile page
- Reusable layout components (Navbar, Footer, Sidebar)

Below is a diagram of the recommended structure:

```mermaid
graph TD;
  A[client/]
  A --> B[src/]
  B --> C[components/]
  C --> D[layout/]
  D --> E[Navbar.tsx]
  D --> F[Footer.tsx]
  D --> G[Sidebar.tsx]
  C --> H[Calendar.tsx]
  C --> I[TaskList.tsx]
  C --> J[Button.tsx]
  B --> K[app/]
  K --> L[layout.tsx]
  K --> M[page.tsx]
  K --> N[login/page.tsx]
  K --> O[profile/page.tsx]
  K --> P[calendar/page.tsx]
  B --> Q[styles/]
  Q --> R[globals.css]
  Q --> S[tailwind.css]
  B --> T[utils/]
  B --> U[hooks/]
  B --> V[types/]
  B --> W[README.md]
  B --> X[next.config.js]
  B --> Y[tsconfig.json]
  B --> Z[package.json]
```

---

# Original README 