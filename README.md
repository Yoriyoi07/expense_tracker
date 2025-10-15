# Getting Started with Create React App

Expense Tracker with Charts (MERN)
=================================

Track your daily spending, categorize transactions, and see insights through charts.

Features
-
- Add income and expenses
- Categorize transactions (food, bills, leisure, etc.)
- Charts: monthly income vs expense, category breakdown
- Persistent storage in MongoDB (Mongoose)

Stretch goals
-
- Login (JWT)
- Export CSV
- Monthly budget goals

Tech Stack
-
- Client: React (CRA), Recharts
- Server: Node.js, Express, Mongoose
- DB: MongoDB

Getting Started
-
1) Setup environment variables

Copy `server/.env.example` to `server/.env` and set `MONGODB_URI` if needed.
Optionally copy `.env.example` to `.env` (client) and set `REACT_APP_API_URL` when deploying UI separate from API.

2) Install dependencies

Run once in the workspace root (installs both client and server deps):

```
npm install
npm install --save-dev concurrently nodemon
npm install express mongoose cors dotenv morgan
npm install recharts axios date-fns papaparse file-saver
```

3) Run in development (MongoDB required)

Ensure a MongoDB instance is running and accessible via `MONGODB_URI` in `server/.env`, then:

```
npm run dev
```

This starts the API on http://localhost:5000 and the React app on http://localhost:3000 or 3001 (see scripts) with proxy.

Notes for Windows PowerShell
-
The provided scripts are cross-platform. If you run commands manually, prefer separate lines instead of `&&` chaining.

Production deployment tips
-
- Server: set `MONGODB_URI` on your hosting provider (Render, Railway, etc.)
- Atlas: restrict IP Access to your server egress IPs
- Client: set `REACT_APP_API_URL` to your server URL and rebuild the React app

Deploying to Vercel (quick start)
-
Option A: Deploy only the client to Vercel and host the server elsewhere (Render/Railway/Fly):
- In the server host, set env: `MONGODB_URI`
- In Vercel Project Settings → Environment Variables: set `REACT_APP_API_URL=https://your-api-host.example.com`
- Build & deploy the client

Option B: Deploy both to Vercel (monorepo-style with one repo):
- Create a separate Vercel project for the server using the `server/` subdirectory
	- Framework preset: “Other”
	- Build Command: `npm install && node server/index.js` (or add a server adapter)
	- Env: `MONGODB_URI`
	- Note: Vercel Serverless requires an API adapter; a traditional long-running server may be better on Render/Railway
- Create a Vercel project for the client (root directory)
	- Env: `REACT_APP_API_URL=https://<your-server-domain>`
	- Build Command: `npm run build`
	- Output: `build`

API (MongoDB-backed)
-
- GET `/api/transactions?month=YYYY-MM`
- POST `/api/transactions` { type: 'income'|'expense', amount: number, category: string, note?: string, date: ISOString }
- PUT `/api/transactions/:id`
- DELETE `/api/transactions/:id`

License
-
MIT

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
