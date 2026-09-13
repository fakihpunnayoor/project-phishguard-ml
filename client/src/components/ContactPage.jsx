import React from 'react';
import { MainNavbar } from './MainNavbar';
import { ContactSection } from './ContactSection';
import { MainFooter } from './MainFooter';

export const ContactPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white font-sans flex flex-col justify-between">
      {/* Navbar with active 'contact' tab */}
      <MainNavbar currentView="contact" onNavigate={onNavigate} />

      {/* Main Content: Contact Creator Only */}
      <main className="flex-1 pt-20">
        <ContactSection />
      </main>

      {/* Footer */}
      <MainFooter onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
    </div>
  );
};

export default ContactPage;
