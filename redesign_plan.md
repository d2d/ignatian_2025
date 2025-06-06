# Ignatian Pilgrimage Site - Premium Redesign Plan

## Vision
Create a premium, visually stunning pilgrimage experience that adapts elegantly between mobile and desktop platforms.

## Mobile Design (≤768px)
### Layout
- **Single-page vertical scroll**: All locations on one continuous page
- **Full-screen sections**: Each location gets viewport-height treatment
- **Sticky header**: Minimal, elegant progress indicator
- **Smooth scroll**: Butter-smooth transitions between sections
- **Touch gestures**: Swipe support for galleries

### Navigation
- **Progress bar**: Thin, elegant progress indicator at top
- **Jump menu**: Hamburger menu with quick links to each location
- **Section indicators**: Dots or minimal timeline on the side
- **Scroll spy**: Active section highlighting

### Visual Treatment
- **Hero images**: Full-width hero for each location
- **Parallax effects**: Subtle depth on scroll
- **Fade-in animations**: Content reveals as you scroll
- **Premium typography**: Large, readable, elegant fonts

## Desktop Design (>768px)
### Layout
- **Split view retained**: Map (60%) + Content (40%)
- **Floating navigation**: Elegant sidebar or bottom dock
- **Full-height sections**: No cramped headers
- **Smooth transitions**: GSAP or CSS animations between locations

### Navigation Options
1. **Sidebar Timeline**: Vertical timeline with dates and locations
2. **Bottom Dock**: macOS-style dock with location icons
3. **Floating Cards**: Hovering location cards that expand on hover

### Map Enhancements
- **Interactive markers**: Hover effects, tooltips
- **Path animation**: Subtle route animation
- **Zoom transitions**: Smooth zoom to location on select
- **Dark mode**: Elegant dark theme option

## Technical Implementation
### Core Technologies
- **CSS Grid/Flexbox**: Modern layout techniques
- **CSS Custom Properties**: Dynamic theming
- **Intersection Observer**: Scroll-based animations
- **Smooth Scroll API**: Native smooth scrolling
- **Touch/Swipe Library**: For mobile gestures

### Performance
- **Lazy loading**: Images load as needed
- **Optimized animations**: GPU-accelerated transforms
- **Responsive images**: Multiple sizes for different screens
- **Minimal JavaScript**: CSS-first approach

## Visual Design System
### Colors
- **Primary**: Deep Ignatian blue (#1a237e)
- **Accent**: Warm gold (#d4af37)
- **Neutrals**: Sophisticated grays
- **Backgrounds**: Subtle gradients and textures

### Typography
- **Headers**: Elegant serif (Playfair Display or similar)
- **Body**: Clean sans-serif (Inter or similar)
- **Dates**: Monospace accent font

### Spacing
- **Golden ratio**: 1.618 for proportions
- **Generous whitespace**: Premium feel
- **Consistent rhythm**: 8px grid system

## Key Features
1. **Loading experience**: Beautiful splash to set the tone
2. **Transitions**: Seamless location changes
3. **Microinteractions**: Subtle hover/touch feedback
4. **Accessibility**: ARIA labels, keyboard navigation
5. **Performance**: 90+ Lighthouse score

## Implementation Order
1. Create new HTML structure
2. Build mobile-first CSS
3. Add desktop enhancements
4. Implement smooth scrolling
5. Add animations and transitions
6. Test and optimize
