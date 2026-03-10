# Central Gate Estates - Product Requirements Document

## Original Problem Statement
Build a professional, high-converting website for Central Gate Estates, a London lettings and property management agency targeting London landlords.

## Architecture
- **Frontend**: React 19 with Tailwind CSS, Framer Motion, Shadcn/UI, react-helmet-async
- **Backend**: FastAPI with JWT authentication, MongoDB, file uploads
- **Email**: Resend integration (requires RESEND_API_KEY for production)

## User Personas
1. **London Landlords** - Primary target, seeking transparent property management
2. **Prospective Tenants** - Browsing properties, booking viewings
3. **Admin Users** - Bradley & Claire managing properties and enquiries

## Admin Credentials
- **Bradley**: bradley@centralgateestates.com / CGE_Brad!Kx92mP7z
- **Claire**: claire@centralgateestates.com / CGE_Claire!Qw84nR3y

## What's Been Implemented (Jan 2026)

### Phase 1 - MVP (Complete)
- [x] Full landing page with 8 sections
- [x] Property listings page with property cards
- [x] Contact form with database storage
- [x] Viewing request system
- [x] WhatsApp button (Bradley: +447726594925)
- [x] Mobile hamburger menu
- [x] Smooth scroll animations

### Phase 2 - Admin & Features (Complete)
- [x] Admin Dashboard with JWT authentication
- [x] Individual admin accounts (Bradley & Claire)
- [x] Property CRUD with file upload for images
- [x] Featured property toggle (manual control)
- [x] Contact enquiries list with read/unread status
- [x] Viewing requests with confirm/decline functionality
- [x] Property search & filtering (bedrooms, max rent, available from)
- [x] Featured Properties carousel on homepage
- [x] Individual property detail pages with gallery
- [x] Book a Viewing form on property pages
- [x] SEO meta tags on all pages
- [x] Dashboard stats overview

## Prioritized Backlog

### P1 (High Priority)
- [ ] Configure RESEND_API_KEY for live email notifications
- [ ] Property image gallery with multiple image upload
- [ ] Admin password reset functionality

### P2 (Medium Priority)
- [ ] Tenant portal for viewing request status
- [ ] Blog/News section
- [ ] Cookie consent banner
- [ ] Terms & Conditions, Privacy Policy pages

## WhatsApp Numbers
- Bradley Czechowicz-Dolbear: +44 7726 594925 (primary)
- Claire Bruce: +44 7951 991485

## Next Tasks
1. Configure Resend API credentials in backend/.env
2. Add image upload preview in admin
3. Create Terms/Privacy pages
