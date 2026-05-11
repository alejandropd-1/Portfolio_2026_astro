import {
  siGithub, siLinkedin, siInstagram, siX, siFacebook,
  siYoutube, siTiktok, siBehance, siDribbble, siWhatsapp,
  siTelegram, siDiscord, siBluesky, siPinterest,
} from 'simple-icons';
import styles from '@/styles/components/_footer.module.scss';

type SimpleIcon = { path: string; title: string };

function BrandIcon({ icon, size = 16 }: { icon: SimpleIcon; size?: number }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-label={icon.title}
    >
      <path d={icon.path} />
    </svg>
  );
}

const ICON_MAP: Record<string, SimpleIcon> = {
  github:    siGithub,
  linkedin:  siLinkedin,
  instagram: siInstagram,
  twitter:   siX,
  facebook:  siFacebook,
  youtube:   siYoutube,
  tiktok:    siTiktok,
  behance:   siBehance,
  dribbble:  siDribbble,
  whatsapp:  siWhatsapp,
  telegram:  siTelegram,
  discord:   siDiscord,
  bluesky:   siBluesky,
  pinterest: siPinterest,
};

type FooterLink = { name: string; url: string; icon?: string };
type Props = { copyright?: string; links?: FooterLink[] };

export default function Footer({ copyright, links }: Props) {
  const resolvedLinks = links ?? [
    { name: 'GitHub',   url: '#', icon: 'github'   },
    { name: 'LinkedIn', url: '#', icon: 'linkedin'  },
    { name: 'Bluesky',  url: '#', icon: 'bluesky'   },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__content}>
        <div className={styles.footer__logo}>
          AleDesign
        </div>

        <div className={styles.footer__links}>
          {resolvedLinks.map((link) => {
            const icon = link.icon ? ICON_MAP[link.icon.toLowerCase()] : undefined;
            return (
              <a
                key={link.name}
                href={link.url}
                className={styles.footer__link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {icon && (
                  <span className={styles.footer__linkIcon}>
                    <BrandIcon icon={icon} size={14} />
                  </span>
                )}
                <span>{link.name}</span>
              </a>
            );
          })}
        </div>

        <div className={styles.footer__copyright}>
          {copyright ?? '© 2026 ALE_DESIGN // COMPILED WITH SOUL'}
        </div>
      </div>
    </footer>
  );
}
