# Deployment guide

## FastAPI backend on Render or Railway

1. Create a new Python service on Render or Railway.
2. Set the project root to the repository root.
3. Add a startup command that runs the API server.
4. Configure environment variables:
   - GROQ_API_KEY
   - GROQ_MODEL_FAST
   - GROQ_MODEL_STRONG
5. Ensure the backend allows CORS for the frontend domain.

Example FastAPI CORS setup:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Next.js frontend on Vercel

1. Import the repository into Vercel.
2. Set the root directory to `web`.
3. Add environment variable `NEXT_PUBLIC_API_URL` with the backend URL.
4. Deploy the project.

## Production API URL configuration

Set `NEXT_PUBLIC_API_URL` to the full API origin, for example:

```bash
NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com
```

## Verification steps

1. Visit the deployed frontend and confirm the home page loads.
2. Open `/feeds`, `/catalogue`, `/review`, and `/accuracy`.
3. Confirm the UI loads mock or real data according to the environment configuration.
4. Check that the backend health endpoint and required route paths respond successfully.
5. Validate that CORS allows front-end access from the deployed domain.
