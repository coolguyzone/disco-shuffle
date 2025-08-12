# 📊 Sentry Setup Guide for Disco Shuffle

## 🎯 What Sentry Provides

- **Error Monitoring**: Catch and report JavaScript errors in real-time
- **Performance Monitoring**: Track page load times and API performance
- **Session Replays**: See exactly what users were doing when errors occurred
- **User Context**: Track which Discogs users are experiencing issues
- **Custom Events**: Monitor user actions like library fetches and filter updates

## 🚀 Quick Setup

### 1. Create Sentry Account
1. Go to [sentry.io](https://sentry.io)
2. Sign up for a free account
3. Verify your email

### 2. Create Project
1. Click "Create Project"
2. Select **"React"** as your platform
3. Name it "Disco Shuffle" or similar
4. Choose your team/organization

### 3. Get Your DSN
1. In your project, go to **Settings** → **Projects** → **Client Keys (DSN)**
2. Copy the DSN (looks like: `https://abc123@sentry.io/123456`)
3. Keep this tab open for the next step

### 4. Configure Environment Variables
1. In your project root, create `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Edit `.env.local` and add your DSN:
   ```bash
   VITE_SENTRY_DSN=https://your-actual-dsn-here@sentry.io/project-id
   ```

3. **Important**: Add `.env.local` to your `.gitignore` file to keep your DSN private

### 5. Test the Setup
1. Start your dev server: `npm run dev`
2. Open browser console - you should see Sentry initialization
3. Trigger an error to test error reporting

## 🔧 Configuration Options

### Environment Variables
```bash
# Required
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id

# Optional
VITE_APP_VERSION=1.0.0
```

### Sentry Configuration (src/sentry.ts)
- **Error Sampling**: 100% of errors are captured
- **Performance Sampling**: 20% of transactions
- **Session Replays**: 10% of normal sessions, 100% of error sessions
- **Development**: Sentry is disabled in development mode

## 📱 What Gets Tracked

### Automatic Tracking
- JavaScript errors and exceptions
- Network request failures
- Component render errors
- Performance metrics

### Custom Events
- `library_fetch_started`: When user starts fetching a Discogs library
- `library_fetch_success`: Successful library fetch with metadata
- `reshuffle_triggered`: When user reshuffles results
- `filters_updated`: When user changes format filters

### User Context
- Discogs username
- Selected formats
- Queue size preferences
- Error context

## 🎨 Customization

### Modify Error Boundaries
Edit `src/App.tsx` to customize the error fallback UI:

```tsx
<Sentry.ErrorBoundary
  fallback={({ error, componentStack, resetError }) => (
    // Your custom error UI here
  )}
>
```

### Add Custom Tracking
Use the helper functions in `src/sentry.ts`:

```tsx
import { captureCustomEvent, setUserContext } from './sentry';

// Track user action
captureCustomEvent('user_action', { action: 'click_button' });

// Set user context
setUserContext('discogs_username');
```

### Performance Monitoring
Sentry automatically tracks:
- Page load times
- React component render times
- API call durations
- User interactions

## 🚨 Error Handling

### Network Errors
Automatically filtered out to reduce noise:
- Network timeouts
- Failed fetch requests
- Temporary connection issues

### Browser Errors
Common browser errors are ignored:
- ResizeObserver loop limits
- Script errors from extensions

### Custom Error Filtering
Add your own error filtering logic in `src/sentry.ts`:

```tsx
beforeSend(event, hint) {
  // Your custom filtering logic
  if (event.message?.includes('specific_error')) {
    return null; // Don't send this error
  }
  return event;
}
```

## 📊 Monitoring Dashboard

### Key Metrics to Watch
1. **Error Rate**: Percentage of sessions with errors
2. **Performance**: Page load and API response times
3. **User Impact**: How many users are affected by issues
4. **Session Replays**: Watch users reproduce errors

### Alerts
Set up alerts for:
- Error rate spikes
- Performance degradation
- High-impact errors

## 🔒 Privacy & Security

### Data Collected
- Error stack traces
- Performance metrics
- User interactions (session replays)
- Custom event data

### Data NOT Collected
- Personal information
- Discogs API keys
- User passwords
- Sensitive content

### GDPR Compliance
- Users can opt out via browser settings
- Data retention policies configurable
- Right to be forgotten supported

## 🚀 Production Deployment

### GitHub Pages
1. Set environment variables in your deployment
2. Sentry will automatically detect production builds
3. Monitor your live app's health

### Environment Detection
- **Development**: Sentry disabled, no data sent
- **Production**: Full monitoring enabled
- **Staging**: Can be configured separately

## 🆘 Troubleshooting

### Common Issues

**Sentry not initializing**
- Check your DSN is correct
- Verify environment variables are loaded
- Check browser console for errors

**No data in dashboard**
- Wait 5-10 minutes for data to appear
- Check if you're in development mode
- Verify your project is active

**Performance issues**
- Reduce sampling rates in `src/sentry.ts`
- Check network requests in browser dev tools
- Monitor bundle size impact

### Getting Help
1. Check [Sentry Documentation](https://docs.sentry.io/)
2. Review your project's error logs
3. Check Sentry status page
4. Contact Sentry support

## 🎉 Next Steps

1. **Deploy to production** and monitor real user data
2. **Set up alerts** for critical errors
3. **Customize tracking** for your specific needs
4. **Analyze performance** and optimize bottlenecks
5. **Share insights** with your team

Your Disco Shuffle app now has enterprise-grade monitoring! 🎵✨
