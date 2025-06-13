
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from inference import translate 

app = FastAPI()


origins = [
    "http://localhost",
    "http://localhost:8000", 
    "http://localhost:5173", 
    "http://localhost:3000",
   
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      
    allow_credentials=True,      
    allow_methods=["*"],         
    allow_headers=["*"],         

@app.get("/translate")
async def translate_route(amharic: str):
    translation = translate(amharic)
    return {"translation": translation}


@app.get("/")
async def read_root():
    return {"message": "FastAPI translator backend is running!"}