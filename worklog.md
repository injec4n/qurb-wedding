# Work Log — Task 1-a

## Summary
Updated seed API and luxury-dark theme configuration, then re-seeded the database.

## Changes Made

### 1. `/home/z/my-project/src/app/api/seed/route.ts`
- Changed `couplePhoto: ''` → `couplePhoto: '/images/default-couple.png'` for all demo weddings.

### 2. `/home/z/my-project/src/lib/themes.ts`
- `heroStyle: 'split'` → `heroStyle: 'cinematic'`
- `ornamentStyle: 'none'` → `ornamentStyle: 'bold'`
- `cornerOrnaments: false` → `cornerOrnaments: true`
- `fontScale: 0.9` → `fontScale: 1.15`

These changes make luxury-dark consistent with the other dark templates (royal-gold, arabic-heritage).

### 3. Re-seed
- Ran `curl -s http://localhost:3000/api/seed` — all 5 demo weddings seeded successfully.
---
Task ID: 2
Agent: Main Agent
Task: Add default couple images, fix luxury-dark template, add demo name input, fix button hover colors

Work Log:
- Generated default couple image using AI image generation (saved to /public/images/default-couple.png)
- Updated seed API to set couplePhoto="/images/default-couple.png" for all demo weddings
- Updated luxury-dark theme: heroStyle split→cinematic, ornamentStyle none→bold, cornerOrnaments false→true, fontScale 0.9→1.15
- Re-seeded database with all 5 demo weddings (now with couple photos)
- Updated template preview cards on landing page to show circular couple photo between names
- Added "جرّب الدعوة باسمك" (Try invitation with your name) section with:
  - Name input field
  - Template selector buttons (5 themes)
  - Preview button that navigates to /w/demo-{theme}?guest={name}
- Fixed button hover colors across 5 wedding components:
  - AddToCalendar: hoveredIndex state for calendar buttons
  - InvitationCard: 5 hover state variables for all interactive buttons
  - Venue: mapHovered state for directions button
  - RsvpSection: attendingHovered/notAttendingHovered states
  - WeddingDetails: contactHovered/mapHovered states
- All hover effects now use React state (onMouseEnter/onMouseLeave) with proper contrast:
  - Background opacity increases on hover (15→30)
  - Border opacity increases on hover (25→50)
  - Glow shadow added on hover

Stage Summary:
- Default couple image generated and used in all demo weddings and template preview cards
- Luxury-dark template now consistent with other templates (cinematic hero style)
- Demo name input feature added: users can enter name, select template, preview as guest
- All button hover effects fixed with proper visible feedback
- Lint passes, no hydration errors, all pages load correctly
