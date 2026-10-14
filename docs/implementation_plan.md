# Implementation Plan - Admin Panel Redesign, Bug Fixes & AI Per-Field Translation

## User Requests & Bug Reports Addressed
1. **Featured button bug**: Toggling featured/unfeatured currently causes sample data to disappear or wipe out. Fix state management and ensure sample 6 packages are persistently saved and injected into Firebase / data context.
2. **Category Management**: Add a dedicated Category Setting option in the admin panel so admins can manage tour categories.
3. **Admin Panel Redesign (Desktop Sidebar)**: Redesign the admin panel with a clean professional desktop sidebar layout (Overview, Packages, Categories, Bookings, Settings) and responsive drawer.
4. **Per-Field AI Translation**: Add "ENG" / "বাang" translation buttons next to each text field in the package editor modal for independent per-field translation using Gemini API.

---

## Proposed Changes

### 1. Data Context & Sample Packages (`src/context/DataContext.tsx`)
- Ensure the 6 sample tour packages (Sylhet, Cox's Bazar, Bandarban, Sundarbans, Sajek, Saint Martin) are initialized correctly in Firestore / localStorage.
- Fix the featured toggle handler so updating the `isFeatured` flag updates only the targeted package without resetting or clearing other packages.
- Add category management state (list of categories, add/edit/delete category).

### 2. Admin Panel Layout Redesign (`src/pages/admin/AdminDashboardPage.tsx` & layout components)
- Create a professional sidebar navigation layout for desktop:
  - Sidebar: Overview (Dashboard stats), Tour Packages, Categories, Bookings, Settings.
  - Header: Breadcrumbs / Page title, Quick actions, Admin user profile, Language / Back to site.
- Mobile responsive drawer toggle.

### 3. Category Management (`src/pages/admin/AdminCategoriesTab.tsx` or section)
- Add a dedicated tab/section in the admin panel to view, add, and remove package categories (e.g., Hill Tracts, Sea Beach, Heritage, Sundarbans).

### 4. Per-Field AI Translation (`src/pages/admin/AdminPackageFormModal.tsx`)
- For fields like Title, Description, Inclusions, Itinerary days, add small inline action buttons ("ENG" | "বাং") next to input labels or fields.
- Clicking the button calls a backend server endpoint `/api/translate-field` using `@google/genai` (`gemini-3.8-flash`) to translate the specific text field between English and Bengali instantly without affecting other fields.

---

## Verification Plan
- **Automated Build/Lint**: Run `compile_applet` and `lint_applet` to verify zero TypeScript or syntax errors.
- **Manual Verification in Preview**:
  - Test toggling featured status on packages in the admin dashboard and ensure data persists.
  - Test category creation and assignment.
  - Test the new desktop sidebar admin panel layout.
  - Test per-field "ENG" / "বাং" AI translation buttons in package form modal.
