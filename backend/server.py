from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
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
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
import shutil

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend setup
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET', 'cge-secret-key-2025-very-secure')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Create uploads directory
UPLOADS_DIR = ROOT_DIR / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

# Create the main app
app = FastAPI()

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== ADMIN CREDENTIALS ====================
# These are the admin accounts
ADMIN_USERS = {
    "bradley@centralgateestates.com": {
        "name": "Bradley Czechowicz-Dolbear",
        "password_hash": bcrypt.hashpw("CGE_Brad!Kx92mP7z".encode(), bcrypt.gensalt()).decode()
    },
    "claire@centralgateestates.com": {
        "name": "Claire Bruce",
        "password_hash": bcrypt.hashpw("CGE_Claire!Qw84nR3y".encode(), bcrypt.gensalt()).decode()
    }
}

# ==================== MODELS ====================

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminUser(BaseModel):
    email: str
    name: str
    token: str

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
    is_read: bool = False

class PropertyCreate(BaseModel):
    address: str
    bedrooms: int
    rent_per_month: int
    available_date: str
    description: Optional[str] = ""
    is_available: bool = True
    is_featured: bool = False
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None

class Property(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    address: str
    bedrooms: int
    rent_per_month: int
    available_date: str
    image_url: str = ""
    images: List[str] = []
    description: str = ""
    is_available: bool = True
    is_featured: bool = False
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PropertyUpdate(BaseModel):
    address: Optional[str] = None
    bedrooms: Optional[int] = None
    rent_per_month: Optional[int] = None
    available_date: Optional[str] = None
    description: Optional[str] = None
    is_available: Optional[bool] = None
    is_featured: Optional[bool] = None
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None

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
    property_address: str = ""
    full_name: str
    email: str
    phone_number: str
    preferred_date: str
    message: str
    status: str = "pending"  # pending, confirmed, declined
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ViewingStatusUpdate(BaseModel):
    status: str  # confirmed or declined

# ==================== AUTH HELPERS ====================

def create_token(email: str, name: str) -> str:
    payload = {
        "email": email,
        "name": name,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

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

# ==================== ADMIN AUTH ROUTES ====================

@api_router.post("/admin/login", response_model=AdminUser)
async def admin_login(data: AdminLogin):
    user = ADMIN_USERS.get(data.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not bcrypt.checkpw(data.password.encode(), user["password_hash"].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(data.email, user["name"])
    return AdminUser(email=data.email, name=user["name"], token=token)

@api_router.get("/admin/me")
async def get_admin_profile(user: dict = Depends(verify_token)):
    return {"email": user["email"], "name": user["name"]}

# ==================== PUBLIC ROUTES ====================

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

@api_router.get("/admin/contacts", response_model=List[ContactForm])
async def get_contact_submissions(user: dict = Depends(verify_token)):
    submissions = await db.contact_submissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for s in submissions:
        if isinstance(s.get('created_at'), str):
            s['created_at'] = datetime.fromisoformat(s['created_at'])
    return submissions

@api_router.put("/admin/contacts/{contact_id}/read")
async def mark_contact_read(contact_id: str, user: dict = Depends(verify_token)):
    result = await db.contact_submissions.update_one(
        {"id": contact_id},
        {"$set": {"is_read": True}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"message": "Marked as read"}

# Property Endpoints (Public)
@api_router.get("/properties", response_model=List[Property])
async def get_properties(
    available_only: bool = False,
    bedrooms: Optional[int] = None,
    max_rent: Optional[int] = None,
    available_from: Optional[str] = None
):
    query = {}
    if available_only:
        query["is_available"] = True
    if bedrooms:
        query["bedrooms"] = bedrooms
    if max_rent:
        query["rent_per_month"] = {"$lte": max_rent}
    if available_from:
        query["available_date"] = {"$lte": available_from}
    
    properties = await db.properties.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for p in properties:
        if isinstance(p.get('created_at'), str):
            p['created_at'] = datetime.fromisoformat(p['created_at'])
    return properties

@api_router.get("/properties/featured", response_model=List[Property])
async def get_featured_properties():
    properties = await db.properties.find(
        {"is_featured": True, "is_available": True}, 
        {"_id": 0}
    ).sort("created_at", -1).to_list(10)
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

# Property Admin Endpoints
@api_router.post("/admin/properties", response_model=Property)
async def create_property(
    address: str = Form(...),
    bedrooms: int = Form(...),
    rent_per_month: int = Form(...),
    available_date: str = Form(...),
    description: str = Form(""),
    is_available: bool = Form(True),
    is_featured: bool = Form(False),
    location_lat: Optional[float] = Form(None),
    location_lng: Optional[float] = Form(None),
    images: List[UploadFile] = File(default=[]),
    user: dict = Depends(verify_token)
):
    prop_id = str(uuid.uuid4())
    image_urls = []
    
    # Save uploaded images
    for img in images:
        if img.filename:
            ext = img.filename.split('.')[-1]
            filename = f"{prop_id}_{uuid.uuid4().hex[:8]}.{ext}"
            filepath = UPLOADS_DIR / filename
            with open(filepath, "wb") as buffer:
                shutil.copyfileobj(img.file, buffer)
            image_urls.append(f"/uploads/{filename}")
    
    prop = Property(
        id=prop_id,
        address=address,
        bedrooms=bedrooms,
        rent_per_month=rent_per_month,
        available_date=available_date,
        description=description,
        is_available=is_available,
        is_featured=is_featured,
        location_lat=location_lat,
        location_lng=location_lng,
        image_url=image_urls[0] if image_urls else "",
        images=image_urls
    )
    
    doc = prop.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.properties.insert_one(doc)
    return prop

@api_router.put("/admin/properties/{property_id}", response_model=Property)
async def update_property(
    property_id: str,
    data: PropertyUpdate,
    user: dict = Depends(verify_token)
):
    existing = await db.properties.find_one({"id": property_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Property not found")
    
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if update_data:
        await db.properties.update_one({"id": property_id}, {"$set": update_data})
    
    updated = await db.properties.find_one({"id": property_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    return updated

@api_router.post("/admin/properties/{property_id}/images")
async def upload_property_images(
    property_id: str,
    images: List[UploadFile] = File(...),
    user: dict = Depends(verify_token)
):
    existing = await db.properties.find_one({"id": property_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Property not found")
    
    current_images = existing.get('images', [])
    
    for img in images:
        if img.filename:
            ext = img.filename.split('.')[-1]
            filename = f"{property_id}_{uuid.uuid4().hex[:8]}.{ext}"
            filepath = UPLOADS_DIR / filename
            with open(filepath, "wb") as buffer:
                shutil.copyfileobj(img.file, buffer)
            current_images.append(f"/uploads/{filename}")
    
    await db.properties.update_one(
        {"id": property_id},
        {"$set": {
            "images": current_images,
            "image_url": current_images[0] if current_images else ""
        }}
    )
    
    return {"message": "Images uploaded", "images": current_images}

@api_router.delete("/admin/properties/{property_id}/images/{image_index}")
async def delete_property_image(
    property_id: str,
    image_index: int,
    user: dict = Depends(verify_token)
):
    existing = await db.properties.find_one({"id": property_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Property not found")
    
    images = existing.get('images', [])
    if image_index < 0 or image_index >= len(images):
        raise HTTPException(status_code=400, detail="Invalid image index")
    
    # Delete file
    image_path = images[image_index]
    try:
        file_path = ROOT_DIR / image_path.lstrip('/')
        if file_path.exists():
            file_path.unlink()
    except Exception as e:
        logger.error(f"Failed to delete image file: {e}")
    
    # Remove from list
    images.pop(image_index)
    
    await db.properties.update_one(
        {"id": property_id},
        {"$set": {
            "images": images,
            "image_url": images[0] if images else ""
        }}
    )
    
    return {"message": "Image deleted", "images": images}

@api_router.delete("/admin/properties/{property_id}")
async def delete_property(property_id: str, user: dict = Depends(verify_token)):
    existing = await db.properties.find_one({"id": property_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Property not found")
    
    # Delete associated images
    for image_path in existing.get('images', []):
        try:
            file_path = ROOT_DIR / image_path.lstrip('/')
            if file_path.exists():
                file_path.unlink()
        except Exception as e:
            logger.error(f"Failed to delete image file: {e}")
    
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
    
    viewing = ViewingRequest(
        **data.model_dump(),
        property_address=prop.get('address', '')
    )
    
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

@api_router.get("/admin/viewings", response_model=List[ViewingRequest])
async def get_viewing_requests(user: dict = Depends(verify_token)):
    requests = await db.viewing_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for r in requests:
        if isinstance(r.get('created_at'), str):
            r['created_at'] = datetime.fromisoformat(r['created_at'])
    return requests

@api_router.put("/admin/viewings/{viewing_id}/status", response_model=ViewingRequest)
async def update_viewing_status(
    viewing_id: str,
    data: ViewingStatusUpdate,
    user: dict = Depends(verify_token)
):
    if data.status not in ["pending", "confirmed", "declined"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    result = await db.viewing_requests.update_one(
        {"id": viewing_id},
        {"$set": {"status": data.status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Viewing request not found")
    
    updated = await db.viewing_requests.find_one({"id": viewing_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    return updated

# Dashboard Stats
@api_router.get("/admin/stats")
async def get_dashboard_stats(user: dict = Depends(verify_token)):
    total_properties = await db.properties.count_documents({})
    available_properties = await db.properties.count_documents({"is_available": True})
    featured_properties = await db.properties.count_documents({"is_featured": True})
    total_contacts = await db.contact_submissions.count_documents({})
    unread_contacts = await db.contact_submissions.count_documents({"is_read": False})
    total_viewings = await db.viewing_requests.count_documents({})
    pending_viewings = await db.viewing_requests.count_documents({"status": "pending"})
    
    return {
        "properties": {
            "total": total_properties,
            "available": available_properties,
            "featured": featured_properties
        },
        "contacts": {
            "total": total_contacts,
            "unread": unread_contacts
        },
        "viewings": {
            "total": total_viewings,
            "pending": pending_viewings
        }
    }

# Seed sample properties endpoint (for development)
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
            "image_url": "https://images.unsplash.com/photo-1632743441209-8a09b8a37e25?w=800",
            "images": ["https://images.unsplash.com/photo-1632743441209-8a09b8a37e25?w=800"],
            "description": "Stunning 2-bedroom apartment with modern finishes in the heart of Kensington. Features include a spacious open-plan living area, fully fitted kitchen, and two generous double bedrooms with built-in wardrobes.",
            "is_available": True,
            "is_featured": True,
            "location_lat": 51.5007,
            "location_lng": -0.1927,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "address": "15 Canary Wharf, E14",
            "bedrooms": 3,
            "rent_per_month": 4200,
            "available_date": "2025-02-15",
            "image_url": "https://images.unsplash.com/photo-1595846723416-99a641e1231a?w=800",
            "images": ["https://images.unsplash.com/photo-1595846723416-99a641e1231a?w=800"],
            "description": "Spacious 3-bedroom penthouse with panoramic views of the Thames. This luxury apartment features floor-to-ceiling windows, a private balcony, and 24-hour concierge service.",
            "is_available": True,
            "is_featured": True,
            "location_lat": 51.5054,
            "location_lng": -0.0235,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "address": "88 Shoreditch High Street, E1",
            "bedrooms": 1,
            "rent_per_month": 1950,
            "available_date": "2025-01-20",
            "image_url": "https://images.pexels.com/photos/18435276/pexels-photo-18435276.jpeg?w=800",
            "images": ["https://images.pexels.com/photos/18435276/pexels-photo-18435276.jpeg?w=800"],
            "description": "Stylish 1-bedroom loft apartment in trendy Shoreditch. Perfect for young professionals, with exposed brick walls, high ceilings, and proximity to excellent restaurants and nightlife.",
            "is_available": True,
            "is_featured": True,
            "location_lat": 51.5246,
            "location_lng": -0.0779,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "address": "23 Chelsea Embankment, SW3",
            "bedrooms": 4,
            "rent_per_month": 6500,
            "available_date": "2025-03-01",
            "image_url": "https://images.pexels.com/photos/3754595/pexels-photo-3754595.jpeg?w=800",
            "images": ["https://images.pexels.com/photos/3754595/pexels-photo-3754595.jpeg?w=800"],
            "description": "Luxurious 4-bedroom townhouse with private garden in Chelsea. This stunning property offers period features combined with modern amenities, including a chef's kitchen and spa-like bathrooms.",
            "is_available": True,
            "is_featured": False,
            "location_lat": 51.4849,
            "location_lng": -0.1643,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "address": "7 Marylebone Lane, W1",
            "bedrooms": 2,
            "rent_per_month": 3100,
            "available_date": "2025-02-10",
            "image_url": "https://images.unsplash.com/photo-1650533966999-c07a71fd9146?w=800",
            "images": ["https://images.unsplash.com/photo-1650533966999-c07a71fd9146?w=800"],
            "description": "Elegant 2-bedroom flat with period features in Marylebone. Beautifully presented with high ceilings, wooden floors, and a private roof terrace with stunning views.",
            "is_available": True,
            "is_featured": False,
            "location_lat": 51.5174,
            "location_lng": -0.1504,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "address": "56 Notting Hill Gate, W11",
            "bedrooms": 3,
            "rent_per_month": 3800,
            "available_date": "2025-01-25",
            "image_url": "https://images.unsplash.com/photo-1633694705199-bc1e0a87c97a?w=800",
            "images": ["https://images.unsplash.com/photo-1633694705199-bc1e0a87c97a?w=800"],
            "description": "Charming 3-bedroom Victorian conversion in Notting Hill. Features include original fireplaces, a bright and airy living space, and a secluded courtyard garden.",
            "is_available": True,
            "is_featured": False,
            "location_lat": 51.5097,
            "location_lng": -0.1963,
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
