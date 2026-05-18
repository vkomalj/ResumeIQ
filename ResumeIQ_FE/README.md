# InterviewAI - AI Interview Assistant

A modern, premium AI-powered interview coaching platform built with Next.js, Framer Motion, and Zustand.

## Features

- **AI-Powered Coaching**: Get intelligent feedback and personalized tips from our AI assistant
- **Resume Analysis**: Upload and analyze your resume for improvement suggestions
- **Interactive Chat**: Real-time conversation with the AI chatbot
- **Authentication**: Secure sign-in/sign-up
- **Responsive Design**: Mobile-first, fully responsive interface
- **Smooth Animations**: Beautiful Framer Motion animations throughout
- **Premium UI**: Glass-morphism effects and modern gradient design

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion v11
- **State Management**: Zustand
- **Form Validation**: React Hook Form + Zod
- **Fonts**: Inter & Poppins from Google Fonts
- **Notifications**: Sonner

## Project Structure

```
app/
├── page.tsx                 # Home/Landing page
├── sign-in/                 # Sign in page
├── sign-up/                 # Sign up page
├── dashboard/               # Main dashboard (protected)
├── layout.tsx              # Root layout with providers
└── globals.css             # Global styles

components/
├── auth/                    # Authentication components
│   ├── AuthLayout.tsx
│   ├── SignInForm.tsx
│   ├── SignUpForm.tsx
├── chatbot/                 # Chatbot components
│   └── ResumeUpload.tsx
├── dashboard/               # Dashboard components
│   ├── Header.tsx
│   ├── JobsView.tsx
│   ├── JobCard.tsx
│   ├── CandidateMatchList.tsx
│   ├── CandidateResumes.tsx
│   ├── ResumeList.tsx
│   └── CreateJobModal.tsx
├── ui/                      # Cleaned up shadcn/ui components
├── AnimatedButton.tsx       # Animated button wrapper
├── ErrorBoundary.tsx        # Error handling
└── Providers.tsx            # App providers

lib/
├── animations.ts            # Framer Motion animation presets
├── schemas.ts              # Zod validation schemas
├── utils.ts                # Utility functions
└── stores/                 # Zustand stores
    ├── authStore.ts        # Authentication state
    └── chatStore.ts        # Chat state

hooks/
└── useAuthCheck.ts         # Authentication check hook

public/
├── icon.svg
├── icon-dark-32x32.png
└── icon-light-32x32.png
```

## Color System

The app uses a premium dark theme with:
- **Primary**: Purple/Blue gradient (oklch(0.55 0.24 263))
- **Secondary**: Blue tone (oklch(0.45 0.18 200))
- **Accent**: Violet (oklch(0.65 0.22 275))
- **Background**: Deep slate (oklch(0.08 0 0))
- **Text**: Light foreground (oklch(0.98 0 0))

## Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file (currently using mock data):

```env
# Add API endpoints here when connecting to a backend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Authentication Flow

1. **Sign Up**: Create account with name, email, and password
2. **Sign In**: Login with email and password
3. **Protected Routes**: Dashboard requires authentication

## Chatbot Features

- **Resume Upload**: Drag-and-drop or click to upload PDF/DOCX
- **Real-time Chat**: Send and receive messages instantly
- **AI Responses**: Context-aware responses based on user input
- **Message History**: All messages are stored in state
- **Status Indicators**: Loading states and timestamps

## Form Validation

All forms use Zod for client-side validation:
- Email format validation
- Password strength requirements
- Password confirmation matching
- File type and size validation

## Mobile Responsiveness

The app is fully responsive with breakpoints:
- **xs**: 320px (mobile)
- **sm**: 640px (small tablet)
- **md**: 768px (tablet)
- **lg**: 1024px (desktop)
- **xl**: 1280px (large desktop)

## Animations

Smooth animations throughout the app:
- Page transitions (slide-up effect)
- Button interactions (scale on hover/click)
- Card animations (staggered entrance)
- Floating elements (breathing/floating effect)
- Loading states (pulse animations)

## Customization

### Changing Colors

Edit design tokens in `/app/globals.css`:
```css
:root {
  --primary: oklch(0.55 0.24 263); /* Change to your color */
  /* ... other colors */
}
```

### Changing Fonts

Update font imports in `/app/layout.tsx`:
```tsx
const inter = Inter({ ... });
const poppins = Poppins({ ... });
```

### Adding New Pages

1. Create a folder in `/app`
2. Add `page.tsx` file
3. Use `AuthLayout` for authenticated pages
4. Add metadata for SEO

## Performance Optimizations

- Image optimization with Next.js
- Code splitting and lazy loading
- Responsive images and assets
- CSS minification with Tailwind
- Animation performance with GPU acceleration

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- Backend API integration
- Real AI model integration (OpenAI/Claude)
- User profiles with preferences
- Interview history and progress tracking
- Video interview practice
- Admin dashboard
- Payment integration
- Email notifications

## License

This project is created with v0.app

## Support

For issues and questions, please create an issue in the repository.
