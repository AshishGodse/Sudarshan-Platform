# Sudarshan Platform - API Documentation

## Base URL
```
Local: http://localhost:3000/api
Production: https://your-domain.com/api
```

---

## Endpoints

### 1. Get All Channels
Retrieve a list of all configured temple channels.

**Request**
```http
GET /api/channels
```

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": "ch_1234567890_abc",
      "name": "Siddhivinayak Mumbai",
      "channelId": "ShreeSiddhivinayakTrust",
      "description": "Live Darshan from Siddhivinayak Temple",
      "icon": "",
      "createdAt": "2026-03-17T10:30:00.000Z",
      "updatedAt": "2026-03-17T10:30:00.000Z"
    }
  ]
}
```

**Status Codes**
- `200`: Success
- `500`: Server error

---

### 2. Create New Channel
Add a new temple channel to the platform.

**Request**
```http
POST /api/channels
Content-Type: application/json

{
  "name": "Siddhivinayak Mumbai",
  "channelId": "ShreeSiddhivinayakTrust",
  "description": "Live Darshan from Siddhivinayak Temple",
  "icon": "" // Optional
}
```

**Parameters**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| name | string | Yes | Temple/channel name |
| channelId | string | Yes | YouTube channel ID |
| description | string | No | Channel description |
| icon | string | No | Icon URL |

**Response**
```json
{
  "success": true,
  "data": {
    "id": "ch_1234567890_abc",
    "name": "Siddhivinayak Mumbai",
    "channelId": "ShreeSiddhivinayakTrust",
    "description": "Live Darshan from Siddhivinayak Temple",
    "icon": "",
    "createdAt": "2026-03-17T10:30:00.000Z",
    "updatedAt": "2026-03-17T10:30:00.000Z"
  }
}
```

**Status Codes**
- `201`: Created successfully
- `400`: Missing required fields
- `500`: Server error

**Example**
```bash
curl -X POST http://localhost:3000/api/channels \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Siddhivinayak Mumbai",
    "channelId": "ShreeSiddhivinayakTrust",
    "description": "Temple in Mumbai"
  }'
```

---

### 3. Get Single Channel
Retrieve details of a specific channel.

**Request**
```http
GET /api/channels/:id
```

**Parameters**
| Name | Type | Location | Required | Description |
|------|------|----------|----------|-------------|
| id | string | Path | Yes | Channel ID |

**Response**
```json
{
  "success": true,
  "data": {
    "id": "ch_1234567890_abc",
    "name": "Siddhivinayak Mumbai",
    "channelId": "ShreeSiddhivinayakTrust",
    "description": "Live Darshan from Siddhivinayak Temple",
    "icon": "",
    "createdAt": "2026-03-17T10:30:00.000Z",
    "updatedAt": "2026-03-17T10:30:00.000Z"
  }
}
```

**Status Codes**
- `200`: Success
- `404`: Channel not found
- `500`: Server error

**Example**
```bash
curl http://localhost:3000/api/channels/ch_1234567890_abc
```

---

### 4. Update Channel
Modify an existing channel's information.

**Request**
```http
PUT /api/channels/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Parameters**
| Name | Type | Location | Required | Description |
|------|------|----------|----------|-------------|
| id | string | Path | Yes | Channel ID |

**Body** (all fields optional)
| Name | Type | Description |
|------|------|-------------|
| name | string | Channel name |
| channelId | string | YouTube channel ID |
| description | string | Channel description |
| icon | string | Icon URL |

**Response**
```json
{
  "success": true,
  "data": {
    "id": "ch_1234567890_abc",
    "name": "Updated Name",
    "channelId": "ShreeSiddhivinayakTrust",
    "description": "Updated description",
    "icon": "",
    "createdAt": "2026-03-17T10:30:00.000Z",
    "updatedAt": "2026-03-17T10:35:00.000Z"
  }
}
```

**Status Codes**
- `200`: Updated successfully
- `404`: Channel not found
- `500`: Server error

**Example**
```bash
curl -X PUT http://localhost:3000/api/channels/ch_1234567890_abc \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Temple Name"
  }'
```

---

### 5. Delete Channel
Remove a channel from the platform.

**Request**
```http
DELETE /api/channels/:id
```

**Parameters**
| Name | Type | Location | Required | Description |
|------|------|----------|----------|-------------|
| id | string | Path | Yes | Channel ID |

**Response**
```json
{
  "success": true,
  "message": "Channel deleted"
}
```

**Status Codes**
- `200`: Deleted successfully
- `404`: Channel not found
- `500`: Server error

**Example**
```bash
curl -X DELETE http://localhost:3000/api/channels/ch_1234567890_abc
```

---

### 6. Get Live Stream for Channel
Fetch the current live stream or latest video from a specific channel.

