#  WASLA (وصلة)
### Social Connection & Analytics Web App

A modern social networking and engagement platform built with **Angular Standalone Components, Signals, and Lazy Loading**, featuring a distinctive Burgundy & Cream visual identity.

---

##  About the Project

**WASLA (وصلة)** is a modern, high-performance social networking platform designed for developers and creators.

The application focuses on smooth user experiences, instant interactions through Optimistic UI, and client-side engagement analytics that track likes, comments, and saved bookmarks.

Built with modern Angular architecture, WASLA combines responsive design, reusable components, authentication, and personalized user experiences.

---

## Key Features

###  1. Core Features

- **Authentication System **
  - Sign in and two-step sign-up process.
  - Reactive Forms with validation.
  - Email validation and password matching.


- **Home Feed**
  - Three-column desktop layout.
  - Interactive "Who to Follow" section.
  - Feed filters: All, Following, and Me.
  - Inline post composer.
  - Infinite scrolling.

- **Post Interactions**
  - Like and bookmark posts instantly.
  - Optimistic UI with automatic rollback on errors.

- **Comments & Replies**
  - Dedicated post details page ).
  - Nested comment replies.
  - Comment likes.

- **Notifications**
  - Automatic polling for new notifications.
  - Unread notification badges.
  - Mark all notifications as read.
  - Polling optimisation using the Page Visibility API.

- **User Profile & Analytics**
  - Profile cover and avatar upload.
  - User posts and saved bookmarks.
  - Engagement analytics for likes, comments, and bookmarks.
  - Dynamic analytics visualisation.

- **Settings & Preferences**
  - Password change.
  - Theme preferences.
  - Internationalisation (i18n) support.

###  2. Advanced Features

- **Theme Switching:** Light, Dark, and Midnight Yellow accent themes.
- **RTL / LTR Support:** Flexible layouts using CSS Logical Properties.
- **Smart Polling:** Automatically pauses and resumes polling when the browser tab becomes hidden or visible.
- **Draft Autosave:** Automatically saves post drafts using `localStorage`.
- **Responsive Design:** Adaptable layouts for desktop, tablet, and mobile devices.

---

##  Tech Stack

| Technology | Purpose |
|---|---|
| Angular 20+ | Frontend framework |
| Standalone Components | Modular application architecture |
| Angular Signals | Reactive state management |
| TypeScript | Type-safe development |
| Angular Router | Navigation and lazy loading |
| Reactive Forms | Form handling and validation |
| Functional Interceptors | JWT injection and HTTP error handling |
| Chart.js | Analytics visualization |
| Playwright | End-to-end testing |
| Angular PWA | Progressive Web App support |
| localStorage | Theme preferences and draft persistence |

---




##  Authentication & HTTP Handling

- Route protection using Auth and Guest Guards.
- JWT token injection through functional HTTP interceptors.
- Automatic handling of `401 Unauthorized` responses.
- Redirects to the sign-in page with `returnUrl` support.
- Reactive Forms for authentication and validation.

---

##  Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) — Version 18 or later recommended.
- npm — Included with Node.js.
- Angular CLI.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/wasla-app.git
```

### 2. Navigate to the Project Directory

```bash
cd wasla-app
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
ng serve
```

### 5. Open the Application

Navigate to:

```text
http://localhost:4200
```

---

##  Testing

WASLA is designed to support unit testing and end-to-end testing.

**Unit Tests — Jest**

```bash
npm test
```

**End-to-End Tests — Playwright**

```bash
npx playwright test
```

*Note: Ensure that Jest and Playwright are configured in the project and that the corresponding scripts or dependencies are available before running these commands.*

---

##  Progressive Web App

WASLA includes planned PWA support through `@angular/pwa`, enabling progressive web application capabilities where configured.

---

##  Planned Improvements

- Expand social discovery and recommendation features.
- Improve analytics dashboards.
- Enhance accessibility and keyboard navigation.
- Expand automated test coverage.
- Optimize performance and offline capabilities.

---

##  License

This project is developed as an advanced portfolio project showcasing modern Angular development practices, component architecture, reactive state management, and user-focused interface design.

---

<p align="center">
  Built By Habiba Kayid ❤️
</p>
