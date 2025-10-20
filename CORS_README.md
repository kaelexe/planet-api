# CORS Configuration

This API uses environment-based CORS configuration for scalability between development and production environments.

## Current Configuration

### Development (Default)
- **CORS_ORIGINS**: `*` (allows all origins)
- **CORS_CREDENTIALS**: `false` (credentials not allowed)

### Production Configuration

To configure CORS for production, update your `.env` file:

```env
# Allow specific frontend origins (replace with your actual frontend URLs)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,http://localhost:3000

# Enable credentials if your frontend needs to send cookies or authorization headers
CORS_CREDENTIALS=true
```

## Configuration Options

### CORS_ORIGINS
- Use `*` for development (allows all origins)
- Use comma-separated URLs for production (e.g., `https://example.com,https://app.example.com`)
- Supports HTTP and HTTPS protocols

### CORS_CREDENTIALS
- Set to `true` if your frontend needs to send:
  - Cookies
  - Authorization headers
  - Client certificates
- Set to `false` for simple requests without credentials

## Example Production Setup

```env
# Production environment
NODE_ENV=production
CORS_ORIGINS=https://myapp.com,https://www.myapp.com,https://admin.myapp.com
CORS_CREDENTIALS=true
```

## Security Considerations

1. **Never use `*` in production** - Always specify exact origins
2. **Use HTTPS in production** - Never allow HTTP origins in production
3. **Enable credentials only when necessary** - This can expose your API to CSRF attacks if not properly configured
4. **Keep origin list updated** - Remove old/staging URLs when they're no longer needed

## Testing CORS

You can test your CORS configuration using curl:

```bash
# Test preflight request
curl -X OPTIONS \
  -H "Origin: https://yourdomain.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  http://localhost:3000/api/tasks

# Test actual request
curl -X GET \
  -H "Origin: https://yourdomain.com" \
  http://localhost:3000/api/tasks