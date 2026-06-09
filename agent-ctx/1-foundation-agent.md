---
Task ID: 1
Agent: Foundation Agent
Task: Create types, themes, utilities, and db-helpers

Work Log:
- Created src/types/wedding.ts with all TypeScript interfaces (Wedding, Guest, RsvpResponse, ThemeColors, ThemeConfig, WeddingFormData, CreateWeddingRequest, ApiResponse, ThemeName)
- Created src/lib/themes.ts with 6 theme configurations (classic-gold, modern-dark, elegant-white, royal-blue, rose-gold, traditional-arabic) plus helper functions getTheme, getThemeColors, and themeOptions
- Created src/lib/wedding-utils.ts with utility functions (generateSlug, parseGalleryImages, formatDateArabic, formatTimeArabic, getWeddingColors, getGuestWelcomeMessage, getGeneralWelcomeMessage, getCountdownTarget)
- Created src/lib/db-helpers.ts with database helper functions (getWeddingBySlug, getAllWeddings, createWedding, updateWedding, deleteWedding, getGuestsByWedding, addGuest, getRsvpsByWedding, submitRsvp)
- All files pass lint checks successfully

Stage Summary:
- All 4 foundation files created successfully
- 6 themes defined: classic-gold, modern-dark, elegant-white, royal-blue, rose-gold, traditional-arabic
- Database helpers support full CRUD for weddings, guests, and RSVP
- Arabic date/time formatting utilities included for Egyptian/Arabic wedding clients
- Guest personalization welcome message utilities included
