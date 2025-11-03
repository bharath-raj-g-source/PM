from fastapi import FastAPI, Query , UploadFile ,File
from contextlib import asynccontextmanager
import pandas as pd 
from constants import DATA_PATH
from data_processing import DataExplorer


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.df = pd.read_csv(DATA_PATH / "Sales.csv" , index_col=0 , parse_dates= True)
    yield
    del app.state.df

app = FastAPI(lifespan=lifespan)

@app.post("/api/upload_csv")
async def upload_csv(file: UploadFile = File(...)):
    """
    Handles CSV file upload from the frontend and saves it to the data directory.
    """
    # Define the path where the file will be saved.
    # Using 'DATA_PATH' (which points to the 'data' directory) and the filename from the upload.
    file_location = DATA_PATH / file.filename
    
    try:
        # Use shutil.copyfileobj to efficiently stream the file content to disk
        with file_location.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Optionally, load the new file into the app state or process it immediately
        # NOTE: This only works if Uvicorn is NOT running with --reload
        # app.state.df = pd.read_csv(file_location, index_col=0 , parse_dates= True)

        return {"filename": file.filename, "detail": f"File successfully uploaded and saved to {file_location}"}
    except Exception as e:
        return {"error": f"An error occurred during file upload: {e}"}
    finally:
        # Close the file stream
        await file.close()

@app.get("/api/summary")
async def read_summary_data():
    data = DataExplorer(app.state.df)
    # print(data)
    return data.summary().json_response()

@app.get("/api/kpis")
async def read_kpis(country : str = Query(None)):
    data = DataExplorer(app.state.df)
    return data.kpis(country)

@app.get("/api/")
async def read_sales(limit: int = Query(100,gt=0,lt=150000)):
    data = DataExplorer(app.state.df,limit)
    # print(data)
    return data.json_response()
