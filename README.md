# IP-Based Rate Limiter Middleware

A demonstration project showing how to implement IP-based rate limiting in Node.js/Express using Redis. This middleware protects your API endpoints from abuse by limiting the number of requests from a single IP address within a time window.

## Features

- 🚦 **IP-based rate limiting** - Tracks requests per IP address
- ⚡ **Redis storage** - Fast, in-memory rate limit tracking
- 🔧 **Configurable limits** - Customize window duration and max requests
- 🛡️ **Fail-open design** - Continues serving requests if Redis fails
- 🔒 **TypeScript** - Type-safe implementation
- 📊 **Simple demo API** - Working example with user endpoint

## How It Works

The rate limiter middleware:
1. Captures the client's IP address from incoming requests
2. Uses Redis to track request counts per IP
3. Sets a time window (default: 60 seconds)
4. Allows a maximum number of requests within that window (default: 3)
5. Returns 429 (Too Many Requests) when limit is exceeded
6. Automatically resets the counter after the time window expires

## Prerequisites

- Node.js (v14 or higher)
- Redis server
- Basic knowledge of Express.js middleware

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rate-limiter-middleware.git
cd rate-limiter-middleware
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
REDIS_HOST=localhost
REDIS_PORT=6379
WINDOW_SECONDS=60
MAX_REQUESTS=3
```

4. Start Redis server:
```bash
# Using Docker
docker run -d -p 6379:6379 redis

# Or using Redis CLI
redis-server
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

The server will start on port 8000.

## API Endpoints

### Get Users (Rate Limited)
Returns a list of demo users. This endpoint is protected by rate limiting.

**Endpoint:** `GET /users`

**Rate Limit:** 3 requests per 60 seconds per IP address

**Success Response (200):**
```json
{
  "users": [
    { "id": 1, "name": "Jack", "age": 67 },
    { "id": 2, "name": "Jude", "age": 55 },
    { "id": 3, "name": "Julia", "age": 45 }
  ]
}
```

**Rate Limit Exceeded (429):**
```json
{
  "message": "Too many requests. Please try again later.",
  "retryAfter": "60 Seconds"
}
```

### Testing the Rate Limiter

Make multiple requests to see the rate limiter in action:

```bash
# First request - should succeed
curl http://localhost:8000/users

# Second request - should succeed
curl http://localhost:8000/users

# Third request - should succeed
curl http://localhost:8000/users

# Fourth request - should be rate limited (429)
curl http://localhost:8000/users
```

## Project Structure

```
rate-limiter-middleware/
├── controllers/
│   └── userController.ts         # Demo controller
├── middleware/
│   └── rate-limiter.ts           # Rate limiting middleware
├── routes/
│   └── api.ts                    # Route definitions
├── services/
│   └── userService.ts            # Demo service
├── .env                          # Environment variables
├── server.ts                     # Express server setup
├── package.json
└── tsconfig.json
```

## Configuration

Configure the rate limiter using environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_HOST` | Redis server hostname | `localhost` |
| `REDIS_PORT` | Redis server port | `6379` |
| `WINDOW_SECONDS` | Time window in seconds | `60` |
| `MAX_REQUESTS` | Maximum requests per window | `3` |

## Implementation Details

### Rate Limiter Middleware

The middleware uses a simple counter algorithm:

```typescript
const key = `rate_limit:${req.ip}`;  // Unique key per IP

// First request in window
if (!current) {
  await redis.setex(key, WINDOW_SECONDS, '1');
  return next();
}

// Check if limit exceeded
if (requestCount >= MAX_REQUESTS) {
  return res.status(429).json({ 
    message: 'Too many requests. Please try again later.'
  });
}

// Increment counter
await redis.incr(key);
```

### Key Features

1. **Automatic Expiration**: Redis automatically deletes keys after the time window
2. **Atomic Operations**: Uses Redis `INCR` for thread-safe counting
3. **Per-IP Tracking**: Each IP address has its own counter
4. **Fail-Open**: If Redis is unavailable, requests are allowed (commented out by default)

## Applying to Your Own Routes

To add rate limiting to your routes:

```typescript
import rateCheck from './middleware/rate-limiter';

// Apply to specific routes
router.get('/api/data', rateCheck, yourController);
router.post('/api/submit', rateCheck, yourController);

// Or apply to all routes
router.use(rateCheck);

```

## Advanced Features to Add

This is a basic implementation. We can consider adding:

- **Sliding Window** - More accurate rate limiting
- **Distributed Rate Limiting** - For multiple servers
- **Per-User Limits** - Different limits for authenticated users
- **Rate Limit Headers** - `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **Whitelist/Blacklist** - Exempt or block specific IPs
- **Multiple Time Windows** - Different limits for different time periods

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Redis** - In-memory data store
- **ioredis** - Redis client for Node.js

## Common Issues

### Rate limiter not working in development

If testing locally, all requests may come from `::1` or `127.0.0.1`. Consider using a tool like Postman or curl from different machines to test properly.

### Redis connection refused

Make sure Redis is running:
```bash
redis-cli ping
# Should return: PONG
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Resources

- [Redis Documentation](https://redis.io/documentation)
- [Express.js Middleware Guide](https://expressjs.com/en/guide/using-middleware.html)
- [Rate Limiting Strategies](https://www.cloudflare.com/learning/bots/what-is-rate-limiting/)

## Support

For issues or questions, please open an issue on GitHub.