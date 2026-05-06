'use client';

import { motion } from 'motion/react';
import { Folder, Beaker, Settings, Monitor } from 'lucide-react';

import { SyntaxCard, KeyValue } from '@/components/UI';
import styles from '@/styles/pages/_about.module.scss';
import { formatTitle } from '@/helpers/text-helpers';
import Breadcrumb from '@/components/Breadcrumb';

const philosophies = [
  {
    icon: <Beaker size={24} className="secondary-text" />,
    accent: 'secondary',
    title: 'Atomic Principles',
    description: 'Interfaces must be broken down into their smallest possible components. Build the molecule, then the organism. Consistency arises from rigorous modularity.'
  },
  {
    icon: <Settings size={24} className="tertiary-text" />,
    accent: 'tertiary',
    title: 'Data-Driven Empathy',
    description: 'Aesthetics without analytics is just decoration. Decisions must be anchored in user behavioral data, transforming subjective opinions into objective truths.'
  },
  {
    icon: <Monitor size={24} className="primary-text" />,
    accent: 'primary',
    title: 'Technical Feasibility',
    description: 'A design is only as good as its implementation. Designing with a deep understanding of CSS, React, and layout engines ensures the vision survives production.'
  }
];

export default function ClientAbout({ frontmatter, children }: { frontmatter: any, children: React.ReactNode }) {
  return (
    <div className="page-container">
      <div className={styles.about}>
        <Breadcrumb paths={['about']} />
        <section className={styles.about__hero}>
          <div>

            <div className={styles.about__subtitle}>
              <span className={styles.about__subtitleHighlight}>{"//"}</span> THE ARCHITECT
            </div>
            <h1 className={styles.about__title}>
              {formatTitle(frontmatter.title || "Bridging \\n // Logic & Soul")}
            </h1>
            <div className={styles.about__accent}></div>
          </div>

          <div className={styles.about__content}>
            <div className={styles.about__details}>
              {children}
            </div>

            <div className={`pt-10 border-t border-[rgba(var(--clr-brand-on-surface-rgb),0.05)]`}>
              <KeyValue k="Location =" v={frontmatter.location || '"Global_Remote";'} className={styles.about__keyValue} />
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
                  <div className={styles.about__philosophyCardIcon}>{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </SyntaxCard>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
