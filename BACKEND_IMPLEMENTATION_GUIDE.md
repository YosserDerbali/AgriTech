# Backend Implementation Guide - Admin Interfaces

## Overview
This document provides step-by-step instructions for implementing the backend endpoints and database operations needed to fully support the admin frontend interfaces that have been updated to fetch from the backend.

---

## 1. AI Models Management Endpoints

### 1.1 GET /admin/ai-models - List All AI Models

**Frontend Requirement**: AIModelsPage.tsx calls `loadAIModels()` on component mount

**Backend Implementation**:
```javascript
// backend/routes/admin.js
router.get('/ai-models', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const aiModels = await AiModel.findAll({
      attributes: ['id', 'name', 'version', 'type', 'accuracy', 'totalPredictions', 'isEnabled', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });
    
    res.json(aiModels);
  } catch (error) {
    console.error('Error fetching AI models:', error);
    res.status(500).json({ message: 'Failed to fetch AI models' });
  }
});
```

**Database Model Check**:
```
Ensure AiModel table has:
- id (UUID primary key)
- name (string)
- version (string)
- type (enum: 'DISEASE_DETECTION', 'SPEECH_RECOGNITION', etc.)
- accuracy (decimal 0-100)
- totalPredictions (integer)
- isEnabled (boolean, default: true)
- createdAt (timestamp)
- updatedAt (timestamp)
```

**Expected Response**:
```json
[
  {
    "id": "uuid-1",
    "name": "Plant Disease Detection Model",
    "version": "2.1.0",
    "type": "DISEASE_DETECTION",
    "accuracy": 91.5,
    "totalPredictions": 1243,
    "isEnabled": true,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  {
    "id": "uuid-2",
    "name": "Whisper Speech Recognition",
    "version": "1.0.0",
    "type": "SPEECH_RECOGNITION",
    "accuracy": 87.2,
    "totalPredictions": 456,
    "isEnabled": true,
    "createdAt": "2024-02-20T14:45:00Z"
  }
]
```

---

### 1.2 PATCH /admin/ai-models/:modelId - Toggle AI Model Status

**Frontend Requirement**: AIModelsPage.tsx calls `toggleAIModel(modelId)` on toggle button click

**Backend Implementation**:
```javascript
// backend/routes/admin.js
router.patch('/ai-models/:modelId', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { modelId } = req.params;
    
    const model = await AiModel.findByPk(modelId);
    if (!model) {
      return res.status(404).json({ message: 'AI Model not found' });
    }
    
    const updatedModel = await model.update({
      isEnabled: !model.isEnabled,
    });
    
    res.json(updatedModel);
  } catch (error) {
    console.error('Error updating AI model:', error);
    res.status(500).json({ message: 'Failed to update AI model' });
  }
});
```

**Expected Response**:
```json
{
  "id": "uuid-1",
  "name": "Plant Disease Detection Model",
  "isEnabled": false,
  "updatedAt": "2024-03-15T12:00:00Z"
}
```

---

### 1.3 POST /admin/ai-models - Create New AI Model

**Potential Frontend Use**: Future feature to add new models through admin UI

**Backend Implementation**:
```javascript
// backend/routes/admin.js
router.post('/ai-models', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { name, version, type, accuracy, totalPredictions } = req.body;
    
    // Validation
    if (!name || !version || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const aiModel = await AiModel.create({
      name,
      version,
      type,
      accuracy: accuracy || 0,
      totalPredictions: totalPredictions || 0,
      isEnabled: true,
    });
    
    res.status(201).json(aiModel);
  } catch (error) {
    console.error('Error creating AI model:', error);
    res.status(500).json({ message: 'Failed to create AI model' });
  }
});
```

---

### 1.4 DELETE /admin/ai-models/:modelId - Delete AI Model

**Potential Frontend Use**: Future feature to remove models

**Backend Implementation**:
```javascript
// backend/routes/admin.js
router.delete('/ai-models/:modelId', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { modelId } = req.params;
    
    const model = await AiModel.findByPk(modelId);
    if (!model) {
      return res.status(404).json({ message: 'AI Model not found' });
    }
    
    await model.destroy();
    res.json({ message: 'AI Model deleted successfully' });
  } catch (error) {
    console.error('Error deleting AI model:', error);
    res.status(500).json({ message: 'Failed to delete AI model' });
  }
});
```

---

## 2. System Settings Endpoints

### 2.1 GET /admin/settings - Retrieve System Configuration

**Frontend Requirement**: SettingsPage.tsx calls `loadSystemSettings()` on component mount

**Backend Implementation Options**:

#### Option A: Settings Table
```javascript
// backend/models/SystemSettings.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('SystemSetting', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    maintenanceMode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    maxImageSizeMB: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
    },
    confidenceThreshold: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.8,
    },
    notificationsEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    externalBlogSyncEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    externalBlogSyncIntervalHours: {
      type: DataTypes.INTEGER,
      defaultValue: 6,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });
};
```

