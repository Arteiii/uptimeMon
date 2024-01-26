import contextlib
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from uptimemon.api.ping import ping as pingAPI


@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    print("Startup!!")
    yield
    print("Shutdown!!")


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pingAPI, prefix="/ping")


@app.get("/")
async def root():
    return {"msg": "Hello from Root"}
