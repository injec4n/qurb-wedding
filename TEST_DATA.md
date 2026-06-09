# زفاتي (Zafati) - Test Guide

## Admin Authentication

**URL:** `/admin`
**Login Password:** `zafati2025`

### Test Steps:
1. Go to `/admin` → should redirect to `/admin/login`
2. Enter password `zafati2025` → should redirect to `/admin` dashboard
3. Click "تسجيل الخروج" → should redirect back to login

---

## Wedding Creation (End-to-End)

### Test Steps:
1. Login to admin at `/admin`
2. Click "إنشاء زفاف جديد" → goes to `/admin/create`
3. Fill form:
   - اسم العريس: `أحمد`
   - اسم العريسة: `سارة`
   - الرابط (Slug): `ahmed-sara` (must be unique, English letters only)
   - تاريخ الزفاف: choose a future date (e.g., `2025-12-01`)
   - وقت الزفاف: `20:00`
   - اسم القاعة: `قاعة الأزهار`
   - عنوان القاعة: `الجيزة، مصر`
   - رسالة الترحيب: `نتشرف بحضوركم`
   - رقم الهاتف: `+201012345678`
4. Switch theme from dropdown → colors should update automatically
5. Click "حفظ" → should redirect to admin with success toast
6. In admin table, click the slug link → should open invitation page at `/w/ahmed-sara`

### What to Verify:
- [ ] Theme colors change when selecting a different theme
- [ ] Wedding appears in admin table after creation
- [ ] Clicking the slug link opens the correct `/w/[slug]` URL
- [ ] All data (names, date, time, venue, phone, welcome message) renders on invitation

---

## Invitation Page

**URL Pattern:** `/w/[slug]`

### Without Guest Parameter:
1. Open `/w/mohamed-fatma`
2. Verify:
   - [ ] Hero section with بسم الله الرحمن الرحيم
   - [ ] Names displayed: محمد & فاطمة
   - [ ] General welcome: "يسعدنا دعوتكم 🌹"
   - [ ] Countdown timer (or "الحفل قد بدأ! 🎉" if date passed)
   - [ ] Wedding details: date, time, venue, phone
   - [ ] Welcome message displayed (if set)
   - [ ] RSVP form with name input field (since no guest param)
   - [ ] Gallery section (with placeholder cards if no images)
   - [ ] Invitation card download button
   - [ ] Instagram story download button
   - [ ] Footer: "صُنع بكل حب ❤️"

### With Guest Parameter:
1. Open `/w/mohamed-fatma?guest=محمود`
2. Verify:
   - [ ] Personalized welcome: "أهلاً محمود 🌷"
   - [ ] "تم تجهيز هذه الدعوة خصيصاً لك"
   - [ ] RSVP shows: "يا محمود، هل ستتمكن من الحضور؟"

---

## RSVP System

### Test Steps:
1. Open a wedding page (e.g., `/w/karim-nourhan?guest=مريم`)
2. Click "سأحضر ✅" button
3. Verify:
   - [ ] Success toast appears
   - [ ] Form changes to "تم تأكيد الحضور ✅"
4. Open another wedding page without guest param
5. Enter name in the "اسمك *" field
6. Click "سأحضر ✅"
7. Verify response was saved

### Admin RSVP View:
1. Go to `/admin`
2. Click on a wedding's edit button (pencil icon)
3. Click "الردود" tab
4. Verify:
   - [ ] RSVP responses are listed
   - [ ] Status badges show correct colors (green for attending, red for not attending)
   - [ ] Filter buttons work

---

## Theme System

### Available Themes:
| Theme | Arabic Name | Primary Color |
|-------|-------------|---------------|
| classic-gold | ذهبي كلاسيكي | #D4A853 |
| modern-dark | داكن عصري | #C0C0C0 |
| elegant-white | أبيض أنيق | #8B7355 |
| royal-blue | أزرق ملكي | #C9A84C |
| rose-gold | ذهبي وردي | #B76E79 |
| traditional-arabic | عربي تقليدي | #2E7D32 |

### Test Steps:
1. Create or edit a wedding
2. Change the theme dropdown → all 6 color fields should auto-update
3. Save and open the invitation page
4. Verify:
   - [ ] Background color matches theme
   - [ ] Text color matches theme
   - [ ] Buttons use theme primary color
   - [ ] Decorative elements use theme accent color

---

## Guest Management

### Test Steps:
1. Go to `/admin`
2. Click edit (pencil) on a wedding
3. Click "الضيوف" tab
4. Add a single guest:
   - Enter name: `علي`
   - Click "إضافة"
5. Add multiple guests:
   - Click "إضافة متعددة"
   - Enter names (one per line):
     ```
     حسن
     فاطمة
     عمر
     ```
   - Click "إضافة الكل"
6. Copy a guest link using the copy button
7. Verify:
   - [ ] Guests appear in the list
   - [ ] Guest count updates
   - [ ] Copied link format: `https://[domain]/w/[slug]?guest=[encoded_name]`
   - [ ] Opening the guest link shows personalized welcome

---

## Edit Wedding (Gallery Images Fix)

### Test Steps:
1. Edit a wedding that has gallery images
2. Add a gallery image URL
3. Save
4. Edit the same wedding again
5. Verify:
   - [ ] Previously saved gallery images are still present (not lost)
   - [ ] Can add/remove images

---

## Sample Data

### Seed the Database:
Visit `/api/seed` to create sample data:
- Wedding: محمد & فاطمة (slug: `mohamed-fatma`)
- 8 sample guests: محمود, أحمد, سارة, نورا, خالد, هند, عمر, ريم

### Test Wedding URLs:
- `/w/mohamed-fatma` - Classic Gold theme
- `/w/omar-reem` - Rose Gold theme  
- `/w/karim-nourhan` - Rose Gold theme

---

## Landing Page

**URL:** `/`

### Verify:
- [ ] Hero section with animated elements
- [ ] "شاهد مثال" button → links to `/w/mohamed-fatma`
- [ ] "ابدأ الآن" button → links to `/admin/create`
- [ ] Features section with 6 feature cards
- [ ] Theme preview carousel (horizontal scroll on mobile)
- [ ] "كيف يعمل؟" steps section
- [ ] CTA section
- [ ] Footer with links

---

## Key Bug Fixes Applied

| Bug | Fix |
|-----|-----|
| Gallery images lost on edit | Added `parseGalleryImages()` to handle string↔array conversion |
| Broken guest link URLs | Changed `/${slug}` → `/w/${slug}` in GuestManager |
| Broken wedding link in admin | Changed `/${slug}` → `/w/${slug}` in WeddingList |
| Bulk guest addition fails | API now handles `{ bulk: true, names: [...] }` |
| Mass assignment vulnerability | PUT API now whitelists allowed fields |
| Theme switching disabled on edit | Removed `if (!initialData)` guard from theme effect |
| Venue iframe broken (Google Maps) | Replaced iframe with link-only approach |
| No admin authentication | Added password-based auth with cookie |
| welcomeMessage not shown | Added to WeddingDetails component |
| contactPhone not shown | Added phone link in WeddingDetails component |
| RSVP without name fails | Added name input when no guest param |
