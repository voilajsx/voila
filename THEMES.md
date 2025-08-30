# 🎨 Voila Framework - Theme Configuration

**Easy theme switching via environment variables - no code changes needed!**

## 🚀 Quick Theme Change

Just update your `.env` file and restart the server:

```bash
# Edit .env file
VITE_THEME=aurora        # Changes entire color scheme
VITE_MODE=dark           # Switches to dark mode
VITE_SIZE=xl             # Makes layout larger
VITE_TONE=brand          # More colorful/branded appearance
```

## 🎨 Available Themes

| Theme | Description | Best For |
|-------|-------------|----------|
| `default` | Professional blue | Business applications |
| `aurora` | Purple/green gradient | Creative applications |
| `metro` | Transit blue | Admin dashboards |
| `neon` | Electric colors | Gaming/tech applications |
| `ruby` | Red/gold luxury | Premium/luxury brands |
| `studio` | Designer grays | Creative tools/studios |

## 🌙 Available Modes

| Mode | Description |
|------|-------------|
| `light` | Light backgrounds, dark text |
| `dark` | Dark backgrounds, light text |

## 📐 Available Sizes

| Size | Sidebar Width | Content Max Width | Padding |
|------|---------------|-------------------|---------|
| `sm` | 192px | max-w-2xl | 16px |
| `md` | 224px | max-w-4xl | 20px |
| `lg` | 256px | max-w-6xl | 24px (default) |
| `xl` | 288px | max-w-7xl | 28px |
| `full` | 320px | max-w-full | 32px |

## 🎯 Available Tones

| Tone | Description | Best For |
|------|-------------|----------|
| `clean` | Pure white/light backgrounds | Websites, auth pages |
| `subtle` | Light gray backgrounds | Admin panels, professional apps |
| `brand` | Primary colored backgrounds | Headers, CTAs, emphasis areas |
| `contrast` | Dark/bold backgrounds | Footers, high contrast sections |

## 💡 Examples

### Professional Business App
```bash
VITE_THEME=default
VITE_MODE=light
VITE_SIZE=lg
VITE_TONE=subtle
```

### Creative Studio
```bash
VITE_THEME=aurora
VITE_MODE=dark
VITE_SIZE=xl
VITE_TONE=brand
```

### Gaming Dashboard
```bash
VITE_THEME=neon
VITE_MODE=dark
VITE_SIZE=full
VITE_TONE=contrast
```

### Clean Website
```bash
VITE_THEME=studio
VITE_MODE=light
VITE_SIZE=xl
VITE_TONE=clean
```

## 🔧 How It Works

1. **Environment Variables**: Vite exposes `VITE_*` variables to the frontend
2. **Theme Config**: `src/lib/theme-config.ts` reads these variables
3. **ThemeProvider**: Wraps the entire app with the configured theme
4. **Semantic Colors**: All components use `bg-background`, `text-foreground`, etc.
5. **Auto-switching**: Theme changes apply to all UI components instantly

## ⚡ Quick Commands

```bash
# Try different themes quickly
echo "VITE_THEME=aurora" >> .env && npm run dev:web
echo "VITE_THEME=neon" >> .env && npm run dev:web  
echo "VITE_MODE=dark" >> .env && npm run dev:web
```

## ✅ Benefits

- **No Code Changes**: Just update `.env` file
- **Instant Switching**: Restart server to see changes
- **Production Ready**: Environment variables work in all deployment scenarios
- **Team Friendly**: Each developer can have their preferred theme locally
- **Client Customization**: Easy to create client-specific themes

**Change your theme in seconds, not hours!** 🚀