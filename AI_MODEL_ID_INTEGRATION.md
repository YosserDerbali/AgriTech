# AI Model ID Integration - Implementation Summary

## Overview
Refactored the Diagnoses table to store references to AI model IDs instead of storing the model version string. This enables better tracking of which AI model was used for each diagnosis.

## Changes Made

### 1. **Updated Diagnoses Model** 
**File:** `backend/models/Diagnoses.js`
- Replaced field: `ai_model_version` (STRING) → `ai_model_id` (UUID with foreign key to ai_models table)
- Added proper foreign key constraint: `REFERENCES ai_models(id) ON DELETE SET NULL`

### 2. **Created AI Model Constants**
**File:** `backend/config/aiModels.js` (NEW)
- Defined fixed UUIDs for consistent reference:
  - `DISEASE_DETECTION: "550e8400-e29b-41d4-a716-446655440001"`
  - `SPEECH_RECOGNITION: "550e8400-e29b-41d4-a716-446655440002"`
- Can be imported and used across the application

### 3. **Updated AI Models Seeder**
**File:** `backend/seeders/20260212152930-seed-ai-models.js`
- Seeds two AI models with fixed IDs:
  1. **Plant Disease Classifier** (DISEASE_DETECTION)
     - Version: v2.1.0
     - Accuracy: 91.5%
  2. **Whisper Speech Recognition** (SPEECH_RECOGNITION)
     - Version: v1.0.0
     - Accuracy: 95.2%
- Uses constants from `backend/config/aiModels.js`

### 4. **Created Database Migration**
**File:** `backend/migrations/20260420000000-replace-ai-model-version-with-id.js` (NEW)
- Adds `ai_model_id` column to diagnoses table
- Removes `ai_model_version` column
- Idempotent: checks column existence before operations
- Includes rollback support

### 5. **Updated Farmer Service**
**File:** `backend/services/farmer.js`
- Modified `createDiagnosis()` function:
  - Now looks up the AI model by `name` and `version` from AI result
  - Stores the AI model's UUID in `ai_model_id` field
  - Falls back to NULL if model not found
- Maintains backward compatibility with existing code

## How It Works

### Diagnosis Creation Flow
```
1. AI service returns: { model_name: "Plant Disease Classifier", model_version: "v2.1.0", ... }
2. Farmer service queries AiModel table: 
   WHERE name = "Plant Disease Classifier" AND version = "v2.1.0"
3. Retrieves model ID: "550e8400-e29b-41d4-a716-446655440001"
4. Stores diagnosis with ai_model_id: "550e8400-e29b-41d4-a716-446655440001"
```

## Running the Migration

```bash
# Apply migration
npm run migrate

# Seed AI models (if not already seeded)
npm run seed

# Rollback (if needed)
npm run migrate:undo
```

## Benefits

1. **Better Data Integrity**: Foreign key ensures diagnoses always reference valid AI models
2. **Performance**: Can JOIN with ai_models table for model details without string parsing
3. **Extensibility**: Easy to add model metadata (accuracy, version history, etc.)
4. **Analytics**: Simplified querying of diagnoses by AI model type
5. **Auditability**: Clear relationship between diagnosis and the exact model version used

## Database Query Examples

### Get diagnoses by model type
```sql
SELECT d.* FROM diagnoses d
JOIN ai_models m ON d.ai_model_id = m.id
WHERE m.type = 'DISEASE_DETECTION'
ORDER BY d.created_at DESC;
```

### Get model statistics
```sql
SELECT m.name, m.version, COUNT(d.id) as diagnosis_count
FROM ai_models m
LEFT JOIN diagnoses d ON m.id = d.ai_model_id
GROUP BY m.id, m.name, m.version;
```

## Backward Compatibility Notes

- **API responses** still include full AI metadata in `ai_metadata` field for backward compatibility
- **Model name/version** information is preserved in ai_metadata, so frontend doesn't need changes
- **Frontend can optionally** use `ai_model_id` to fetch full model details via new endpoint

## Next Steps (Optional)

1. Create GET `/api/ai-models` endpoint to fetch list of available AI models
2. Add association/include in queries: `Diagnoses.findAll({ include: ['AiModel'] })`
3. Add model details to diagnosis API responses via eager loading
4. Update frontend to display AI model details from the lookup table

---

**Date:** April 20, 2026
**Status:** Ready for deployment
