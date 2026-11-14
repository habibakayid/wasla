# WASLA (وَصلة)

### Social Connection Web App

A modern social network built with **Angular 21 (Standalone Components, Signals, Lazy Loading)** on top of the **Route Posts API**, with a Burgundy & Cream identity and full **Arabic / English (RTL / LTR)** support.

---

## About the Project

**WASLA (وصلة)** lets people share moments, follow each other, and join conversations. It focuses on a smooth experience: optimistic UI, infinite scrolling, a split-screen auth layout, and a responsive three-column home.

---

## Features

### Authentication
- Split-screen layout: platform description on one side, the form on the other (description is hidden on small screens).
- Sign in and two-step sign-up with Reactive Forms validation.
- Auth guard and HTTP interceptor (token handling and error toasts).

### Home Feed
- All posts with infinite scrolling.
- Filters: All, Following, Me.
- Inline post composer with image upload and privacy selector.
- "Who to follow" suggestions.

### Posts
- Create, update, and delete posts.
- Like, bookmark, and share.
- Post likes list page.

### Comments & Replies
- Post details page with all comments.
- Create, update, and delete comments.
- Nested replies and comment likes.

### Profile
- Own profile with followers, following, and saved posts.
- Other users' profiles with follow / unfollow.
- Settings: change password.

### Notifications
- Unread count badge with polling.
- All / Unread tabs.
- Mark all as read.
- Click a notification to open the post or the user's profile.

### Search
- Search posts and people.

### Internationalization
- English and Arabic with automatic RTL.
- Language saved in `localStorage` (`wasla-language`).
- Custom `TranslationService` and `t` pipe.

---

## Tech Stack

| Area | Technology |
|---|---|
| Framework | Angular 21 (standalone, signals) |
| Styling | Tailwind CSS v4, Flowbite |
| Icons | Font Awesome |
| Charts | Chart.js |
| State / async | RxJS + Signals |
| Tests | Vitest |


---

## Project Structure

```
src/app/
├── core/        # services, guards, interceptors, models
├── shared/      # reusable components, pipes, directives
├── layouts/     # auth-layout, main-layout
└── features/
    ├── auth/
    ├── feed/
    ├── post-details/
    ├── post-likes/
    ├── profile/
    ├── notifications/
    ├── search/
    ├── settings/
    └── not-found/
```

Path aliases: `@core`, `@shared`, `@features`, `@layouts`.

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm 11

### Install and run

```bash
git clone https://github.com/habibakayid/wasla.git
cd wasla
npm install
npm start
```

Open **http://localhost:4200**.

### Scripts

| Command | What it does |
|---|---|
| `npm start` | Dev server |
| `npm run build` | Production build |
| `npm run watch` | Build in watch mode |
| `npm test` | Run unit tests |

---

## API

All requests go to `https://route-posts.routemisr.com`. Responses follow this shape:

```json
{ "success": true, "message": "success", "data": {}, "meta": {} }
```

Main endpoints used: `/users/signup`, `/users/signin`, `/users/profile-data`, `/users/change-password`, `/posts`, `/posts/:id/comments`, `/notifications`, `/notifications/unread-count`, `/users/suggestions`.

---

## Author

**Habiba Kayid**: Computer Science & AI, Helwan University.
GitHub: [@habibakayid](https://github.com/habibakayid)

---

## License

Built for learning and portfolio purposes.


<p align="center">
  Built By Habiba Kayid ❤️
</p>
