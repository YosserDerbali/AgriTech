# Agronomist Profile Sections - Template Implementation

## Overview

This document outlines the newly added **agronomist profile sections** that have been implemented as **hardcoded templates**. These sections serve as UI/UX prototypes and will receive full backend integration once the required functionalities are finalized.

## Sections Added

### 1. **Notifications Screen**
- **Route:** `AgronomistNavigator > Notifications`
- **File:** `mobile/src/screens/agronomist/NotificationsScreen.tsx`
- **Status:** ✅ Frontend Template (Hardcoded)

#### Current Features:
- Displays 4 sample notification items with:
  - Notification title and description
  - Timestamp information
  - Icon with color coding
  - Notification type categorization

#### Sample Data:
```typescript
{
  id: '1',
  title: 'New Diagnosis Submitted',
  description: 'John Farmer submitted a new tomato plant diagnosis',
  timestamp: '2 hours ago',
  icon: 'alert-circle',
  color: '#FF6B6B'
}
```

#### Backend TODO:
- [ ] Create `/api/notifications` endpoint to fetch user notifications
- [ ] Implement notification filtering by type
- [ ] Add pagination for large notification lists
- [ ] Mark notifications as read/unread
- [ ] Real-time notification updates (WebSocket or polling)

---

### 2. **Settings Screen**
- **Route:** `AgronomistNavigator > Settings`
- **File:** `mobile/src/screens/agronomist/SettingsScreen.tsx`
- **Status:** ✅ Frontend Template (Hardcoded)

#### Current Features:
- Settings organized in groups:
  - **Preferences:** Push Notifications, Email Updates
  - **Display:** Dark Mode
  - **Offline:** Offline Mode

#### Toggle States (UI Only):
- Each setting has a working toggle switch UI that updates local state
- No persistence yet

#### Backend TODO:
- [ ] Create `/api/settings` endpoint to save user preferences
- [ ] Implement settings persistence in database
- [ ] Add user notification preference management
- [ ] Support dark mode theme synchronization
- [ ] Implement offline mode synchronization logic

---

### 3. **Help & Support Screen**
- **Route:** `AgronomistNavigator > HelpAndSupport`
- **File:** `mobile/src/screens/agronomist/HelpAndSupportScreen.tsx`
- **Status:** ✅ Frontend Template (Hardcoded)

#### Current Features:
- **Contact Methods:** Email, Phone, Website (with clickable links)
- **FAQ Section:** 5 expandable FAQ items with answers
- **Resources:** 
  - Documentation & Guides
  - Blog & Articles
  - Community Forum

#### Sample FAQ Topics:
1. How do I review a diagnosis?
2. Can I edit my published articles?
3. How do I increase my rating?
4. What file formats can I upload?
5. How do I contact support?

#### External Links (Functional):
- Email: `support@agritech.com` (opens mail client)
- Phone: `1-800-247-8324` (opens phone dialer)
- Website: `https://www.agritech.com/help`
- Documentation: `https://www.agritech.com/docs`
- Blog: `https://www.agritech.com/blog`
- Community: `https://www.agritech.com/community`

#### Backend TODO:
- [ ] Create `/api/faqs` endpoint for dynamic FAQ management
- [ ] Create `/api/help-resources` for support articles
- [ ] Implement live chat or support ticket system
- [ ] Add in-app help content management
- [ ] Link help articles to specific app features

---

### 4. **Updated Profile Screen**
- **Route:** `AgronomistNavigator > AgronomistTabs > AgronomistProfile`
- **File:** `mobile/src/screens/agronomist/AgronomistProfileScreen.tsx`
- **Status:** ✅ Frontend Template (Enhanced)

#### Changes Made:
- Added navigation menu with 3 clickable items:
  1. **Notifications** → Opens NotificationsScreen
  2. **Settings** → Opens SettingsScreen
  3. **Help & Support** → Opens HelpAndSupportScreen

