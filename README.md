# 🎵 Disco Shuffle

A React application that fetches and shuffles albums from your Discogs collection. Discover forgotten gems in your vinyl, CD, and cassette collection with random album suggestions.

## ✨ Features

- **Fetch Your Collection**: Connect to any public Discogs user's collection
- **Smart Format Filtering**: Filter by LP, EP, Cassette, or CD formats
- **7" Vinyl Support**: 7" records are automatically categorized as EPs
- **Flexible Queue Sizes**: Get 1, 10, 25, 50, or all albums
- **Real-time Filter Updates**: Modify filters without making new API calls
- **Beautiful UI**: Modern, responsive design with Tailwind CSS

## 🚀 Live Demo

Visit the live app: [Disco Shuffle on GitHub Pages](https://[your-username].github.io/disco-shuffle/)

## 🛠️ Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/[your-username]/disco-shuffle.git
   cd disco-shuffle
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Sentry (optional)**
   ```bash
   cp env.example .env.local
   # Edit .env.local and add your Sentry DSN
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

## 🌐 GitHub Pages Deployment

### Automatic Deployment (Recommended)

The app is configured with GitHub Actions for automatic deployment:

1. **Push to main branch** - Automatically triggers deployment
2. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: "GitHub Actions"

### Manual Deployment

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

### Repository Settings

Make sure your repository has:
- **Public repository** (required for free GitHub Pages)
- **GitHub Pages enabled** in Settings → Pages
- **Actions enabled** in Settings → Actions

## 🎯 How It Works

1. **Enter a Discogs username** (must be public)
2. **Select format filters** (LP, EP, Cassette, CD)
3. **Choose queue size** (1 to all albums)
4. **Fetch and shuffle** your collection
5. **Update filters** on the results page without new API calls

## 🔧 Technical Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: GitHub Pages + GitHub Actions
- **Monitoring**: Sentry (@sentry/react, @sentry/tracing)

## 📊 Sentry Monitoring

This app includes comprehensive error monitoring and performance tracking:

### **Error Monitoring**
- Automatic error capture and reporting
- User context tracking (Discogs username)
- Custom error boundaries with fallback UI
- Network error filtering and handling

### **Performance Monitoring**
- Page load performance tracking
- API call performance monitoring
- User interaction timing
- Custom performance metrics

### **Session Replays**
- 10% of normal sessions recorded
- 100% of error sessions recorded
- User journey tracking
- Error reproduction context

### **Custom Events**
- Library fetch attempts and successes
- Filter updates and reshuffles
- User format preferences
- Queue size selections

### **Setup**
1. Create a Sentry account at [sentry.io](https://sentry.io)
2. Create a new project for Disco Shuffle
3. Copy your DSN from project settings
4. Add to `.env.local`: `VITE_SENTRY_DSN=your-dsn-here`
5. Deploy and monitor your app's health!

## �� Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Discogs API](https://www.discogs.com/developers/) for music collection data
- [Vite](https://vitejs.dev/) for fast development and building
- [Tailwind CSS](https://tailwindcss.com/) for beautiful styling
