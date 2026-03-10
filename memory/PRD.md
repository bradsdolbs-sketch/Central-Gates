# Central Gate Estates - Product Requirements Document

## Original Problem Statement
Build a professional, high-converting website for Central Gate Estates, a London lettings and property management agency targeting London landlords. Founded by Claire Bruce (19+ years experience) and Bradley Czechowicz-Dolbear. The site should convey transparency, professionalism, and a landlord-first approach.

## Architecture
- **Frontend**: React 19 with Tailwind CSS, Framer Motion animations, Shadcn/UI components
- **Backend**: FastAPI (Python) with MongoDB database
- **Styling**: Strict dark mode (#0A0A0A backgrounds, #F5F0EB text), Playfair Display + Inter fonts
- **Email**: Resend integration (requires API key configuration for production)

## User Personas
1. **London Landlords** - Primary target, seeking transparent property management
2. **Prospective Tenants** - Browsing available properties, booking viewings
3. **Agency Staff** - Managing listings and viewing requests

## Core Requirements (Static)
1. Multi-section landing page (Hero, Problem, Services, How It Works, Pricing, About, Trust, Contact)
2. Property listings page with search/filter
3. Contact form with database storage + email notifications
4. Viewing request system for tenants
5. Mobile-responsive design with hamburger menu
6. WhatsApp integration for quick contact
7. Google Maps embed

## What's Been Implemented (Jan 2026)
- [x] Full landing page with 8 sections
- [x] Sticky navigation with logo
- [x] Hero section with CTAs and trust indicators
- [x] Services, Pricing, How It Works sections
- [x] About section with founder story
- [x] Trust/Accreditations section
- [x] Contact form with database storage
- [x] Properties page with 6 sample listings
- [x] Property cards with Contact/Book Viewing buttons
- [x] Viewing request modal and form
- [x] WhatsApp floating button
- [x] Sticky "Get a Free Consultation" CTA
- [x] Mobile hamburger menu
- [x] Smooth scroll animations (Framer Motion)
- [x] Google Maps embed in contact section
- [x] Email notification integration (MOCKED - needs RESEND_API_KEY)

## Prioritized Backlog
### P0 (Critical)
- [x] Core website sections - DONE
- [x] Contact form submission - DONE
- [x] Property listings - DONE

### P1 (High Priority)
- [ ] Configure RESEND_API_KEY and SENDER_EMAIL for production email notifications
- [ ] Admin panel for managing property listings
- [ ] Property search/filtering by bedrooms, price range

### P2 (Medium Priority)
- [ ] Tenant portal for viewing request status
- [ ] Blog/News section
- [ ] SEO optimization
- [ ] Cookie consent banner

## Next Tasks
1. Configure Resend API credentials in backend/.env for live email notifications
2. Build admin dashboard for property management (CRUD operations)
3. Add property filtering (bedrooms, price range, location)
4. Implement image upload for property photos
