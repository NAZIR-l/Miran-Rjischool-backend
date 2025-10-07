# Favorite Traffic Signals API

This module provides endpoints to manage favorite traffic signals for authenticated users.

## API Endpoints

### Base URL
```
/favorite-traffic-signals
```

All endpoints require JWT authentication (Bearer token).

### 1. Add to Favorites
**POST** `/favorite-traffic-signals`

Add a traffic signal to user's favorites.

**Request Body:**
```json
{
  "signalId": "signal-123",
  "signalName": "Stop Sign",
  "signalType": "Prohibitory",
  "signalImageUrl": "https://example.com/images/stop-sign.png"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "userId": "user-uuid",
  "signalId": "signal-123",
  "signalName": "Stop Sign",
  "signalType": "Prohibitory",
  "signalImageUrl": "https://example.com/images/stop-sign.png",
  "createdAt": "2025-10-07T12:00:00.000Z"
}
```

### 2. Get All Favorites
**GET** `/favorite-traffic-signals`

Get all favorite traffic signals for the authenticated user.

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "userId": "user-uuid",
    "signalId": "signal-123",
    "signalName": "Stop Sign",
    "signalType": "Prohibitory",
    "signalImageUrl": "https://example.com/images/stop-sign.png",
    "createdAt": "2025-10-07T12:00:00.000Z"
  }
]
```

### 3. Get Favorites Count
**GET** `/favorite-traffic-signals/count`

Get the total number of favorites for the authenticated user.

**Response:** `200 OK`
```json
5
```

### 4. Check if Signal is Favorited
**GET** `/favorite-traffic-signals/by-signal/:signalId`

Check if a specific signal is in the user's favorites.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "userId": "user-uuid",
  "signalId": "signal-123",
  "signalName": "Stop Sign",
  "signalType": "Prohibitory",
  "signalImageUrl": "https://example.com/images/stop-sign.png",
  "createdAt": "2025-10-07T12:00:00.000Z"
}
```

Or `404 Not Found` if not in favorites.

### 5. Get Favorite by ID
**GET** `/favorite-traffic-signals/:id`

Get a specific favorite by its ID.

**Response:** `200 OK`

### 6. Update Favorite
**PATCH** `/favorite-traffic-signals/:id`

Update a favorite traffic signal.

**Request Body:**
```json
{
  "signalName": "Updated Name",
  "signalImageUrl": "https://example.com/new-image.png"
}
```

**Response:** `200 OK`

### 7. Remove from Favorites by ID
**DELETE** `/favorite-traffic-signals/:id`

Remove a favorite by its ID.

**Response:** `204 No Content`

### 8. Remove from Favorites by Signal ID
**DELETE** `/favorite-traffic-signals/by-signal/:signalId`

Remove a favorite by the signal ID.

**Response:** `204 No Content`

## Error Responses

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "This traffic signal is already in your favorites",
  "error": "Conflict"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Favorite traffic signal not found",
  "error": "Not Found"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## Database Schema

```sql
CREATE TABLE favorite_traffic_signals (
    id UUID PRIMARY KEY,
    userId UUID NOT NULL,
    signalId VARCHAR(100) NOT NULL,
    signalName VARCHAR(200) NOT NULL,
    signalType VARCHAR(100) NOT NULL,
    signalImageUrl VARCHAR(500),
    createdAt TIMESTAMP NOT NULL,
    UNIQUE(userId, signalId)
);
```

## Usage Example

See the frontend integration examples in the portal directory.

