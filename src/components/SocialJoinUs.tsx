import React from 'react';

interface SocialJoinUsProps {
  variant?: 'sidebar' | 'footer';
  isMobileExpanded?: boolean;
}

export const SocialJoinUs: React.FC<SocialJoinUsProps> = ({
  variant = 'footer',
  isMobileExpanded = true,
}) => {
  const socialLinks = [
    {
      name: 'WhatsApp',
      url: 'https://wa.me/919876543210?text=Hi%2C%20I%20want%20to%20join%20the%20Tripholic%20travel%20community!',
      title: 'Join us on WhatsApp',
      hoverBg: 'hover:bg-emerald-500 hover:text-white hover:border-emerald-600',
      bgClass: 'bg-emerald-50 text-emerald-900',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.541 1.944.829 2.796.829 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.768-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.748 0-3.385-.45-4.819-1.238l-5.181 1.356 1.381-5.051c-.868-1.488-1.381-3.226-1.381-5.067 0-5.514 4.486-10 10-10s10 4.486 10 10zm-5.419 3.091c-.244-.122-1.442-.712-1.666-.793-.224-.082-.387-.122-.55.122-.163.244-.632.793-.775.956-.143.163-.285.183-.529.061-.244-.122-1.031-.38-1.964-1.212-.727-.648-1.218-1.449-1.36-1.693-.143-.244-.015-.376.107-.497.11-.11.244-.285.367-.428.122-.143.163-.244.244-.407.082-.163.041-.305-.02-.428-.061-.122-.55-1.325-.754-1.814-.198-.477-.4-.412-.55-.42-.142-.008-.305-.01-.468-.01s-.428.061-.652.305c-.224.244-.856.836-.856 2.039s.876 2.363 1 2.526c.122.163 1.724 2.632 4.175 3.69.583.252 1.039.403 1.394.516.586.186 1.12.16 1.542.097.471-.07 1.442-.59 1.645-1.16.204-.57.204-1.059.143-1.16-.061-.102-.224-.163-.468-.285z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com',
      title: 'Join us on Instagram',
      hoverBg: 'hover:bg-pink-600 hover:text-white hover:border-pink-700',
      bgClass: 'bg-pink-50 text-pink-900',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com',
      title: 'Join us on Facebook',
      hoverBg: 'hover:bg-blue-600 hover:text-white hover:border-blue-700',
      bgClass: 'bg-blue-50 text-blue-900',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'X',
      url: 'https://x.com',
      title: 'Join us on X',
      hoverBg: 'hover:bg-black hover:text-white hover:border-black',
      bgClass: 'bg-slate-100 text-slate-900',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ];

  if (variant === 'sidebar') {
    return (
      <div
        id="sidebar-join-us-section"
        style={{ border: '1.5px solid #000000' }}
        className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-amber-50/70 to-indigo-50/70 shadow-2xs mt-2"
      >
        <div
          className={`flex items-center justify-between mb-1.5 px-0.5 ${
            isMobileExpanded ? 'flex' : 'hidden sm:flex'
          }`}
        >
          <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-900">
            Join Us
          </span>
          <span
            style={{ border: '1px solid #000000' }}
            className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-200 text-black"
          >
            Community
          </span>
        </div>

        {/* Logos Only with clean buttons */}
        <div className="flex items-center justify-between sm:justify-start gap-1.5">
          {socialLinks.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              title={item.title}
              aria-label={item.title}
              style={{ border: '1.2px solid #000000' }}
              className={`w-8 h-8 sm:w-8 sm:h-8 rounded-lg ${item.bgClass} ${item.hoverBg} transition-all duration-200 flex items-center justify-center cursor-pointer shadow-2xs active:scale-95 group`}
            >
              {item.icon}
            </a>
          ))}
        </div>
      </div>
    );
  }

  // Footer / Bottom of Website Page variant
  return (
    <div
      id="website-join-us-section"
      style={{
        border: '2px solid #000000',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
      }}
      className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-50/80 via-white to-indigo-50/80 mb-8"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
            <span
              style={{ border: '1px solid #000000' }}
              className="text-[10px] font-mono font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-md"
            >
              Official Socials
            </span>
            <span className="text-xs font-mono font-bold text-slate-600">
              Daily Itineraries &amp; Updates
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 font-heading text-center sm:text-left">
            Join Us
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 font-medium text-center sm:text-left mt-0.5">
            Connect with our global travel community on WhatsApp, Instagram, Facebook, and X.
          </p>
        </div>

        {/* Logos Only Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {socialLinks.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              title={item.title}
              aria-label={item.title}
              style={{ border: '2px solid #000000' }}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${item.bgClass} ${item.hoverBg} transition-all duration-200 flex items-center justify-center cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 group`}
            >
              {item.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
