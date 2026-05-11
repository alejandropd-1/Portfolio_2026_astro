'use client';



import { Sun, Moon, Rss, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Variants } from 'motion/react';
import { useState, useEffect } from 'react';
import styles from '@/styles/components/_navigation.module.scss';
import { clsx } from 'clsx';

const navLinks = [
  { name: 'PROJECTS', href: '/', index: '01' },
  { name: 'RESUME', href: '/resume', index: '02' },
  { name: 'ABOUT', href: '/about', index: '03' },
  { name: 'ARCHIVE', href: '/archive', index: '04' },
];

// Stagger variants for overlay links
const overlayVariants: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } },
};

const panelVariants: Variants = {
  hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
  visible: {
    opacity: 1,
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    clipPath: 'inset(0 0 100% 0)',
    transition: { duration: 0.32, ease: [0.55, 0, 1, 0.45] },
  },
};

const linkItemVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.18 + i * 0.07, duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, x: 16, transition: { duration: 0.15 } },
};

export default function Navigation({ pathname = '/' }: { pathname?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') ?? 'dark';
    }
    return 'dark';
  });
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Hydration guard + restore theme class on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, []);

  // Scroll lock while menu is open — html+body overflow hidden (modern, safe)
  useEffect(() => {
    if (!mounted) return;
    if (menuOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [menuOpen, mounted]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  if (!mounted) {
    return (
      <nav className={clsx(styles.nav, 'opacity-0')}>
        <div className={styles.nav__logo}>
          <span>Ale</span>Design<span>;</span>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className={styles.nav}>
        <a href="/" className={styles.nav__logo} onClick={() => setMenuOpen(false)}>
          <span>Ale</span>Design<span>;</span>
        </a>

        {/* Desktop links */}
        <div className={styles.nav__links}>
          {navLinks.map((link) => {
            // Normalize paths: strip trailing slash except for root
            const normalizedPathname = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
            const normalizedHref = link.href === '/' ? '/' : link.href.replace(/\/$/, '');
            const isActive = normalizedPathname === normalizedHref;
            return (
              <a
                key={link.name}
                href={link.href}
                className={clsx(styles.nav__link, isActive && styles['nav__link--active'])}
              >
                <span>{link.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className={styles.nav__pill}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* Right-side actions */}
        <div className={styles.nav__actions}>
          {/* Theme toggle — always visible */}
          <button onClick={toggleTheme} className={styles.nav__btn} aria-label="Toggle theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Desktop-only action buttons */}
          <a href="/rss.xml" target='_blank' className={clsx(styles.nav__btn, styles['nav__btn--desktop'])} aria-label="RSS Feed">
            <Rss size={18} />
          </a>
          <button className={clsx(styles.nav__btn, styles['nav__btn--desktop'])} aria-label="Source">
            <Code size={18} />
          </button>

          {/* Mobile hamburger — terminal >_ icon */}
          <button
            className={clsx(styles.nav__terminal_btn, menuOpen && styles['nav__terminal_btn--active'])}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="close"
                  className={styles.terminal_icon}
                  {...overlayVariants}
                  aria-hidden="true"
                >
                  ✕
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  className={styles.terminal_icon}
                  {...overlayVariants}
                  aria-hidden="true"
                >
                  {'>_'}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobile_overlay}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            aria-modal="true"
            role="dialog"
            aria-label="Navigation menu"
          >
            {/* Overlay header */}
            <div className={styles.mobile_overlay__header}>
              <a
                href="/"
                className={clsx(styles.nav__logo, styles['nav__logo--overlay'])}
                onClick={() => setMenuOpen(false)}
              >
                <span>Ale</span>Design<span>;</span>
              </a>

              <div className={styles.mobile_overlay__meta}>
                <span className={styles.meta__label}>FILE_PATH: /ROOT/NAVIGATION</span>
                <span className={styles.meta__title}>SYSTEM_INDEX</span>
              </div>
            </div>

            {/* Nav links */}
            <nav className={styles.mobile_overlay__nav} aria-label="Mobile navigation">
              {navLinks.map((link, i) => {
                // Normalize paths: strip trailing slash except for root
                const normalizedPathname = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
                const normalizedHref = link.href === '/' ? '/' : link.href.replace(/\/$/, '');
                const isActive = normalizedPathname === normalizedHref;
                return (
                  <motion.div
                    key={link.name}
                    custom={i}
                    variants={linkItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={styles.mobile_overlay__container_link}
                  >
                    <a
                      href={link.href}
                      className={clsx(
                        styles.mobile_overlay__link,
                        isActive && styles['mobile_overlay__link--active']
                      )}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className={styles.mobile_overlay__index}>{link.index} —</span>
                      <span className={styles.mobile_overlay__name}>{link.name}</span>
                    </a>
                  </motion.div>
                );
              })}
            </nav>

            {/* Footer actions */}
            <div className={styles.mobile_overlay__footer}>
              <div className={styles.mobile_overlay__actions}>
                <button
                  className={clsx(styles.nav__btn, styles['nav__btn--overlay'])}
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                  <span>{theme === 'light' ? 'LIGHT_MODE' : 'DARK_MODE'}</span>
                </button>
                <a href="/rss.xml" className={clsx(styles.nav__btn, styles['nav__btn--overlay'])} aria-label="RSS Feed">
                  <Rss size={18} />
                  <span>RSS FEED</span>
                </a>
                <button className={clsx(styles.nav__btn, styles['nav__btn--overlay'])} aria-label="Source">
                  <Code size={18} />
                  <span>SOURCE</span>
                </button>
              </div>
              <div className={styles.mobile_overlay__status}>
                <span>STATUS: AUTHORIZED</span>
                <span className={styles.status__uuid}>UUID: 0X2A99·FF01·V1.0·SOUL</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
