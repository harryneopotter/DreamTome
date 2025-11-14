import { Outlet, useLocation } from 'react-router-dom';
import MedievalArtifactNav from './MedievalArtifactNav';

export default function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen relative">
      {/* Desk Scene - Always visible */}
      <div className="desk-scene">
        {/* Candle Glow */}
        <div className="candle-glow"></div>

        {/* Open Book - Only shown on home/tome page */}
        {isHomePage && (
          <div className="desk-book fade-in">
            <div className="book-left-page" id="refined-prose-page">
              {/* Refined prose will be dynamically inserted here */}
            </div>
            <div className="book-right-page">
              {/* Main content outlet goes here when on home page */}
              <Outlet />
            </div>
          </div>
        )}
      </div>

      {/* Content wrapper for other pages */}
      <div className={`desk-content-wrapper ${isHomePage ? 'hidden' : ''}`}>
        <main className="min-h-screen pb-8">
          {!isHomePage && <Outlet />}
        </main>
      </div>

      {/* Medieval Artifacts Navigation - OUTSIDE all containers for proper layering */}
      <MedievalArtifactNav />
    </div>
  );
}
