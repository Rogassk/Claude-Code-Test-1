# TaskFlow AI — Landing Page

A modern, responsive landing page for TaskFlow AI, a fictional AI-powered productivity startup.

## Quick Start

Open `index.html` in any browser. No build tools or dependencies required.

```bash
# Option 1: Open directly
open index.html

# Option 2: Use a local server (recommended for development)
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## Project Structure

```
├── index.html    # Main HTML — all sections and content
├── styles.css    # All styles, responsive breakpoints, animations
├── script.js     # Navbar behavior, scroll animations, mobile menu
└── README.md     # This file
```

## Sections

| Section        | Description                                          |
| -------------- | ---------------------------------------------------- |
| Navigation     | Fixed navbar with logo, links, mobile hamburger menu |
| Hero           | Headline, subheadline, CTA buttons, social proof     |
| Logos Bar      | Trusted-by company logos                             |
| Features       | 4 feature cards with icons                           |
| How It Works   | 3-step process with placeholder illustrations        |
| Testimonials   | 3 customer testimonials with star ratings            |
| Pricing        | 3 tiers (Starter, Pro, Enterprise)                   |
| FAQ            | 6 expandable questions using `<details>`             |
| CTA            | Final call-to-action with gradient background        |
| Footer         | Brand info, link columns, social icons               |

## Customization

### Colors

All colors are defined as CSS custom properties in `styles.css` under `:root`. Change the primary palette to rebrand the entire site:

```css
:root {
  --color-primary: #6366F1;       /* Main brand color */
  --color-primary-dark: #4F46E5;  /* Darker variant */
  --color-primary-light: #818CF8; /* Lighter variant */
  --color-primary-50: #EEF2FF;    /* Tinted background */
  --color-primary-100: #E0E7FF;   /* Subtle tint */
  --color-accent: #8B5CF6;        /* Secondary accent */

  --gradient-primary: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%);
}
```

### Typography

The page uses [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts. To swap fonts:

1. Replace the `<link>` tag in `index.html` with your font
2. Update `--font-family` in `styles.css`

### Content

All text content lives in `index.html`. Key areas to customize:

- **Brand name** — Search for "TaskFlow" and replace globally
- **Hero copy** — Edit the `<h1>` and `.hero-subtitle` in the hero section
- **Features** — Each `.feature-card` contains an SVG icon, heading, and description
- **Testimonials** — Update names, titles, companies, and quotes in `.testimonial-card` elements
- **Pricing** — Modify plan names, prices, and feature lists in `.pricing-card` elements
- **FAQ** — Add or remove `<details class="faq-item">` blocks

### Images

All images use [placehold.co](https://placehold.co) placeholder URLs. Replace `src` attributes with your own images:

- **Hero dashboard** — `.hero-image` (recommended: 600x420)
- **How It Works illustrations** — `.step-visual img` (recommended: 360x220)
- **Avatars** — `.avatar` and `.testimonial-avatar` (recommended: 40x40 and 48x48)
- **Company logos** — `.logos-grid img` (recommended: 120x40)

### Adding/Removing Sections

Each section is a self-contained `<section>` block in `index.html` with corresponding styles in `styles.css`. To remove a section, delete both the HTML block and its CSS block. To add a section, follow the same pattern — use the `section-header` structure for consistency.

## Browser Support

- Chrome, Edge, Firefox, Safari (latest 2 versions)
- Responsive from 320px to 2560px+
- Uses CSS custom properties, `backdrop-filter`, `IntersectionObserver`, and `<details>` — all widely supported

## License

This is a fictional demo project. Use it however you like.
