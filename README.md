# ☕ CoffeeChat Coach

A modern, responsive web application that helps international students and new graduates practice networking and interview skills through AI-powered roleplay scenarios and cold outreach coaching.

## 🚀 Features

### Core Features
- **Responsive Design** - Mobile-first design with hamburger navigation and adaptive layouts
- **AI Chat Scenarios** - Realistic conversations with 3 specialized personas:
  - **Recruiter**: Professional tech recruiter for networking practice
  - **Alumni**: University alumni sharing career insights and mentorship
  - **PM**: Senior Product Manager for informational interviews
- **Real-time Chat** - Streaming AI responses with message history and focus management
- **Smart Feedback System** - AI-powered analysis focusing exclusively on user performance
- **CoffeeChat Kit Generator** - Personalized conversation starters from LinkedIn profiles
- **Cold Email Coach** - Concise, effective email rewrites (3-4 sentences max)
- **Secure Authentication** - Clerk-powered login with route protection
- **History Dashboard** - Comprehensive view of past sessions, kits, and email drafts

### Key Benefits
- **Safe Practice Environment** - Build confidence before real networking situations
- **Personalized Coaching** - AI adapts feedback to your communication style
- **Anti-Cliché Design** - Avoid generic phrases and create authentic connections
- **Actionable Insights** - Specific, implementable improvements for better networking
- **Mobile Optimized** - Practice anywhere with responsive design

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS
- **Authentication**: Clerk v6 with middleware protection
- **Database**: Supabase PostgreSQL with Prisma ORM (Session Pooler)
- **AI**: Groq API for fast, reliable AI responses
- **Validation**: Zod schemas for runtime type safety
- **Rate Limiting**: Upstash Redis with graceful fallback
- **Styling**: Custom CSS variables with design tokens
- **Deployment**: Vercel + Supabase

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase PostgreSQL database
- Groq API key
- Clerk account for authentication

## ⚡ Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd coffeechat-coach
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Fill in your environment variables:

```env
# Database (Use Supabase Session Pooler for prepared statements)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-1-us-east-2.pooler.supabase.com:5432/postgres"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Groq API
GROQ_API_KEY=your_groq_api_key_here

# Upstash Redis (Optional - for rate limiting)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) View database in Prisma Studio
npx prisma studio
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app!

## 🗄️ Database Schema

The app uses 4 main models with proper relationships:

- **Contact** - LinkedIn profile information and notes
- **CoffeechatKit** - Generated conversation starters, shared interests, and one-line pitches
- **ChatSession** - Practice session transcripts with AI feedback
- **ColdEmailDraft** - Email drafts with AI analysis and concise rewrites

## 🔐 Authentication & Security

- **Clerk v6 Integration** - Modern authentication with middleware protection
- **Route Protection** - All practice features require authentication
- **User Data Isolation** - Data scoped by `ownerClerkUserId`
- **Graceful Error Handling** - User-friendly error messages without exposing internals
- **Rate Limiting** - 10 requests/minute per user for AI endpoints

## 🤖 AI Integration

### Chat Personas
- **Recruiter**: Realistic tech recruiter focused on networking and relationship building
- **Alumni**: University alumni providing career guidance and industry insights
- **PM**: Senior Product Manager for informational interviews and career advice

### AI Features
- **Streaming Responses** - Real-time chat experience
- **Contextual Feedback** - AI analyzes only user messages for relevant feedback
- **Concise Email Rewrites** - 3-4 sentence cold emails with clear value propositions
- **Personalized Kits** - Conversation starters based on LinkedIn profile analysis

## 📱 Responsive Design

### Mobile-First Approach
- **Hamburger Navigation** - Collapsible menu for mobile devices
- **Adaptive Layouts** - Grid systems that work on all screen sizes
- **Touch-Friendly** - Optimized button sizes and spacing
- **Full-Width Containers** - Consistent spacing across devices

### Design System
- **CSS Variables** - Consistent theming with design tokens
- **Tailwind Utilities** - Responsive classes for adaptive layouts
- **Component Library** - Reusable UI components with proper styling

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes with error handling
│   │   ├── chat/          # Real-time chat API
│   │   ├── cold-email/    # Email analysis API
│   │   ├── feedback/      # Chat feedback API
│   │   ├── generate/      # Kit generation API
│   │   └── history/       # User history API
│   ├── chat/[scenario]/   # Dynamic chat interface
│   ├── cold-email/        # Email coaching interface
│   ├── generate/          # Kit generation interface
│   ├── history/           # History dashboard
│   └── scenarios/         # Scenario selection
├── components/            # React components
│   ├── ui/               # Base UI components (Button, Card, Input)
│   ├── ChatMessage.tsx   # Chat message display
│   ├── Navbar.tsx        # Responsive navigation
│   ├── Footer.tsx        # Application footer
│   └── ThemeToggle.tsx   # Theme switching
├── lib/                  # Shared utilities
│   ├── ai.ts             # AI service with type safety
│   ├── db.ts             # Prisma database client
│   ├── ratelimit.ts      # Rate limiting utilities
│   ├── scenarios.ts      # Scenario definitions
│   ├── utils.ts          # General utilities
│   └── validation.ts     # Zod validation schemas
└── middleware.ts         # Clerk authentication middleware
```

## 🚀 Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy with automatic builds

### Database Migration

```bash
# Production migration
npx prisma migrate deploy
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint (clean codebase)
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes
- `npm run db:reset` - Reset database

### Code Quality

- **TypeScript** - Full type safety throughout the application
- **ESLint** - Clean, lint-free codebase
- **Error Handling** - Graceful error management with user-friendly messages
- **Responsive Design** - Mobile-first approach with adaptive layouts

## 🎯 Usage Examples

### Generate CoffeeChat Kit

1. Copy LinkedIn profile text (About, Experience, Education)
2. Paste into Generate Kit page
3. Get personalized conversation starters and shared interests
4. Use the one-line pitch for introductions

### Practice Networking

1. Choose scenario (Recruiter/Alumni/PM)
2. Engage in realistic AI conversation
3. Receive focused feedback on your communication
4. Review strengths and specific improvements

### Improve Cold Emails

1. Draft your outreach message
2. Get AI analysis of strengths and weaknesses
3. Receive concise, effective rewrite (3-4 sentences)
4. Use suggested subject lines and opening/closing phrases

## 🚦 Performance & Reliability

- **Rate Limiting** - 10 requests per minute per user for AI endpoints
- **Error Recovery** - Graceful handling of API failures
- **Input Validation** - Zod schemas prevent invalid data
- **Database Optimization** - Supabase Session Pooler for prepared statements
- **Responsive Loading** - Optimized for all device types

## 🔒 Security Features

- **Clerk Authentication** - Modern auth with route protection
- **User Data Isolation** - Complete separation by user ID
- **Input Sanitization** - Validation prevents injection attacks
- **Environment Protection** - Secure handling of API keys
- **Rate Limiting** - Prevents abuse of AI endpoints

## 🐛 Troubleshooting

### Common Issues

**Database Connection**
- Use Supabase Session Pooler connection string
- Ensure DATABASE_URL is properly formatted
- Check if database migrations are applied

**AI API Errors**
- Verify GROQ_API_KEY is set correctly
- Check API quota and billing status
- Ensure proper error handling in place

**Authentication Issues**
- Update to Clerk v6 for Next.js 15 compatibility
- Verify public/secret keys in environment
- Check middleware configuration

**Mobile Display Issues**
- Ensure responsive design classes are applied
- Test on various screen sizes
- Check container and spacing utilities

## 📝 Recent Updates

### v2.0 Improvements
- ✅ **Responsive Design** - Mobile-first approach with hamburger navigation
- ✅ **Error Handling** - User-friendly error messages throughout
- ✅ **AI Improvements** - More realistic personas and concise email rewrites
- ✅ **Type Safety** - Full TypeScript coverage with proper types
- ✅ **Performance** - Optimized database connections and API responses
- ✅ **Code Quality** - Clean, lint-free codebase

## 📞 Support

For issues and questions:
- Create GitHub issue with detailed description
- Check troubleshooting section above
- Review environment setup requirements
- Test on different devices for responsive issues

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Ensure responsive design and error handling
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open Pull Request

---

Built with ❤️ to help students succeed in networking and career development. Now with responsive design and robust error handling for the best user experience across all devices.
