import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
# uvicorn api:app --reload
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/getprocess/")
def getprocess():
    proc_directory = '/proc'

    process_dirs = [row for row in os.listdir(proc_directory) if row.isdigit()]
    status_response = []
    for pid in process_dirs:
        status_file = os.path.join(proc_directory, pid, 'status')

        with open(status_file, 'r') as file:
            status_info = file.read()

        status_response.append(status_info)

    return status_response

@app.post("/getmeminfo/")
def getmeminfo():
    proc_directory = '/proc'

    status_file = os.path.join(proc_directory, 'meminfo')

    with open(status_file, 'r') as file:
        status_info = file.read()

    return status_info

@app.post("/getcpuinfo/")
def getcpuinfo():
    proc_directory = '/proc'

    status_file = os.path.join(proc_directory, 'cpuinfo')

    with open(status_file, 'r') as file:
        status_cpu_info = file.read()

    return status_cpu_info