# ZenFlow — Personal Productivity Superapp

ZenFlow is a full-stack web application that adapts your daily to-do list
to how you actually feel. Each day you log your sleep, mood, food quality,
and energy level. ZenFlow calculates a Productivity Score and recommends
tasks from your to-do list that match your current capacity — using the
Eisenhower matrix to prioritize what matters.

On low-energy days, ZenFlow steps back from heavy tasks and instead suggests
a comedy from your personal Watchlist or a light book from your Booklist.
You can mark tasks as done directly from the dashboard, and track your
check-in history to see how your productivity score changes over time.

---

## Team
- Bagdauletkyzy Akbota 24B030991
- Mukhambet Nuray 24B031895
- Razuan Togzhan 24B031966

---

## Pages

### Login & Register — /login
The entry point of the app. New users can create an account with a username,
email, and password. Returning users log in with their credentials. On
successful login, a JWT access token and refresh token are issued. An HTTP
interceptor automatically attaches the access token to every subsequent
request so the user never has to think about authentication again. Logging
out blacklists the refresh token on the server side.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register/ | Create a new user account |
| POST | /auth/login/ | Log in and receive JWT access + refresh tokens |
| POST | /auth/logout/ | Blacklist the refresh token |
| POST | /api/token/refresh/ | Get a new access token using the refresh token |

### Dashboard — /dashboard
The main overview page. Shows four summary cards at the top: today's
Productivity Score, total tasks, last night's sleep and mood, and the
number of films and books in the user's lists. Below that, the user sees
their focus tasks for today — filtered to match their current capacity tier.
Tasks can be marked as done with a single click directly from this page,
crossing them out instantly. A quick suggestion card on the right shows a
recommended film and book from the user's own lists.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /tasks/ | Fetch all tasks for the authenticated user |
| PATCH | /tasks/<id>/ | Mark a task as done (`{ "is_done": true }`) |
| GET | /recommendation/ | Fetch today's filtered tasks and suggestions |

### Daily Check-in — /checkin
The user fills in four inputs each day: hours of sleep (slider 0–12),
food quality (slider 1–5), energy level (slider 1–5), and mood (emoji
picker 1–5). On submit, the backend calculates the Productivity Score
using the formula: sleep 40% + mood 30% + food 15% + energy 15%. The
resulting score determines the capacity tier — High (65–100), Medium
(40–64), or Low (0–39) — which controls which tasks are shown across
the app. The page also displays a breakdown of how each input contributed
to the score.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /checkins/ | Submit today's check-in and receive the calculated score |
| GET | /checkins/latest/ | Fetch the most recent check-in for the authenticated user |

### Check-in History — /checkin/history
A chronological list of all past check-ins for the authenticated user.
Each entry shows the date, sleep hours, mood, food quality, energy level,
and the calculated Productivity Score with its capacity tier badge. This
page lets the user see patterns over time — for example noticing that
low sleep consistently drops their score below 40.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /checkins/ | Fetch all past check-ins for the authenticated user |

### To-do List — /tasks
The full task management page. Users can create tasks by entering a title
and selecting one of four Eisenhower matrix quadrants: Urgent + Important
(do first), Urgent + Not Important (delegate), Not Urgent + Important
(schedule), Not Urgent + Not Important (eliminate). Each task can be
edited, marked as done, or deleted. The list is color-coded by quadrant
and filtered based on today's Productivity Score — on low-capacity days
only light tasks are shown.
Full CRUD operations are supported.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /tasks/ | Fetch all tasks for the authenticated user |
| POST | /tasks/ | Create a new task |
| GET | /tasks/<id>/ | Fetch a single task by ID |
| PUT | /tasks/<id>/ | Fully update a task |
| PATCH | /tasks/<id>/ | Partially update a task (e.g. mark as done) |
| DELETE | /tasks/<id>/ | Delete a task |

### Recommendation — /recommendation
The smart suggestion page. After reading the latest check-in, the backend
recommendation engine returns a filtered task list appropriate for the
user's current capacity, along with a suggested film and book pulled from
the user's own Watchlist and Booklist. On low-capacity days (score below
40) a banner explains why heavy tasks are hidden and encourages the user
to rest. On medium days only urgent tasks are shown. On high-capacity days
the full task list is available.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /recommendation/ | Fetch filtered tasks + suggested film and book based on today's score |

### Watchlist — /watchlist
The user's personal film library. Films can be added with a title and a
genre tag (Comedy, Drama, Thriller, Documentary, Sci-fi). Each film shows
its genre badge and can be deleted. The recommendation engine reads this
list when suggesting a film on low-capacity days — it prioritizes Comedy
tagged films when the user's score is low.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /films/ | Fetch all films for the authenticated user |
| POST | /films/ | Add a new film to the watchlist |
| DELETE | /films/<id>/ | Remove a film from the watchlist |

### Booklist — /booklist
The user's personal reading list. Books can be added with a title and a
mood tag (Light, Deep, Educational, Fiction). Each book shows its mood
badge and can be deleted. The recommendation engine reads this list when
suggesting a book on low-capacity days — it prioritizes Light tagged books
when the user's score is low.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /books/ | Fetch all books for the authenticated user |
| POST | /books/ | Add a new book to the booklist |
| DELETE | /books/<id>/ | Remove a book from the booklist |

---

## Full API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /auth/register/ | No | Register a new user |
| POST | /auth/login/ | No | Log in, receive JWT tokens |
| POST | /auth/logout/ | Yes | Blacklist refresh token |
| POST | /api/token/refresh/ | No | Refresh access token |
| GET | /tasks/ | Yes | List all tasks |
| POST | /tasks/ | Yes | Create a task |
| GET | /tasks/<id>/ | Yes | Get a single task |
| PUT | /tasks/<id>/ | Yes | Fully update a task |
| PATCH | /tasks/<id>/ | Yes | Partially update a task |
| DELETE | /tasks/<id>/ | Yes | Delete a task |
| GET | /checkins/ | Yes | List all check-ins |
| POST | /checkins/ | Yes | Submit today's check-in |
| GET | /checkins/latest/ | Yes | Get the most recent check-in |
| GET | /films/ | Yes | List all films |
| POST | /films/ | Yes | Add a film |
| DELETE | /films/<id>/ | Yes | Delete a film |
| GET | /books/ | Yes | List all books |
| POST | /books/ | Yes | Add a book |
| DELETE | /books/<id>/ | Yes | Delete a book |
| GET | /recommendation/ | Yes | Get today's recommendations |

---

## Features Summary
- Daily wellness check-in (sleep, mood, food quality, energy level)
- Productivity Score engine (sleep 40% + mood 30% + food 15% + energy 15%)
- Smart to-do list with Eisenhower matrix tagging (Urgent/Important quadrants)
- One-click mark task as done from the dashboard
- Check-in history page — view past scores and wellness entries by date
- Personal film watchlist with mood-based recommendations on low-capacity days
- Personal booklist with mood-based recommendations on low-capacity days
- JWT-based authentication (register, login, logout)
- All data is private and tied to the authenticated user
- Visible error messages on all failed API requests

---

## Tech Stack
- Frontend: Angular 17 (routing, HttpClient, FormsModule, JWT interceptor)
- Backend: Django + Django REST Framework
- Auth: JWT 