**Request**
```http
GET /api/channels/:id/live
```

**Parameters**
| Name | Type | Location | Required | Description |
|------|------|----------|----------|-------------|
| id | string | Path | Yes | Channel ID |

**Response (Live Stream Found)**
```json
{
  "success": true,
  "data": {
    "videoId": "tSDZWHsHAA4",
    "title": "Shree Siddhivinayak Live Darshan",
    "description": "Live Darshan from Shree Siddhivinayak Temple",
    "thumbnail": "https://i.ytimg.com/vi/...",
    "channelName": "Shree Siddhivinayak Ganapati Temple Trust",
    "isLive": true,
    "publishedAt": "2026-03-17T10:00:00.000Z",
    "stats": {
      "viewCount": "1250",
      "likeCount": "45",
      "commentCount": "12"
    }
  }
}
```

**Response (No Stream Found)**
```json
{
  "success": false,
  "error": "No live stream found for this channel"
}
```

**Status Codes**
- `200`: Live stream found
- `404`: No stream found (channel might not exist or have no videos)
- `500`: Server error

**Notes**
- Returns **live stream** if available
- Falls back to **latest video** if no live stream
- Requires YouTube API key configured
- Video can be embedded using `videoId`

**Example**
```bash
curl http://localhost:3000/api/channels/ch_1234567890_abc/live
```

**Embed in HTML**
```html
<iframe 
  width="560" 
  height="315" 
  src="https://www.youtube.com/embed/tSDZWHsHAA4"
  frameborder="0"
  allowfullscreen>
</iframe>
```

---

## Common API Workflows

### Workflow 1: Add and Fetch a Channel
```bash
# 1. Add channel
CHANNEL_ID=$(curl -X POST http://localhost:3000/api/channels \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Temple",
    "channelId": "YouTubeChannelName"
  }' | jq -r '.data.id')

# 2. Get live stream
curl http://localhost:3000/api/channels/$CHANNEL_ID/live | jq .data.videoId
```

### Workflow 2: Update Channel
```bash
curl -X PUT http://localhost:3000/api/channels/ch_1234567890_abc \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Temple Name",
    "description": "New description"
  }'
```

### Workflow 3: List All and Get Live
```bash
# Get all channels
CHANNELS=$(curl http://localhost:3000/api/channels | jq '.data[].id')

# Get live stream for each
for CHANNEL_ID in $CHANNELS; do
  curl "http://localhost:3000/api/channels/$CHANNEL_ID/live"
done
```

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

### Common Errors

| Error | Status | Cause | Solution |
|-------|--------|-------|----------|
| Channel not found | 404 | Invalid channel ID | Check channel ID |
| Missing required fields | 400 | Incomplete data | Provide all required fields |
| YouTube API Key not configured | 500 | API key missing | Add to .env.local |
| No live stream found | 404 | No current broadcast | Try later or check channel |
| Server error | 500 | Unexpected error | Check server logs |

---

## Rate Limiting

Currently, no rate limiting is implemented. For production use, consider:
- Implement rate limiting middleware
- Cache YouTube API responses
- Add API keys for authentication

---

## Data Types

### Channel Object
```typescript
{
  id: string;              // Unique identifier
  name: string;            // Display name
  channelId: string;       // YouTube channel ID
  description: string;     // Channel description
  icon?: string;           // Icon URL
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

### Live Stream Object
```typescript
{
  videoId: string;         // YouTube video ID
  title: string;           // Video title
  description: string;     // Video description
  thumbnail: string;       // Thumbnail URL
  channelName: string;     // Channel name
  isLive: boolean;         // True if currently broadcasting
  publishedAt: string;     // ISO 8601 timestamp
  stats?: {                // Optional YouTube statistics
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
  }
}
```

---

## Testing the API

### Using curl
```bash
# Get all channels
curl http://localhost:3000/api/channels

# Add channel
curl -X POST http://localhost:3000/api/channels \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","channelId":"TestChannel"}'
```

### Using JavaScript/Node.js
```javascript
// Get all channels
const channels = await fetch('/api/channels').then(r => r.json());

// Add channel
const newChannel = await fetch('/api/channels', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Temple Name',
    channelId: 'YouTubeChannelId'
  })
}).then(r => r.json());
```

### Using Python
```python
import requests

# Get all channels
response = requests.get('http://localhost:3000/api/channels')
channels = response.json()

# Add channel
response = requests.post('http://localhost:3000/api/channels', json={
    'name': 'Temple Name',
    'channelId': 'YouTubeChannelId'
})
new_channel = response.json()
```

---

## API Versioning

Current version: **v1** (implicit)

Future versions will be prefixed: `/api/v2/channels`

---

For more information, see [SETUP_GUIDE.md](./SETUP_GUIDE.md) and [README.md](./README.md).

🙏 Happy coding!
