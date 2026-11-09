# ApproveIT

**ApproveIT** is a full-stack academic project idea approval and research discovery platform. It provides students with a structured way to submit project proposals, enables teachers to review and approve them, and maintains a searchable database of approved ideas. It also includes an external research explorer for discovering repositories, academic papers, and web resources.

## Live application

- **Frontend:** https://approve-it-nu.vercel.app
- **Backend API:** https://approveit-atha.duckdns.org

The application is deployed with the frontend on Vercel and the backend on an AWS EC2 instance.

## Features

### Student
- Register and sign in using a student account.
- Submit a project idea with its title, description, category, problem statement, proposed solution, academic year, and synopsis PDF.
- Track submitted ideas and their review status.
- View teacher feedback when an idea is reviewed.
- Browse approved project ideas submitted by students.
- View and download synopsis PDFs for approved ideas.

### Teacher
- Apply for a teacher account.
- Sign in after an administrator approves the application.
- Review student submissions and update their status to **Under Review**, **Approved**, or **Rejected**.
- Provide feedback when rejecting an idea.

### Administrator
- Sign in using an administrator account created through a backend script.
- Review teacher registration applications.
- Approve applications to create teacher accounts or reject them with a reason.

### External Research Explorer
Search across multiple external sources from one query:

- GitHub repositories
- GitLab repositories
- Codeberg repositories
- OpenAlex research papers
- Semantic Scholar research papers
- Web results through Tavily

The search combines results from available providers and reports providers that fail. It searches the content indexed by these services; it does not crawl the entire internet.

## Technology stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, React Router |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| ORM and migrations | Prisma |
| Authentication | JSON Web Tokens (JWT), bcrypt |
| File storage | AWS S3, AWS SDK for JavaScript |
| File uploads | Multer |
| External search | GitHub API, GitLab API, Codeberg API, OpenAlex, Semantic Scholar, Tavily |
| Frontend hosting | Vercel |
| Backend hosting | AWS EC2, Nginx, PM2 |
| HTTPS | Let's Encrypt / Certbot |

## Application architecture

```text
                         ┌──────────────────────┐
                         │      React UI        │
                         │   Hosted on Vercel   │
                         └──────────┬───────────┘
                                    │ HTTPS /api
                                    ▼
                         ┌──────────────────────┐
                         │        Nginx         │
                         │      AWS EC2         │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Express Backend    │
                         │       PM2            │
                         └──────┬───────┬───────┘
                                │       │
                   ┌────────────┘       └─────────────┐
                   ▼                                  ▼
          ┌─────────────────┐                ┌─────────────────┐
          │   PostgreSQL    │                │     AWS S3      │
          │ User and idea   │                │ Synopsis PDFs   │
          │ records         │                │                 │
          └─────────────────┘                └─────────────────┘

                         Express search module
                                  │
              ┌─────────┬─────────┼─────────┬──────────┐
              ▼         ▼         ▼         ▼          ▼
           GitHub    GitLab   Codeberg   OpenAlex   Semantic Scholar
                                  │
                                  ▼
                                Tavily
```

- PostgreSQL stores user accounts, teacher applications, idea details, review statuses, and PDF object keys.
- Synopsis PDFs are stored in a private S3 bucket. The database stores the S3 object key and original filename.
- The backend controls access to protected routes and retrieves PDFs from S3 for authorized users.
- External research searches are handled separately from the college's internal idea database.

## Repository structure

```text
Approve-It/
├── client/                         # React frontend
│   ├── src/
│   │   ├── components/             # Shared UI components
│   │   ├── context/                # Authentication and theme context
│   │   ├── pages/                  # Application pages
│   │   ├── services/               # Frontend API service functions
│   │   └── config/                 # API configuration
│   └── package.json
│
└── server/                         # Express backend
    ├── prisma/
    │   ├── migrations/             # Database migration history
    │   └── schema.prisma            # Database models and enums
    ├── src/
    │   ├── config/                 # Prisma and AWS configuration
    │   ├── middleware/             # Authentication and role checks
    │   ├── modules/
    │   │   ├── auth/               # Registration and login
    │   │   ├── ideas/              # Idea submission, review and PDFs
    │   │   ├── admin/              # Teacher application management
    │   │   └── search/             # External research search
    │   ├── scripts/                # Administrative scripts
    │   └── server.js               # Backend entry point
    └── package.json
```

## Local development setup

### Prerequisites

- Node.js and npm
- PostgreSQL
- An AWS account and an S3 bucket for synopsis PDFs
- A Tavily API key for web search results

You will need separate terminal sessions for the frontend and backend.

### 1. Clone the repository

```bash
git clone https://github.com/atha-01/Approve-It.git
cd Approve-It
```

### 2. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
NODE_ENV=development
PORT=2000
DATABASE_URL="postgresql://DB_USER:DB_PASSWORD@localhost:5432/approveit_db"
JWT_SECRET="replace-with-a-long-random-secret"
AWS_REGION="ap-south-1"
AWS_S3_BUCKET="your-s3-bucket-name"
TAVILY_API_KEY="your-tavily-api-key"
CLIENT_URL="http://localhost:5173"
```

For local development with AWS IAM user credentials, you can also provide:

```env
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
```

Do not commit `.env` files or expose credentials. In production on EC2, use an IAM role with the required S3 permissions instead of long-lived AWS keys.

### 3. Set up the database

Create a PostgreSQL database matching the database name in `DATABASE_URL`. Then, from the `server` directory, run:

```bash
npx prisma generate
npx prisma migrate deploy
```

`prisma generate` generates the Prisma client used by the backend. `prisma migrate deploy` applies the committed migrations to the configured database.

Start the backend:

```bash
npm run dev
```

The backend runs on `http://localhost:2000` by default.

