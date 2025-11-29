# FinEdu AZ Design Guidelines

## Design Approach
**System**: Custom design system inspired by modern fintech applications (Revolut, N26) with Material Design principles for data visualization. Focus on trust, clarity, and financial professionalism while maintaining approachability for young users (14-35 age range).

**Core Principles**: Clean data presentation, intuitive financial tracking, gamification elements for savings goals, secure and professional aesthetic that builds trust.

## Typography
- **Primary Font**: Inter (Google Fonts) - modern, highly legible for financial data
- **Headings**: Font weights 600-700, sizes: h1: text-3xl, h2: text-2xl, h3: text-xl
- **Body Text**: Font weight 400, text-base (16px) for optimal readability
- **Financial Numbers**: Font weight 600, tabular numbers for alignment
- **Small Labels**: text-sm font-medium for categories and metadata

## Color Palette (User-Specified)
**Primary Colors**:
- White: #FFFFFF (backgrounds, cards)
- Blue: #2563EB (primary actions, income indicators)
- Light Violet: #A78BFA (secondary elements, savings/goals)

**Supporting Colors**:
- Dark Gray: #1F2937 (text)
- Medium Gray: #6B7280 (secondary text)
- Light Gray: #F3F4F6 (backgrounds, borders)
- Success Green: #10B981 (positive indicators, income)
- Alert Red: #EF4444 (expenses, warnings)
- Warning Amber: #F59E0B (alerts, notifications)

## Layout System
**Spacing Units**: Tailwind units of 2, 4, 6, 8, 12, 16 for consistent rhythm
- Component padding: p-4 to p-6
- Section spacing: py-8 to py-12
- Card spacing: p-6
- Element gaps: gap-4 to gap-6

**Container Widths**:
- Max width: max-w-7xl (main dashboard)
- Card containers: max-w-md to max-w-2xl
- Form containers: max-w-lg

## Component Library

### Navigation
- **Top Bar**: Fixed header, white background, subtle shadow, height h-16
- Logo placement: top-left as specified
- User profile: top-right with avatar circle
- Language switcher: bottom-left fixed position (AZ / EN / RU flags or text buttons)
- Navigation tabs: underline indicator for active state

### Dashboard Cards
- White background with subtle shadow (shadow-sm)
- Rounded corners: rounded-xl
- Padding: p-6
- Border: 1px solid light gray
- Hover state: shadow-md transition
- Header with icon + title combination

### Financial Data Display
- **Income/Expense Cards**: Grid layout (grid-cols-1 md:grid-cols-3)
- Large numbers: text-4xl font-bold with currency symbol
- Positive/negative indicators: green/red color coding
- Small percentage changes: text-sm with up/down arrows
- Monthly comparison badges

### Transaction Table
- Striped rows for readability (alternate light gray background)
- Columns: Date | Category | Amount | Type
- Category with colored dot indicator
- Action buttons (Edit/Delete) appear on row hover
- Responsive: stack on mobile

### Goals Progress
- **Progress Bars**: 
  - Height: h-3, rounded-full
  - Background: light gray
  - Fill: gradient from blue to violet
  - Percentage text: absolute positioned, text-sm font-semibold
- **Goal Cards**: 
  - Compact design with icon, title, target amount
  - Mini progress bar on dashboard (h-2)
  - Full detail on goals page

### Savings Race / Leaderboard
- **Friend Cards**: Avatar + username + goal name + percentage
- Rank badges: circular with gradient background
- Privacy-focused: no monetary values shown
- Medal icons for top 3 positions (gold/silver/bronze)

### Finny AI Advisor
- **Chat-style Interface**: 
  - Message bubbles with violet background
  - Avatar icon for Finny (robot/owl character)
  - White text on colored background
  - Suggestions as clickable chips below messages
- Insight cards: light violet background, rounded-lg, p-4

### Education Page
- **Accordion Components**: 
  - Border-left accent (4px blue)
  - Expand/collapse with smooth transition
  - Icon rotation on expand
  - Content padding: p-6
  - Headers: font-semibold text-lg

### Forms & Inputs
- Input fields: border-2, rounded-lg, p-3, focus:border-blue transition
- Labels: text-sm font-medium, mb-2
- Buttons: 
  - Primary: blue background, white text, rounded-lg, px-6 py-3, font-semibold
  - Secondary: white background, blue border and text
  - Delete/Warning: red background
- Select dropdowns: custom styled to match inputs

### Profile Page
- Two-column layout: Avatar/Info left, Edit form right
- Info rows: label + value pairs with dividers
- Edit mode: inline form fields
- Save/Cancel buttons at bottom

## Visual Patterns

### Data Visualization
- Simple bar charts for monthly comparisons (use Chart.js or similar)
- Donut charts for expense categories
- Line graphs for trends
- Color coding matches expense categories

### Icons
- **Library**: Heroicons (outline for general UI, solid for filled states)
- Sizes: w-5 h-5 for inline, w-6 h-6 for cards, w-8 h-8 for features
- Category icons: unique icon per category (food, transport, entertainment, etc.)

### Empty States
- Centered icon + message
- Call-to-action button
- Illustration style: simple line drawings in violet

### Loading States
- Skeleton screens with animated gradient
- Spinner: circular, blue color
- Progress indicators for data loading

## Responsive Breakpoints
- Mobile-first approach
- Tablet: md: (768px) - 2-column layouts
- Desktop: lg: (1024px) - 3-column layouts, sidebar navigation
- Navigation: hamburger menu on mobile, full nav on desktop

## Animations
**Minimal & Purposeful**:
- Transitions: 150-300ms ease-in-out
- Hover states: subtle scale or shadow changes
- Progress bar fills: animated on load
- Page transitions: fade in content
- **No**: complex scroll animations, parallax, excessive motion

## Images
**No hero images needed** - this is a dashboard/productivity application focused on data and functionality. Use illustrations/icons instead:
- Welcome screen: illustration of savings/financial growth
- Empty states: minimalist line illustrations
- Education page: simple infographics
- Finny character: friendly mascot illustration (owl or robot)

## Accessibility
- WCAG 2.1 AA compliance
- Focus indicators: 2px blue outline
- Aria labels for all interactive elements
- Keyboard navigation support
- Sufficient color contrast (4.5:1 for text)
- Error messages clearly visible

## Mobile Optimization
- Touch targets: minimum 44x44px
- Bottom navigation for primary actions on mobile
- Swipe gestures for transaction editing
- Collapsible sections to save vertical space
- Sticky header on scroll