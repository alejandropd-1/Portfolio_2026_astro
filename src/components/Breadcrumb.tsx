
import { Folder } from 'lucide-react';
import styles from '@/styles/components/_breadcrumb.module.scss';

type BreadcrumbPath = string | { name: string; href: string };

export default function Breadcrumb({ paths }: { paths: BreadcrumbPath[] }) {
  return (
    <div className={`${styles.breadcrumb} print:hidden`}>
      <Folder size={14} />
      <div className={styles.breadcrumb__list}>
        <a href="/" className={styles.breadcrumb__link}>~</a>
        <span className={styles.breadcrumb__separator}>/</span>
        <a href="/" className={styles.breadcrumb__link}>root</a>
        {paths.map((path, index) => {
          const isLink = typeof path === 'object';
          return (
            <span key={index} className={styles.breadcrumb__list}>
              <span className={styles.breadcrumb__separator}>/</span>
              {isLink ? (
                <a href={path.href} className={styles.breadcrumb__link}>{path.name}</a>
              ) : (
                <span className={styles.breadcrumb__current}>{path}</span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
