'use client';

import { useTina, tinaField } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { motion } from 'motion/react';
import { Beaker, Settings, Monitor } from 'lucide-react';

import { SyntaxCard, KeyValue } from '@/components/UI';
import styles from '@/styles/pages/_about.module.scss';
import { formatTitle } from '@/helpers/text-helpers';
import Breadcrumb from '@/components/Breadcrumb';

const ICON_MAP: Record<string, React.ReactNode> = {
  beaker:   <Beaker   size={24} className="secondary-text" />,
  settings: <Settings size={24} className="tertiary-text" />,
  monitor:  <Monitor  size={24} className="primary-text"   />,
};

type Philosophy = { icon?: string; accent?: string; title: string; description?: string };
type PageAbout  = { title: string; mission?: string; body?: any; philosophies?: Philosophy[] };
type Props      = { query: string; variables: object; data: any };

export default function ClientAbout({ query, variables, data }: Props) {
  const { data: tinaData } = useTina({ query, variables, data });
  const page = tinaData.pages as PageAbout;
  const philosophies = page.philosophies ?? [];

  return (
    <div className="page-container">
      <div className={styles.about}>
        <div className={styles.about__breadcrumbRow}>
          <Breadcrumb paths={['about']} />
        </div>
        <section className={styles.about__hero}>
          <div>
            <div className={styles.about__subtitle}>
              <span className={styles.about__subtitleHighlight}>{"//"}</span> THE ARCHITECT
            </div>
            <h1
              className={styles.about__title}
              data-tina-field={tinaField(page, 'title')}
            >
              {formatTitle(page.title || "Bridging \\n // Logic & Soul")}
            </h1>
            <div className={styles.about__accent}></div>
          </div>

          <div className={styles.about__content}>
            <div
              className={styles.about__details}
              data-tina-field={tinaField(page, 'body')}
            >
              <TinaMarkdown content={page.body} />
            </div>

            <div className={`pt-10 border-t border-[rgba(var(--clr-brand-on-surface-rgb),0.05)]`}>
              <KeyValue k="Location =" v={'"Global_Remote";'} className={styles.about__keyValue} />
            </div>
          </div>
        </section>

        <section className={styles.about__section}>
          <div className={styles.about__philosophyHeader}>
            <span><Monitor size={24} /></span>
            <h2>Core Philosophy</h2>
          </div>

          <div className={styles.about__philosophyGrid}>
            {philosophies.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <SyntaxCard className={styles.about__philosophyCard} data-accent={item.accent}>
                  <div className={styles.about__philosophyCardIcon}>
                    {ICON_MAP[item.icon ?? ''] ?? <Monitor size={24} />}
                  </div>
                  <h3 data-tina-field={tinaField(item, 'title')}>{item.title}</h3>
                  <p data-tina-field={tinaField(item, 'description')}>{item.description}</p>
                </SyntaxCard>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