#### Option B: Single Row Settings (Recommended)
```javascript
// backend/routes/admin.js
router.get('/settings', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    // Get or create default settings (single row)
    let settings = await SystemSetting.findOne();
    
    if (!settings) {
      settings = await SystemSetting.create({
        maintenanceMode: false,
        maxImageSizeMB: 10,
        confidenceThreshold: 0.8,
        notificationsEnabled: true,
        externalBlogSyncEnabled: false,
        externalBlogSyncIntervalHours: 6,
      });
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
});
```

**Expected Response**:
```json
{
  "id": "settings-id",
  "maintenanceMode": false,
  "maxImageSizeMB": 10,
  "confidenceThreshold": 0.8,
  "notificationsEnabled": true,
  "externalBlogSyncEnabled": false,
  "externalBlogSyncIntervalHours": 6,
  "updatedAt": "2024-03-15T12:00:00Z"
}
```

---

### 2.2 PUT /admin/settings - Update System Configuration

**Frontend Requirement**: SettingsPage.tsx calls `updateSystemConfig()` on save button click

**Backend Implementation**:
```javascript
// backend/routes/admin.js
router.put('/settings', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { 
      maintenanceMode,
      maxImageSizeMB,
      confidenceThreshold,
      notificationsEnabled,
      externalBlogSyncEnabled,
      externalBlogSyncIntervalHours,
    } = req.body;
    
    // Validation
    if (maxImageSizeMB && (maxImageSizeMB < 1 || maxImageSizeMB > 50)) {
      return res.status(400).json({ message: 'Image size must be between 1 and 50 MB' });
    }
    
    if (confidenceThreshold && (confidenceThreshold < 0.5 || confidenceThreshold > 0.95)) {
      return res.status(400).json({ message: 'Confidence threshold must be between 0.5 and 0.95' });
    }
    
    if (externalBlogSyncIntervalHours && (externalBlogSyncIntervalHours < 1 || externalBlogSyncIntervalHours > 24)) {
      return res.status(400).json({ message: 'Sync interval must be between 1 and 24 hours' });
    }
    
    // Get or create settings
    let settings = await SystemSetting.findOne();
    if (!settings) {
      settings = await SystemSetting.create({});
    }
    
    // Update settings
    const updatedSettings = await settings.update({
      maintenanceMode: maintenanceMode !== undefined ? maintenanceMode : settings.maintenanceMode,
      maxImageSizeMB: maxImageSizeMB || settings.maxImageSizeMB,
      confidenceThreshold: confidenceThreshold || settings.confidenceThreshold,
      notificationsEnabled: notificationsEnabled !== undefined ? notificationsEnabled : settings.notificationsEnabled,
      externalBlogSyncEnabled: externalBlogSyncEnabled !== undefined ? externalBlogSyncEnabled : settings.externalBlogSyncEnabled,
      externalBlogSyncIntervalHours: externalBlogSyncIntervalHours || settings.externalBlogSyncIntervalHours,
    });
    
    res.json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Failed to update settings' });
  }
});
```

**Expected Response**: Same as GET response with updated values

---

## 3. Frontend API Service Integration

### Update `src/services/adminAPIs.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// AI Models
export const getAIModels = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin/ai-models`);
  return response.data;
};

export const toggleAIModel = async (modelId: string) => {
  const response = await axios.patch(`${API_BASE_URL}/admin/ai-models/${modelId}`);
  return response.data;
};

export const createAIModel = async (modelData: any) => {
  const response = await axios.post(`${API_BASE_URL}/admin/ai-models`, modelData);
  return response.data;
};

export const deleteAIModel = async (modelId: string) => {
  const response = await axios.delete(`${API_BASE_URL}/admin/ai-models/${modelId}`);
  return response.data;
};

// System Settings
export const getSystemSettings = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin/settings`);
  return response.data;
};

export const updateSystemSettings = async (settings: any) => {
  const response = await axios.put(`${API_BASE_URL}/admin/settings`, settings);
  return response.data;
};
```

### Update `src/stores/adminStore.ts`:

```typescript
import { getAIModels, toggleAIModel, getSystemSettings, updateSystemSettings } from '@/services/adminAPIs';

// In the store implementation:
loadAIModels: async () => {
  set({ isLoading: true });
  try {
    const models = await getAIModels();
    set({ aiModels: models, isLoading: false });
  } catch (error) {
    console.error('Failed to load AI models:', error);
    set({ isLoading: false });
    throw error;
  }
},

loadSystemSettings: async () => {
  set({ isLoading: true });
  try {
    const settings = await getSystemSettings();
    set({ systemConfig: settings, isLoading: false });
  } catch (error) {
    console.error('Failed to load settings:', error);
    set({ isLoading: false });
    throw error;
  }
},

