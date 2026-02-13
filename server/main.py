from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
import json

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from fastapi.responses import RedirectResponse

from sqlalchemy import Column, String, DateTime, Text, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///./resumes.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


class ResumeRow(Base):
    __tablename__ = "resumes"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    tags = Column(Text, nullable=False, default="[]")  # JSON string list
    lastEdited = Column(DateTime, nullable=False)
    data = Column(Text, nullable=False)  # JSON string ResumeData


Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def iso_date(dt: datetime) -> str:
    # Your TS uses YYYY-MM-DD
    return dt.date().isoformat()


def save_resume_data(r: ResumeRow) -> Dict[str, Any]:
    return {
        "id": r.id,
        "name": r.name,
        "tags": json.loads(r.tags),
        "lastEdited": iso_date(r.lastEdited),
        "data": json.loads(r.data),
    }


@app.get("/resumes")
def list_resumes() -> List[Dict[str, Any]]:
    db = SessionLocal()
    try:
        rows = db.query(ResumeRow).order_by(ResumeRow.lastEdited.desc()).all()
        return [save_resume_data(r) for r in rows]
    finally:
        db.close()

@app.get("/resumes/{resume_id}")
def get_resume(resume_id: str) -> Dict[str, Any]:
    db = SessionLocal()
    try:
        r = db.query(ResumeRow).filter_by(id=resume_id).first()
        if not r:
            raise HTTPException(404, "Resume not found")
        return save_resume_data(r)
    finally:
        db.close()

@app.post("/resumes")
def create_resume(payload: Dict[str, Any]) -> Dict[str, Any]:
    db = SessionLocal()
    try:
        rid = payload.get("id") or f"resume-{int(datetime.now(timezone.utc).timestamp()*1000)}"
        name = payload.get("name") or "Untitled Resume"
        tags = payload.get("tags") or []
        data = payload.get("data") or {}

        now = datetime.now(timezone.utc)

        row = ResumeRow(
            id=rid,
            name=name,
            tags=json.dumps(tags),
            lastEdited=now,
            data=json.dumps(data),
        )
        db.add(row)
        db.commit()
        return save_resume_data(row)
    finally:
        db.close()


@app.put("/resumes/{resume_id}")
def update_resume(resume_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    db = SessionLocal()
    try:
        r = db.query(ResumeRow).filter_by(id=resume_id).first()
        if not r:
            raise HTTPException(404, "Resume not found")

        if "name" in payload:
            r.name = payload["name"]
        if "tags" in payload:
            r.tags = json.dumps(payload["tags"])
        if "data" in payload:
            r.data = json.dumps(payload["data"])

        r.lastEdited = datetime.now(timezone.utc)
        db.commit()
        return save_resume_data(r)
    finally:
        db.close()

@app.delete("/resumes/{resume_id}")
def delete_resume(resume_id: str):
    db = SessionLocal()
    try:
        r = db.query(ResumeRow).filter_by(id=resume_id).first()
        if not r:
            raise HTTPException(404, "Resume not found")
        db.delete(r)
        db.commit()
        return {"ok": True}
    finally:
        db.close()

@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")
