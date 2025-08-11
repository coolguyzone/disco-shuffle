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

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
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

## 📱 Browser Support

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