#### Menu Styling:
- Icons with Feather icons
- Arrow indicators for navigation
- Optimized touch targets
- Consistent color theming

---

## Navigation Integration

### Updated Navigation Types
**File:** `mobile/src/navigation/types.ts`
```typescript
export type AgronomistStackParamList = {
  AgronomistTabs: undefined;
  DiagnosisReview: { id: string };
  ArticleEditor: { id?: string };
  Notifications: undefined;
  Settings: undefined;
  HelpAndSupport: undefined;
};
```

### Updated Navigator
**File:** `mobile/src/navigation/AgronomistNavigator.tsx`
- All 3 new screens registered in the navigation stack
- All 3 screens use custom back button (no default header)
- Smooth navigation transitions

---

## Design & Styling

### Color Scheme:
- Primary brand color: `#1B5E20` (Green)
- Accent color: `#F9A825` (Gold/Amber)
- Background: `#F5F5F0` (Light neutral)
- Surface: `#FFFFFF` (White)

### Icons:
- Using `Feather` icons from Expo
- Consistent 20-24px sizing across all screens
- Color-coded notification icons in Notifications screen

### Responsive Design:
- Scrollable content for overflow
- Touch-friendly spacing
- Mobile-first approach

---

## How to Test

### Mobile Testing:
1. Navigate to Agronomist Profile screen
2. Tap on any of the three menu items:
   - **Notifications** → View sample notification list
   - **Settings** → Toggle preferences (state updates locally)
   - **Help & Support** → Browse FAQs and click contact links

### Test Credentials:
```
Role: Agronomist
Email: sarah@agro.com
Password: password123
```

---

## Backend Implementation Roadmap

### Phase 1: Notifications
**Priority:** HIGH
- [ ] Fetch notifications from backend
- [ ] Implement notification database schema
- [ ] Real-time notification updates
- [ ] Mark as read functionality

### Phase 2: Settings & Preferences
**Priority:** MEDIUM
- [ ] Save user preferences to database
- [ ] Sync settings across devices
- [ ] Implement theme persistence
- [ ] Offline mode synchronization

### Phase 3: Help & Support
**Priority:** MEDIUM
- [ ] Integrate CMS for FAQ management
- [ ] Dynamic resource loading
- [ ] Support ticket system
- [ ] In-app help content management

### Phase 4: Analytics & Optimization
**Priority:** LOW
- [ ] Track notification click rates
- [ ] Monitor most viewed help articles
- [ ] User preference analytics

---

## Future Enhancements

1. **Push Notifications:** Integrate native push notification service
2. **Notification Badges:** Add unread notification count badges
3. **Search:** Add search functionality to FAQs
4. **Preferences Sync:** Sync settings across web and mobile
5. **Customizable Notifications:** Let users customize notification types
6. **Help Search:** Full-text search across help articles
7. **Feedback System:** Let users rate helpfulness of FAQs

---

## Notes

- All screens are **fully functional USI** with smooth animations and interactions
- Toggle switches work in real-time but don't persist yet
- External links (email, phone, URLs) are fully functional
- Expandable FAQ items work smoothly
- Back navigation works correctly across all screens

---

## Files Modified/Created

| File | Type | Status |
|------|------|--------|
| `mobile/src/screens/agronomist/NotificationsScreen.tsx` | Created | ✅ |
| `mobile/src/screens/agronomist/SettingsScreen.tsx` | Created | ✅ |
| `mobile/src/screens/agronomist/HelpAndSupportScreen.tsx` | Created | ✅ |
| `mobile/src/screens/agronomist/AgronomistProfileScreen.tsx` | Modified | ✅ |
| `mobile/src/navigation/types.ts` | Modified | ✅ |
| `mobile/src/navigation/AgronomistNavigator.tsx` | Modified | ✅ |

---

## Questions or Changes?

When backend functionalities are finalized, these template screens can be quickly updated to integrate real data fetching and state management using the existing Zustand stores.
