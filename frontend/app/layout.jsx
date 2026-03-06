'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './globals.css';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <html lang="en">
      <head>
        <title>NexDex - AI-Powered Student Platform</title>
        <meta name="description" content="AI-powered student platform for academic planning and opportunity discovery" />
      </head>
      <body>
        <div className="app-container">
          <nav className="navbar">
            <div className="nav-brand">NexDex 🐍</div>
            <ul className="nav-links">
              <li>
                <Link
                  href="/"
                  className={isActive('/') ? 'active' : ''}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/recommendations"
                  className={isActive('/recommendations') ? 'active' : ''}
                >
                  AI Suggestions
                </Link>
              </li>
              <li>
                <Link
                  href="/scheduler"
                  className={isActive('/scheduler') ? 'active' : ''}
                >
                  Scheduler
                </Link>
              </li>
              <li>
                <Link
                  href="/opportunities"
                  className={isActive('/opportunities') ? 'active' : ''}
                >
                  Opportunities
                </Link>
              </li>
              <li>
                <Link
                  href="/roadmap"
                  className={isActive('/roadmap') ? 'active' : ''}
                >
                  Roadmap
                </Link>
              </li>
            </ul>
          </nav>

          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
