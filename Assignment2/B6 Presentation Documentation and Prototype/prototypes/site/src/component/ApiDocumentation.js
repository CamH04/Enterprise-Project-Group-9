import React from 'react';

const ApiDocumentation = () => {
  return (
    <div>
      <h1>API Documentation</h1>

      <h2>/register POST</h2>
      <p><strong>Description:</strong> Register a new user by providing a username and password. The password is hashed before storing.</p>
      <h3>Request Body:</h3>
      <pre>
        {`{
  "username": "string",
  "password": "string"
}`}
      </pre>
      <h3>Responses:</h3>
      <p><strong>201 Created:</strong></p>
      <pre>{`{ "message": "User registered successfully" }`}</pre>
      <p><strong>500 Internal Server Error:</strong></p>
      <pre>{`{ "error": "Hashing error" }`}</pre>

      <h2>/login POST</h2>
      <p><strong>Description:</strong> Log in a user by verifying their username and password. Returns a JWT token if successful.</p>
      <h3>Request Body:</h3>
      <pre>
        {`{
  "username": "string",
  "password": "string"
}`}
      </pre>
      <h3>Responses:</h3>
      <p><strong>200 OK:</strong></p>
      <pre>{`{ "token": "<JWT_TOKEN>" }`}</pre>
      <p><strong>400 Bad Request:</strong></p>
      <pre>{`{ "error": "Invalid username or password" }`}</pre>

      <h2>/profile GET</h2>
      <p><strong>Description:</strong> Get the profile information of the logged-in user. Requires a valid JWT token.</p>
      <h3>Headers:</h3>
      <pre>
        {`{
  "Authorization": "Bearer <JWT_TOKEN>"
}`}
      </pre>
      <h3>Responses:</h3>
      <p><strong>200 OK:</strong></p>
      <pre>{`{
  "message": "Welcome to your profile!",
  "user": {
    "id": 1,
    "username": "example"
  }
}`}</pre>
      <p><strong>401 Unauthorized:</strong></p>
      <pre>{`{ "error": "Token required" }`}</pre>
      <p><strong>403 Forbidden:</strong></p>
      <pre>{`{ "error": "Invalid or expired token" }`}</pre>

      <h2>/userMoods GET</h2>
      <p><strong>Description:</strong> Get the mood entries for the logged-in user. Requires a valid JWT token.</p>
      <h3>Headers:</h3>
      <pre>
        {`{
  "Authorization": "Bearer <JWT_TOKEN>"
}`}
      </pre>
      <h3>Responses:</h3>
      <p><strong>200 OK:</strong></p>
      <pre>{`{
  "moods": [
    {
      "id": 1,
      "mood": "Happy",
      "keywords": "joy",
      "notes": "Feeling great!",
      "visible_to_gps": true
    }
  ]
}`}</pre>
      <p><strong>401 Unauthorized:</strong></p>
      <pre>{`{ "error": "Token required" }`}</pre>
      <p><strong>403 Forbidden:</strong></p>
      <pre>{`{ "error": "Invalid or expired token" }`}</pre>

      <h2>/saveMood POST</h2>
      <p><strong>Description:</strong> Save a new mood entry for the logged-in user. Requires a valid JWT token.</p>
      <h3>Request Body:</h3>
      <pre>
        {`{
  "mood": "string",
  "keywords": "string",
  "notes": "string"
}`}
      </pre>
      <h3>Headers:</h3>
      <pre>
        {`{
  "Authorization": "Bearer <JWT_TOKEN>"
}`}
      </pre>
      <h3>Responses:</h3>
      <p><strong>201 Created:</strong></p>
      <pre>{`{ "message": "Mood saved successfully" }`}</pre>
      <p><strong>401 Unauthorized:</strong></p>
      <pre>{`{ "error": "Token required" }`}</pre>
      <p><strong>403 Forbidden:</strong></p>
      <pre>{`{ "error": "Invalid token" }`}</pre>

      <h2>/recommendedArticles GET</h2>
      <p><strong>Description:</strong> Get a list of articles that match the provided keywords.</p>
      <h3>Request Query Parameters:</h3>
      <pre>
        {`{
  "keywords": "string"  // Comma-separated list of keywords
}`}
      </pre>
      <h3>Responses:</h3>
      <p><strong>200 OK:</strong></p>
      <pre>{`{
  "recommendedArticles": [
    {
      "title": "Article 1",
      "content": "This is the article content..."
    }
  ]
}`}</pre>
      <p><strong>400 Bad Request:</strong></p>
      <pre>{`{ "error": "No keywords provided" }`}</pre>
      <p><strong>500 Internal Server Error:</strong></p>
      <pre>{`{ "error": "Failed to read articles directory" }`}</pre>

      <h2>/reset-password POST</h2>
      <p><strong>Description:</strong> Reset the password for a user by providing the username and new password.</p>
      <h3>Request Body:</h3>
      <pre>
        {`{
  "username": "string",
  "password": "string"
}`}
      </pre>
      <h3>Responses:</h3>
      <p><strong>200 OK:</strong></p>
      <pre>{`{ "message": "Password reset successfully" }`}</pre>
      <p><strong>404 Not Found:</strong></p>
      <pre>{`{ "error": "User not found" }`}</pre>
      <p><strong>500 Internal Server Error:</strong></p>
      <pre>{`{ "error": "Error hashing password" }`}</pre>

      <h2>/saveWRAP POST</h2>
      <p><strong>Description:</strong> Save WRAP data for the logged-in user. Requires a valid JWT token.</p>
      <h3>Request Body:</h3>
      <pre>
        {`{
  "wellnessTools": "string",
  "triggers": "string",
  "earlyWarningSigns": "string",
  "whenThingsBreakDown": "string",
  "crisisPlan": "string"
}`}
      </pre>
      <h3>Headers:</h3>
      <pre>
        {`{
  "Authorization": "Bearer <JWT_TOKEN>"
}`}
      </pre>
    </div>
  );
};

export default ApiDocumentation;