### 4. Configure and run the frontend

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_BASE_URL="http://localhost:2000/api"
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

### Available scripts

**Client (`client/`)**

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

**Server (`server/`)**

| Command | Purpose |
|---|---|
| `npm run dev` | Start the backend with Nodemon |
| `npm start` | Start the backend using `tsx` |

## API overview

All backend routes are mounted under `/api`.

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a student | Public |
| `POST` | `/api/auth/login` | Sign in | Public |
| `POST` | `/api/auth/teacher-register` | Submit a teacher application | Public |
| `GET` | `/api/auth/me` | Get the authenticated user | Authenticated |
| `GET` | `/api/auth/test` | Teacher-only protected route | Teacher |
| `POST` | `/api/ideas` | Submit an idea and synopsis PDF | Student |
| `GET` | `/api/ideas` | Get the current student's submissions | Authenticated |
| `GET` | `/api/ideas/database` | List approved ideas, with search and academic-year filters | Authenticated |
| `GET` | `/api/ideas/review` | Get ideas for teacher review | Teacher |
| `PATCH` | `/api/ideas/:id/review` | Update an idea's review status and feedback | Teacher |
| `GET` | `/api/ideas/:id` | Get idea details | Authenticated |
| `GET` | `/api/ideas/:id/pdf` | Retrieve an idea's synopsis PDF | Authenticated, subject to access rules |
| `GET` | `/api/admin/teacher-applications` | List teacher applications | Admin |
| `PATCH` | `/api/admin/teacher-applications/:id/approve` | Approve a teacher application | Admin |
| `PATCH` | `/api/admin/teacher-applications/:id/reject` | Reject a teacher application | Admin |
| `GET` | `/api/search?q=QUERY` | Search external research sources | Public |

Protected endpoints require a JWT in the request header:

```http
Authorization: Bearer YOUR_JWT
```

The login endpoint returns a token that expires after 12 hours. Role-based middleware restricts student, teacher, and administrator operations.

### Idea review lifecycle

```text
Student submits idea
        │
        ▼
     Pending
        │
        ▼
  Teacher review
        │
        ├──────────────► Under Review
        │
        ├──────────────► Approved ──► Visible in Idea Database
        │
        └──────────────► Rejected ──► Feedback returned to student
```

Only approved ideas are listed in the internal Idea Database. Students can access their own submissions and their review status. Synopsis PDF access is restricted according to ownership, role, and approval status.

## Database models

The Prisma schema defines these main models and enums:

- **User** — account details, password hash, and role (`student`, `teacher`, or `admin`).
- **Idea** — project details, academic year, submission and review relationships, status, feedback, and S3 PDF metadata.
- **TeacherApplication** — teacher registration requests, application status, review information, and rejection reason.
- **IdeaStatus** — `pending`, `under_review`, `approved`, `rejected`.
- **TeacherApplicationStatus** — `pending`, `approved`, `rejected`.

### Migration history

1. `20261026170815_init` — initial user and idea tables, roles and idea statuses.
2. `20261028143416_add_idea_pdf_fields` — PDF metadata, academic year, and uploader relationship.
3. `20261030140215_add_admin_role` — administrator role.
4. `20261030160734_add_teacher_application` — teacher application table and status enum.
5. `20261103075950_add_idea_submission_fields` — category, problem statement, and proposed solution.
6. `20261106183000_add_idea_feedback` — teacher feedback field on ideas.

Apply pending migrations with:

```bash
npx prisma migrate deploy
```

Avoid using `prisma migrate reset` on a database containing data; it resets the database.

## File storage and access

- Student synopsis files are accepted as PDF uploads, with a maximum upload size of 10 MB.
- The backend uploads the PDF to a private S3 bucket using a generated object key.
- PostgreSQL stores the S3 key and original filename, not the PDF contents.
- PDF downloads are streamed from S3 through the backend after authorization checks.
- If saving the idea record fails after the S3 upload, the backend attempts to delete the uploaded object.

## Administrator account

Public administrator registration is not provided. Create the first administrator through the backend script.

Set these variables in `server/.env`:

```env
ADMIN_NAME="Administrator"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="use-a-strong-password"
```

Then run from the `server` directory:

```bash
npx tsx src/scripts/createAdmin.js
```

The script hashes the password before storing the account. Do not put real administrator credentials in source control.

## Deployment

The production deployment uses:

- **Vercel** for the React frontend.
- **AWS EC2** for the Express backend and PostgreSQL database.
- **Nginx** as the reverse proxy.
- **PM2** to keep the backend process running.
- **AWS S3** for private synopsis PDF storage.
- **DuckDNS** for the backend hostname and **Let's Encrypt** for HTTPS.

Production environment variables must be configured in the hosting environment:

- Set `VITE_API_BASE_URL` in Vercel to the public backend API base URL ending in `/api`.
- Set `CLIENT_URL` on the backend to the exact deployed frontend origin.
- Configure `DATABASE_URL`, `JWT_SECRET`, `AWS_REGION`, `AWS_S3_BUCKET`, and `TAVILY_API_KEY` on the backend.
- Attach an EC2 IAM role with the required S3 permissions. Avoid embedding AWS credentials in the application or repository.

## Security notes

- Passwords are hashed with bcrypt; plaintext passwords are not stored.
- Authentication uses signed JWTs.
- Role middleware protects teacher and administrator endpoints.
- S3 PDF objects are stored privately and accessed through the backend.
- Keep all secrets in environment variables and out of Git.
- Use HTTPS in production and restrict SSH access to trusted IP addresses.
- Back up the PostgreSQL database and periodically verify that backups can be restored.

## License

No license is currently specified in this repository. Unless a license is added, the project should be treated as having all rights reserved.