updateSystemConfig: async (config) => {
  try {
    const updated = await updateSystemSettings(config);
    set({ systemConfig: updated });
  } catch (error) {
    console.error('Failed to update system config:', error);
    throw error;
  }
},
```

---

## 4. Database Migration Script

### Create migration for SystemSettings table:

```javascript
// backend/migrations/[timestamp]-create-system-settings.js
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SystemSettings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      maintenanceMode: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      maxImageSizeMB: {
        type: Sequelize.INTEGER,
        defaultValue: 10,
      },
      confidenceThreshold: {
        type: Sequelize.DECIMAL(3, 2),
        defaultValue: 0.8,
      },
      notificationsEnabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      externalBlogSyncEnabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      externalBlogSyncIntervalHours: {
        type: Sequelize.INTEGER,
        defaultValue: 6,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('SystemSettings');
  },
};
```

### Run migration:
```bash
cd backend
npm run db:migrate
```

---

## 5. Middleware Setup

### Ensure Authorization Middleware Exists:

```javascript
// backend/middleware/auth.js
export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};
```

### Apply to Admin Routes:

```javascript
// backend/routes/admin.js
router.use(authenticateToken);
router.use(authorizeAdmin);
// All routes below this will require authentication and admin role
```

---

## 6. Testing the Endpoints

### Test AI Models Endpoint:
```bash
# Get all AI models
curl -X GET http://localhost:3000/admin/ai-models \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Toggle AI model
curl -X PATCH http://localhost:3000/admin/ai-models/model-id \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Settings Endpoints:
```bash
# Get settings
curl -X GET http://localhost:3000/admin/settings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Update settings
curl -X PUT http://localhost:3000/admin/settings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "maintenanceMode": false,
    "maxImageSizeMB": 15,
    "confidenceThreshold": 0.85
  }'
```

---

## 7. Environment Variables

### Ensure Backend Has:
```
VITE_API_BASE_URL=http://localhost:3000
DATABASE_URL=your_postgres_url
JWT_SECRET=your_jwt_secret
PORT=3000
NODE_ENV=development
```

---

## 8. Implementation Checklist

### Backend Setup:
- [ ] Create SystemSettings model
- [ ] Create AI Models management endpoints
  - [ ] GET /admin/ai-models
  - [ ] PATCH /admin/ai-models/:modelId
  - [ ] POST /admin/ai-models (optional)
  - [ ] DELETE /admin/ai-models/:modelId (optional)
- [ ] Create Settings management endpoints
  - [ ] GET /admin/settings
  - [ ] PUT /admin/settings
- [ ] Create database migration for SystemSettings
- [ ] Run migration: `npm run db:migrate`
- [ ] Test all endpoints with Postman/curl

### Frontend Updates:
- [ ] Update adminAPIs.ts with actual endpoint calls
- [ ] Update adminStore.ts to use real API methods
- [ ] Remove mock timeouts/delays from store methods
- [ ] Test AdminDashboardPage data loading
- [ ] Test AIModelsPage model loading
- [ ] Test SettingsPage settings loading and saving
- [ ] Verify error handling works correctly
- [ ] Test toast notifications appear

### Database:
- [ ] Verify AiModel table has all required fields
- [ ] Add sample AI models for testing
- [ ] Create default SystemSettings row
- [ ] Add indexes for performance (if needed)

---

## 9. Success Criteria

After implementation, verify:
1. ✅ AdminDashboardPage loads real users and diagnoses from backend
2. ✅ AIModelsPage loads AI models from backend
3. ✅ AIModelsPage toggle button updates backend
4. ✅ SettingsPage loads current settings from backend
5. ✅ SettingsPage save button updates backend settings
6. ✅ All pages show proper error messages on API failure
7. ✅ Toast notifications appear on success/failure
8. ✅ Loading states displayed during API calls
9. ✅ RSS Configuration page doesn't re-render on route change

---

## 10. Common Issues & Solutions

### Issue: 401 Unauthorized
**Solution**: Ensure JWT token is sent in Authorization header: `Authorization: Bearer <token>`

### Issue: 403 Forbidden
**Solution**: Verify user has ADMIN role in database User table

### Issue: 404 Not Found
**Solution**: Verify route path matches exactly (e.g., `/admin/ai-models` not `/admin/aimodels`)

### Issue: Settings not persisting
**Solution**: Ensure SystemSettings table exists and migration was run successfully

### Issue: AI Models return empty array
**Solution**: Insert test data into AiModel table:
```sql
INSERT INTO "AiModels" (id, name, version, type, accuracy, "totalPredictions", "isEnabled", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'Plant Disease Detection Model', '2.1.0', 'DISEASE_DETECTION', 91.5, 1243, true, NOW(), NOW()),
  (gen_random_uuid(), 'Whisper Speech Recognition', '1.0.0', 'SPEECH_RECOGNITION', 87.2, 456, true, NOW(), NOW());
```

---

**Status**: 📋 Ready for Backend Implementation  
**Frontend Status**: ✅ Complete  
**Backend Status**: 🔄 In Progress  

All frontend code is ready and waiting for backend endpoints to be implemented.
