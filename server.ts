import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { initialProperties } from './src/data/mockProperties';
import { Property } from './src/types';

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'properties.json');

// Ensure data directory and properties database exist
function getPropertiesFromDb(): Property[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialProperties, null, 2), 'utf-8');
      return initialProperties;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    if (!content.trim()) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialProperties, null, 2), 'utf-8');
      return initialProperties;
    }
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    // If empty array, reseed with initial authentic listings
    fs.writeFileSync(DB_FILE, JSON.stringify(initialProperties, null, 2), 'utf-8');
    return initialProperties;
  } catch (err) {
    console.error('[Server DB] Error reading properties.json:', err);
    return initialProperties;
  }
}

function savePropertiesToDb(properties: Property[]): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    // Atomic write via temp file
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(properties, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
    return true;
  } catch (err) {
    console.error('[Server DB] Error saving properties.json:', err);
    return false;
  }
}

async function startServer() {
  const app = express();

  // Parse JSON payloads up to 25MB (to support high-res photos & data)
  app.use(express.json({ limit: '25mb' }));

  // Request logger for API calls
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // ==========================================
  // REST API ENDPOINTS FOR PROPERTY LISTINGS
  // ==========================================

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    const list = getPropertiesFromDb();
    res.json({ 
      status: 'ok', 
      propertiesCount: list.length, 
      timestamp: new Date().toISOString() 
    });
  });

  // 1. GET /api/properties - Fetch all listed properties
  // Ensures every app user and website visitor sees all listed properties instantly
  app.get('/api/properties', (req, res) => {
    try {
      const list = getPropertiesFromDb();
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve properties', message: err.message });
    }
  });

  // 2. POST /api/properties - Create/Post new property
  // Directly used by Owner, Verified Agent, 100 Builders, and Registered Broker
  app.post('/api/properties', (req, res) => {
    try {
      const newProp = req.body as Property;
      if (!newProp || (!newProp.title && !newProp.titleHi)) {
        res.status(400).json({ error: 'Invalid property payload. Title is required.' });
        return;
      }

      // Ensure valid ID and creation timestamp
      if (!newProp.id) {
        newProp.id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      }
      if (!newProp.createdAt) {
        newProp.createdAt = new Date().toISOString().split('T')[0];
      }

      const currentList = getPropertiesFromDb();
      
      // Check if property with same ID already exists
      const existingIdx = currentList.findIndex(p => p.id === newProp.id);
      let updatedList: Property[];
      if (existingIdx >= 0) {
        updatedList = [...currentList];
        updatedList[existingIdx] = newProp;
      } else {
        // Prepend so new listing appears at the very top for everyone
        updatedList = [newProp, ...currentList];
      }

      savePropertiesToDb(updatedList);
      console.log(`[Server] Saved new property "${newProp.title}" listed by ${newProp.listedBy} (ID: ${newProp.id})`);

      res.status(201).json({ success: true, property: newProp });
    } catch (err: any) {
      console.error('[Server] Failed to save property:', err);
      res.status(500).json({ error: 'Failed to save property', message: err.message });
    }
  });

  // 3. PUT /api/properties/:id - Update an existing property
  app.put('/api/properties/:id', (req, res) => {
    try {
      const { id } = req.params;
      const updatedProp = req.body as Property;
      const currentList = getPropertiesFromDb();

      const idx = currentList.findIndex(p => p.id === id);
      if (idx === -1) {
        // If not found, add it
        const newList = [updatedProp, ...currentList];
        savePropertiesToDb(newList);
        res.json({ success: true, property: updatedProp });
        return;
      }

      currentList[idx] = { ...currentList[idx], ...updatedProp };
      savePropertiesToDb(currentList);

      res.json({ success: true, property: currentList[idx] });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update property', message: err.message });
    }
  });

  // 4. DELETE /api/properties/:id - Delete a property permanently
  app.delete('/api/properties/:id', (req, res) => {
    try {
      const { id } = req.params;
      const currentList = getPropertiesFromDb();
      const filtered = currentList.filter(p => p.id !== id);

      savePropertiesToDb(filtered);
      res.json({ success: true, deletedId: id });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete property', message: err.message });
    }
  });

  // 5. POST /api/properties/sync - Two-way sync for offline/local storage recovery
  app.post('/api/properties/sync', (req, res) => {
    try {
      const { clientProperties } = req.body as { clientProperties?: Property[] };
      const currentList = getPropertiesFromDb();

      if (Array.isArray(clientProperties) && clientProperties.length > 0) {
        let hasChanges = false;
        const mergedMap = new Map<string, Property>();
        
        // Populate existing server properties first
        currentList.forEach(p => mergedMap.set(p.id, p));

        // Merge any client property not already on server
        clientProperties.forEach(cp => {
          if (cp && cp.id && !mergedMap.has(cp.id) && !cp.id.startsWith('hb-')) {
            mergedMap.set(cp.id, cp);
            hasChanges = true;
          }
        });

        if (hasChanges) {
          const mergedList = Array.from(mergedMap.values());
          savePropertiesToDb(mergedList);
          res.json({ success: true, properties: mergedList });
          return;
        }
      }

      res.json({ success: true, properties: currentList });
    } catch (err: any) {
      res.status(500).json({ error: 'Sync failed', message: err.message });
    }
  });

  // ==========================================
  // VITE MIDDLEWARE / PRODUCTION STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[100 Builders Realities] Central Property Server running on port ${PORT}`);
  });
}

startServer();
