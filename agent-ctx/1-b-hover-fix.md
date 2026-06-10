# Task 1-b: Fix Button Hover Colors in Wedding Components

## Summary
Fixed invisible/nearly-invisible button hover states across 5 wedding invitation components by adding React `useState` hover tracking with `onMouseEnter`/`onMouseLeave` handlers.

## Problem
Buttons used very transparent hex colors (e.g., `colors.primary + '15'`) for backgrounds and borders. On dark backgrounds, the hover effect was barely visible because there was no hover state change at all — only framer-motion scale animations provided feedback.

## Files Modified

### 1. `AddToCalendar.tsx`
- Added `useState` import
- Extracted `CalendarOption` type for the sub-component
- Created `CalendarButtons` sub-component with `hoveredIndex` state
- Calendar buttons now: bg `15` → `30`, border `25` → `50`, adds glow shadow on hover

### 2. `InvitationCard.tsx`
- Added 5 hover state variables: `downloadHovered`, `shareHovered`, `whatsappHovered`, `telegramHovered`, `copyHovered`
- **Download button**: gradient opacity `20` → `40`, border `30` → `55`, glow shadow on hover
- **Share toggle**: transparent → `15` bg, text color shift, border `15` → `35`, subtle glow
- **WhatsApp button**: bg `18` → `30`, border `25` → `50`, green glow
- **Telegram button**: bg `18` → `30`, border `25` → `50`, blue glow
- **Copy link button**: bg `10` → `25`, border `20` → `40`, primary glow

### 3. `Venue.tsx`
- Added `useState` import and `mapHovered` state
- Map directions button: enhanced `boxShadow` from `25` → `40` opacity on hover (solid button color already visible)

### 4. `RsvpSection.tsx`
- Added `attendingHovered` and `notAttendingHovered` state variables
- **Attending button** (solid): shadow `25` → `40` on hover
- **Not-attending button** (transparent): bg `12` → `25`, border `30` → `50`, glow shadow on hover

### 5. `WeddingDetails.tsx`
- Added `useState` import and `contactHovered`, `mapHovered` state variables
- **Contact phone link**: bg `0A` → `15`, border `18` → `30`, subtle glow on hover
- **Map button** (solid): shadow `30` → `45` on hover

## Pattern Used
For each interactive element:
```tsx
const [isHovered, setIsHovered] = useState(false);

// On element:
onMouseEnter={() => setIsHovered(true)}
onMouseLeave={() => setIsHovered(false)}

// In style:
backgroundColor: isHovered ? colors.primary + '30' : colors.primary + '15',
border: `1px solid ${isHovered ? colors.primary + '50' : colors.primary + '25'}`,
boxShadow: isHovered ? `0 0 20px ${colors.primary}20` : 'none',
```

## Lint
Passed with no errors.
