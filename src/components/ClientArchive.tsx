'use client';

import { useTina, tinaField } from 'tinacms/dist/react';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { Tag } from '@/components/UI';
import styles from '@/styles/pages/_archive.module.scss';
import { clsx } from 'clsx';
import { cleanTitle, formatTitle } from '@/helpers/text-helpers';
import Breadcrumb from '@/components/Breadcrumb';

type PageArchive = { title: string; subtitle?: string };
type Props = { projects: any[]; query: string; variables: object; data: any };

export default function ClientArchive({ projects, query, variables, data }: Props) {
  const { data: tinaData } = useTina({ query, variables, data });
  const page = tinaData.pages as PageArchive;

  return (
    <div className="page-container">
      <header className={styles.archive__header}>
        <div className={styles.archive__breadcrumbRow}>
          <Breadcrumb paths={['archive']} />
        </div>
        <h1
          className={styles.archive__title}
          data-tina-field={tinaField(page, 'title')}
        >
          {formatTitle(page.title)}
        </h1>
        <p
          className={styles.archive__subtitle}
          data-tina-field={tinaField(page, 'subtitle')}
        >
          {page.subtitle}
        </p>
      </header>

      <div className={styles.archive__table}>
        {/* Terminal Header */}
        <div className={styles.archive__terminalHeader}>
          <div className={styles.archive__dots}>
            <div className={clsx(styles.archive__dot, styles['archive__dot--red'])}></div>
            <div className={clsx(styles.archive__dot, styles['archive__dot--yellow'])}></div>
            <div className={clsx(styles.archive__dot, styles['archive__dot--green'])}></div>
          </div>
          <div className={styles.archive__fileName}>query_db.sh</div>
          <div className={styles.archive__controls}>
            <select className={styles.archive__select}>
              <option>All Years</option>
            </select>
            <select className={styles.archive__select}>
              <option>All Categories</option>
            </select>
          </div>
        </div>

        {/* Table Head */}
        <div className={styles.archive__gridHeader}>
          <div className={styles.archive__headerYear}>Year</div>
          <div className={styles.archive__headerProject}>Project_ID</div>
          <div className={styles.archive__headerStack}>Stack</div>
          <div className={styles.archive__headerAction}>Action</div>
        </div>

        {/* Table Body */}
        <div className={styles.archive__gridBody}>
          {projects.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className={styles.archive__row}
            >
              <div className={styles.archive__year}>{project.year ? project.year.split('.')[0] : '2024'}</div>
              <div className={styles.archive__projectName}>
                <a href={`/projects/${project.slug}`} className={styles.archive__projectTitle}>
                  {cleanTitle(project.title).replace(/\s+/g, '_')}
                </a>
                {project.status && (
                  <span className={styles.archive__status}>{project.status}</span>
                )}
              </div>
              <div className={styles.archive__stackCol}>
                {Array.isArray(project.stack) && project.stack.slice(0, 3).map((s: string) => <Tag key={s} className="text-[9px] px-2">{s}</Tag>)}
              </div>
              <div className={styles.archive__actionCol}>
                <a href={`/projects/${project.slug}`}>
                  <button className={styles.archive__actionBtn}>
                    VIEW.MD <ExternalLink size={14} />
                  </button>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination/Status Footer */}
        <div className={styles.archive__tableFooter}>
          <div style={{ opacity: 0.6 }}>Showing {projects.length} of {projects.length} entries</div>
          <div className={styles.archive__pagination}>
            <button className={clsx(styles.archive__pageBtn, styles['archive__pageBtn--disabled'])}>
              {"<"} PREV
            </button>
            <button className={clsx(styles.archive__pageBtn, styles['archive__pageBtn--disabled'])}>
              NEXT {">"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
