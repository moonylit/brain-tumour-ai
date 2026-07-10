from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def root():

    return {
        "message": "Brain Tumour AI Backend is Running!"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }