# Vaultify 📚

Vaultify is a modern, secure platform for students to access, share, and manage academic resources, particularly focusing on previous year question papers and study materials.

![Vaultify Logo](public/Logo.png)

## 🌟 Features

### For Students
- **Smart Search**: AI-powered search to find exactly what you need
- **Easy Upload**: Simple drag-and-drop interface for uploading papers
- **Instant Access**: Quick downloads and previews of papers
- **Collaborative Learning**: Share resources with classmates
- **Multi-format Support**: View and download files in their original format (PDF, Images, etc.)
- **Secure Storage**: All documents are encrypted and stored safely

### Technical Features
- **Modern UI/UX**: Built with Next.js 13 and Tailwind CSS
- **Responsive Design**: Works seamlessly on all devices
- **Dark Mode Support**: Easy on the eyes, day or night
- **Real-time Updates**: Instant feedback on all actions
- **Smooth Animations**: Framer Motion powered transitions
- **Type Safety**: Built with TypeScript

## 🚀 Getting Started

### Prerequisites
- Node.js 16.x or later
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/Kthombare-dev/Vaultify
cd vaultify
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```
Fill in your Firebase configuration details in `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
vaultify/
├── src/
│   ├── app/                 # Next.js 13 app directory
│   │   ├── api/            # API routes
│   │   ├── browse/         # Browse papers page
│   │   ├── upload/         # Upload page
│   │   └── components/     # Page-specific components
│   ├── components/         # Shared components
│   │   ├── ui/            # UI components
│   │   ├── landing/       # Landing page components
│   │   └── magicui/       # Special UI effects
│   └── lib/               # Utilities and services
├── public/                # Static assets
└── ...config files
```

## 🛠️ Built With

- [Next.js 13](https://nextjs.org/) - React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Firebase](https://firebase.google.com/) - Backend & Storage
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [TypeScript](https://www.typescriptlang.org/) - Type Safety

## 📱 Features Breakdown

### Browse Papers
- Advanced filtering by branch, semester, year, and paper type
- Real-time search functionality
- Preview papers before downloading
- Download in original format
- Beautiful card layout with shimmer effects

### Upload Papers
- Drag and drop file upload
- Multi-file support
- Progress tracking
- File type validation
- Automatic metadata extraction

### Landing Page
- Animated hero section
- Feature highlights
- How it works section
- Testimonials
- Dark mode support

## 🔐 Security

- Firebase Authentication
- Secure file storage
- Download rate limiting
- File type validation
- Content verification

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org/)
- [Vercel](https://vercel.com/)
- [Firebase](https://firebase.google.com/)
- [shadcn](https://twitter.com/shadcn)
- All contributors and users of Vaultify

## 📧 Contact

Your Name - [@ThombareKetan](https://x.com/ThombareKetanon)

Project Link: [https://github.com/Kthombare-dev/Vaultify](https://github.com/Kthombare-dev/Vaultify)

---

Made with ❤️ by [Ketan Thombare]
