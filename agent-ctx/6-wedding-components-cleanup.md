# Task 6: Wedding Components Cleanup Agent

## Task
Remove groomPhoto/bridePhoto references and improve WelcomeScreen envelope experience

## Work Completed

### Hero.tsx
- Removed `groomPhoto?: string` and `bridePhoto?: string` from HeroProps interface
- Updated all 4 hero style functions (HeroCentered, HeroSplit, HeroCinematic, HeroFrame):
  - Removed groomPhoto/bridePhoto from destructured props
  - Removed the `groomPhoto && bridePhoto` conditional rendering blocks (two separate CircularPhoto components)
  - Replaced ternary `couplePhoto ? ... : groomPhoto && bridePhoto ? ... : null` with simple `couplePhoto && (...)`
  - Updated `Required<Omit<HeroProps, ...>>` type annotations to remove 'groomPhoto' | 'bridePhoto'
- Removed groomPhoto/bridePhoto from main Hero export component props and commonProps object

### WeddingPageClient.tsx
- Added `couplePhoto={wedding.couplePhoto}` prop to WelcomeScreen component

### GuestWelcome.tsx
- Verified already clean - only uses couplePhoto, no groomPhoto/bridePhoto

### InvitationCard.tsx
- Made couple photo more prominent: changed from `w-16 h-16` (64x64) to `w-24 h-24` (96x96)
- Increased border from 2px to 3px
- Added box-shadow glow effect

### WelcomeScreen.tsx
- Complete rewrite as luxury envelope experience:
  - Dark background (#1a1a2e) with gold border envelope design
  - Envelope shows: guest name, couple names, geometric pattern, corner ornaments, wax seal
  - "فتح الدعوة" button with gradient and shimmer animation
  - On click: envelope fades out → sparkle burst → invitation card reveals
  - Revealed invitation shows: couple photo (large, with gold border and glow), guest name in gold text, welcome messages
  - Added `couplePhoto` prop for photo display
  - Multi-phase animation with framer-motion
  - All RTL, uses wedding colors from props

### wedding.ts
- Verified already clean - no groomPhoto/bridePhoto types

## Summary
- All groomPhoto/bridePhoto references removed from wedding components
- Only couplePhoto remains for photo display across all components
- InvitationCard couple photo enlarged to 96x96 with enhanced styling
- WelcomeScreen transformed into luxury dark envelope with gold accents, 3D animations, and couple photo display
- Zero lint errors, dev server compiles successfully
