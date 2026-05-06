import styles from '@/styles/components/_footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__content}>
        <div className={styles.footer__logo}>
          AleDesign
        </div>
        
        <div className={styles.footer__links}>
          <a href="#">GITHUB</a>
          <a href="#">LINKEDIN</a>
          <a href="#">SOURCE CODE</a>
        </div>

        <div className={styles.footer__copyright}>
          © 2024 ALE_DESIGN // COMPILED WITH SOUL
        </div>
      </div>
    </footer>
  );
}
