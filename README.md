# Elvan Kananam | எல்வன் கணனம்

A professional, multi-company billing application built with React + Vite.

## Features

- 🌐 **Multi-language Support** - Tamil (தமிழ்) and English
- 🌙 **Dark/Light/Auto Theme** - Follows system preference or manual selection
- 📱 **Mobile-First Design** - Touch-friendly, responsive UI
- 🖨️ **Print-Ready Bills** - A4-sized professional invoices
- 📝 **Autocomplete** - Quick selection for customers and items
- 🔢 **Tamil Number Words** - Automatic conversion of amounts to Tamil words

## Tech Stack

- React 19
- Vite 7
- CSS3 with CSS Variables
- Mobile-first responsive design

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/          # React components
│   ├── BillEditor/     # Bill entry form
│   ├── BillPreview/    # Print preview
│   └── common/         # Shared components (Icons, Autocomplete)
├── config/             # Configuration files
│   ├── companies/      # Company-specific configs
│   ├── defaults.js     # Default items & customers
│   └── translations.js # Language strings
├── styles/             # CSS modules
│   ├── base.css        # Design tokens, themes
│   ├── mobile.css      # Mobile-first styles
│   ├── desktop.css     # Desktop enhancements
│   └── print.css       # Print layout
└── utils/              # Utility functions
    ├── calculations.js # Bill calculations
    └── tamilNumbers.js # Number to Tamil words
```

## Default Data

### Items
- ஒண்டி தடை செய்ய கூலி
- ஜரி தடை செய்ய கூலி
- மூன்று இழை சப்புரி செய்ய கூலி

### Customers
- சுந்தரி சில்க்ஸ் இந்தியா - திருச்சேறை, கும்பகோனம்
- சுந்தரி சில்க்ஸ் இந்தியா - முல்லிப்படடு

## License

MIT
