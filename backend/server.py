from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend setup
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class ContactFormCreate(BaseModel):
    full_name: str
    phone_number: str
    email: EmailStr
    number_of_properties: str
    looking_for: str
    message: Optional[str] = ""

class ContactForm(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    phone_number: str
    email: str
    number_of_properties: str
    looking_for: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PropertyCreate(BaseModel):
    address: str
    bedrooms: int
    rent_per_month: int
    available_date: str
    image_url: str
    description: Optional[str] = ""
    is_available: bool = True

class Property(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    address: str
    bedrooms: int
    rent_per_month: int
    available_date: str
    image_url: str
    description: str
    is_available: bool
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ViewingRequestCreate(BaseModel):
    property_id: str
    full_name: str
    email: EmailStr
    phone_number: str
    preferred_date: str
    message: Optional[str] = ""

class ViewingRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    property_id: str
    full_name: str
    email: str
    phone_number: str
    preferred_date: str
    message: str
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ==================== EMAIL HELPER ====================

async def send_notification_email(subject: str, html_content: str):
    """Send email notification to both Bradley and Claire"""
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not configured, skipping email notification")
        return None
    
    try:
        import resend
        resend.api_key = RESEND_API_KEY
        
        params = {
            "from": SENDER_EMAIL,
            "to": ["bradley@centralgateestates.com", "claire@centralgateestates.com"],
            "subject": subject,
            "html": html_content
        }
        
        email = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email sent successfully: {email.get('id')}")
        return email
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return None

# ==================== ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "Central Gate Estates API"}

# Contact Form Endpoints
@api_router.post("/contact", response_model=ContactForm)
async def submit_contact_form(data: ContactFormCreate):
    contact = ContactForm(**data.model_dump())
    
    doc = contact.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.contact_submissions.insert_one(doc)
    
    # Send email notification
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0A0A0A;">New Contact Form Submission</h2>
        <hr style="border: 1px solid #333;">
        <p><strong>Name:</strong> {contact.full_name}</p>
        <p><strong>Email:</strong> {contact.email}</p>
        <p><strong>Phone:</strong> {contact.phone_number}</p>
        <p><strong>Number of Properties:</strong> {contact.number_of_properties}</p>
        <p><strong>Looking For:</strong> {contact.looking_for}</p>
        <p><strong>Message:</strong></p>
        <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">{contact.message or 'No message provided'}</p>
        <hr style="border: 1px solid #333;">
        <p style="color: #666; font-size: 12px;">This is an automated notification from Central Gate Estates website.</p>
    </div>
    """
    
    await send_notification_email(
        f"New Enquiry from {contact.full_name}",
        html_content
    )
    
    return contact

@api_router.get("/contact", response_model=List[ContactForm])
async def get_contact_submissions():
    submissions = await db.contact_submissions.find({}, {"_id": 0}).to_list(1000)
    for s in submissions:
        if isinstance(s.get('created_at'), str):
            s['created_at'] = datetime.fromisoformat(s['created_at'])
    return submissions

# Property Endpoints
@api_router.post("/properties", response_model=Property)
async def create_property(data: PropertyCreate):
    prop = Property(**data.model_dump())
    
    doc = prop.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.properties.insert_one(doc)
    return prop

@api_router.get("/properties", response_model=List[Property])
async def get_properties(available_only: bool = False):
    query = {"is_available": True} if available_only else {}
    properties = await db.properties.find(query, {"_id": 0}).to_list(1000)
    for p in properties:
        if isinstance(p.get('created_at'), str):
            p['created_at'] = datetime.fromisoformat(p['created_at'])
    return properties

@api_router.get("/properties/{property_id}", response_model=Property)
async def get_property(property_id: str):
    prop = await db.properties.find_one({"id": property_id}, {"_id": 0})
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    if isinstance(prop.get('created_at'), str):
        prop['created_at'] = datetime.fromisoformat(prop['created_at'])
    return prop

@api_router.put("/properties/{property_id}", response_model=Property)
async def update_property(property_id: str, data: PropertyCreate):
    existing = await db.properties.find_one({"id": property_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Property not found")
    
    update_data = data.model_dump()
    await db.properties.update_one({"id": property_id}, {"$set": update_data})
    
    updated = await db.properties.find_one({"id": property_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    return updated

@api_router.delete("/properties/{property_id}")
async def delete_property(property_id: str):
    result = await db.properties.delete_one({"id": property_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Property not found")
    return {"message": "Property deleted successfully"}

# Viewing Request Endpoints
@api_router.post("/viewing", response_model=ViewingRequest)
async def request_viewing(data: ViewingRequestCreate):
    # Verify property exists
    prop = await db.properties.find_one({"id": data.property_id}, {"_id": 0})
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    
    viewing = ViewingRequest(**data.model_dump())
    
    doc = viewing.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.viewing_requests.insert_one(doc)
    
    # Send email notification
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0A0A0A;">New Viewing Request</h2>
        <hr style="border: 1px solid #333;">
        <h3>Property Details:</h3>
        <p><strong>Address:</strong> {prop.get('address')}</p>
        <p><strong>Bedrooms:</strong> {prop.get('bedrooms')}</p>
        <p><strong>Rent:</strong> £{prop.get('rent_per_month')}/month</p>
        <hr style="border: 1px solid #333;">
        <h3>Contact Details:</h3>
        <p><strong>Name:</strong> {viewing.full_name}</p>
        <p><strong>Email:</strong> {viewing.email}</p>
        <p><strong>Phone:</strong> {viewing.phone_number}</p>
        <p><strong>Preferred Date:</strong> {viewing.preferred_date}</p>
        <p><strong>Message:</strong></p>
        <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">{viewing.message or 'No message provided'}</p>
        <hr style="border: 1px solid #333;">
        <p style="color: #666; font-size: 12px;">This is an automated notification from Central Gate Estates website.</p>
    </div>
    """
    
    await send_notification_email(
        f"New Viewing Request - {prop.get('address')}",
        html_content
    )
    
    return viewing

@api_router.get("/viewing", response_model=List[ViewingRequest])
async def get_viewing_requests():
    requests = await db.viewing_requests.find({}, {"_id": 0}).to_list(1000)
    for r in requests:
        if isinstance(r.get('created_at'), str):
            r['created_at'] = datetime.fromisoformat(r['created_at'])
    return requests

# Seed sample properties endpoint
@api_router.post("/seed-properties")
async def seed_properties():
    """Seed sample properties for demonstration"""
    sample_properties = [
        {
            "id": str(uuid.uuid4()),
            "address": "42 Kensington High Street, W8",
            "bedrooms": 2,
            "rent_per_month": 2800,
            "available_date": "2025-02-01",
            "image_url": "https://images.unsplash.com/photo-1632743441209-8a09b8a37e25?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTB8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBsb25kb24lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwwfHx8fDE3NzMxMDE0ODN8MA&ixlib=rb-4.1.0&q=85",
            "description": "Stunning 2-bedroom apartment with modern finishes in the heart of Kensington.",
            "is_available": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "address": "15 Canary Wharf, E14",
            "bedrooms": 3,
            "rent_per_month": 4200,
            "available_date": "2025-02-15",
            "image_url": "https://images.unsplash.com/photo-1595846723416-99a641e1231a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTB8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBsdXh1cnklMjBsb25kb24lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwwfHx8fDE3NzMxMDE0ODN8MA&ixlib=rb-4.1.0&q=85",
            "description": "Spacious 3-bedroom penthouse with panoramic views of the Thames.",
            "is_available": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "address": "88 Shoreditch High Street, E1",
            "bedrooms": 1,
            "rent_per_month": 1950,
            "available_date": "2025-01-20",
            "image_url": "https://images.pexels.com/photos/18435276/pexels-photo-18435276.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "description": "Stylish 1-bedroom loft apartment in trendy Shoreditch.",
            "is_available": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "address": "23 Chelsea Embankment, SW3",
            "bedrooms": 4,
            "rent_per_month": 6500,
            "available_date": "2025-03-01",
            "image_url": "https://images.pexels.com/photos/3754595/pexels-photo-3754595.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "description": "Luxurious 4-bedroom townhouse with private garden in Chelsea.",
            "is_available": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "address": "7 Marylebone Lane, W1",
            "bedrooms": 2,
            "rent_per_month": 3100,
            "available_date": "2025-02-10",
            "image_url": "https://images.unsplash.com/photo-1650533966999-c07a71fd9146?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTB8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBsdXh1cnklMjBsb25kb24lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwwfHx8fDE3NzMxMDE0ODN8MA&ixlib=rb-4.1.0&q=85",
            "description": "Elegant 2-bedroom flat with period features in Marylebone.",
            "is_available": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "address": "56 Notting Hill Gate, W11",
            "bedrooms": 3,
            "rent_per_month": 3800,
            "available_date": "2025-01-25",
            "image_url": "https://images.unsplash.com/photo-1633694705199-bc1e0a87c97a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTB8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBsdXh1cnklMjBsb25kb24lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwwfHx8fDE3NzMxMDE0ODN8MA&ixlib=rb-4.1.0&q=85",
            "description": "Charming 3-bedroom Victorian conversion in Notting Hill.",
            "is_available": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    # Clear existing properties
    await db.properties.delete_many({})
    
    # Insert sample properties
    await db.properties.insert_many(sample_properties)
    
    return {"message": f"Seeded {len(sample_properties)} properties successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
