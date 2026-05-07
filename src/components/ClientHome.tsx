'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Folder, ArrowRight, ExternalLink, RotateCcw } from 'lucide-react';
import { SyntaxCard, Tag, KeyValue } from '@/components/UI';


import styles from '@/styles/pages/_home.module.scss';
import { clsx } from 'clsx';
import { cleanTitle, formatTitle } from '@/helpers/text-helpers';
import Breadcrumb from '@/components/Breadcrumb';

export default function ClientHome({ projects, pageMeta }: { projects: any[], pageMeta?: any }) {
  const featuredProject = projects[0];
  const [layout, setLayout] = useState<'cards' | 'list'>('cards');

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className={styles.home__hero}>
        <Breadcrumb paths={['projects']} />

        <h1 className={styles.home__title}>
          {formatTitle(pageMeta?.title || "Compiled Visions.")}
        </h1>

        <KeyValue
          k="const mission"
          v={pageMeta?.mission || "UX/UI designer with over 14 years of experience."}
          className="italic"
        />
      </section>

      <div className={styles.home__grid}>
        {/* Sidebar Filters */}
        <aside className={styles.home__sidebar}>
          <SyntaxCard label="Filters">
            <div className={styles.home__filterGroup}>
              <div className={styles.home__filterTags}>
                <Tag active>All Output</Tag>
                <Tag>UI/UX Eng</Tag>
                <Tag>Web Dev</Tag>
                <Tag>Mobile App</Tag>
              </div>
              <Tag className={styles.home__tagFit}>Systems</Tag>
            </div>

            <div className={styles.home__statusInfo}>
              <KeyValue k="status" v={`"${pageMeta?.status || 'available_for_hire'}",`} />
              <KeyValue k="location" v={`"${pageMeta?.location || 'remote'}",`} />
              <KeyValue k="timezone" v={`"${pageMeta?.timezone || 'EST'}",`} />
            </div>
          </SyntaxCard>

          <SyntaxCard label="Layout">
            <div className={styles.home__layoutGroup}>
              <Tag active={layout === 'cards'} onClick={() => setLayout('cards')}>Cards</Tag>
              <Tag active={layout === 'list'} onClick={() => setLayout('list')}>List</Tag>
            </div>
          </SyntaxCard>
        </aside>

        {/* Project Grid */}
        <div className={styles.home__projects}>
          {layout === 'cards' ? (
            <>
              {/* Featured Project */}
              {featuredProject && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <article className={styles.home__featured}>
                    <a href={`/projects/${featuredProject.slug}`}>
                      <div className={styles.home__featuredGrid}>
                        <div className={styles.home__featuredImageContainer}>
                          {featuredProject.image ? (
                            <img
                              src={featuredProject.image}
                              alt={cleanTitle(featuredProject.title)}
                              className={styles.home__featuredImage}
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <img
                              src="https://picsum.photos/seed/home-main/1920/1080"
                              alt={cleanTitle(featuredProject.title)}
                              className={styles.home__featuredImage}
                              referrerPolicy="no-referrer"
                            />
                          )}
                        </div>

                        <div className={styles.home__featuredInfo}>
                          <div className={styles.home__featuredMeta}>
                            <span>{"⟡"}</span> {featuredProject.year} {"//"} {featuredProject.type}
                          </div>

                          <h2 className={styles.home__featuredTitle}>
                            {cleanTitle(featuredProject.title)}
                          </h2>

                          <p className={styles.home__featuredDesc}>
                            {featuredProject.description}
                          </p>

                          <div className={styles.home__featuredStack}>
                            {Array.isArray(featuredProject.stack) && featuredProject.stack.map((s: string) => (
                              <Tag key={s}>{s}</Tag>
                            ))}
                          </div>

                          <div className={styles.home__featuredCTA}>
                            READ OUTPUT <ArrowRight size={14} />
                          </div>
                        </div>
                      </div>
                    </a>
                  </article>
                </motion.div>
              )}

              <div className={styles.home__projectGrid}>
                {projects.slice(1).map((project, i) => (
                  <motion.div
                    key={project.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <a href={`/projects/${project.slug}`} className={styles.home__projectLink}>
                    <article className={styles.home__projectCard}>
                      {project.image ? (
                        <div className={styles.home__projectCardImageContainer}>
                          <img
                            src={project.image}
                            alt={cleanTitle(project.title)}
                            className={styles.home__projectCardImage}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        <div className={styles.home__projectCardCode}>
                           <pre>
                            <code>{project.codeSnippet}</code>
                           </pre>
                        </div>
                      )}

                      <div className={styles.home__projectCardBody}>
                        <div className={styles.home__projectCardMeta}>
                           <span className={clsx(project.slug === 'aura-meditation' ? 'tertiary-text' : 'primary-text')}>
                             {project.slug === 'aura-meditation' ? "🗏" : "⟡"}
                           </span> {project.year}
                        </div>

                        <h3 className={styles.home__projectCardTitle}>
                          {cleanTitle(project.title)}
                        </h3>

                        <div className={styles.home__projectCardDetails}>
                          {project.role && <KeyValue k="Role" v={project.role} />}
                          {project.impact && <KeyValue k="Impact" v={project.impact} />}
                          {project.type && <KeyValue k="Type" v={project.type} />}
                          {project.status && <KeyValue k="Status" v={project.status} />}
                        </div>

                        <div className={styles.home__projectCardFooter}>
                           <div className={styles.home__projectCardLink}>
                              {project.slug === 'aura-meditation' ? 'EXECUTE' : 'VIEW LOG'}
                              <span>
                                {project.slug === 'aura-meditation' ? <ExternalLink size={12} /> : <RotateCcw size={12} />}
                              </span>
                           </div>
                        </div>
                      </div>
                    </article>
                    </a>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            /* List View */
            <ul className={styles.home__listView}>
              {projects.map((project, i) => (
                <motion.li
                  key={project.slug}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <a href={`/projects/${project.slug}`} className={styles.home__listItem}>
                    <div className={styles.home__listMeta}>
                      <span>{project.year}</span>
                      <span>{project.type}</span>
                    </div>

                    <h3 className={styles.home__listTitle}>
                      {cleanTitle(project.title)}
                    </h3>

                    {project.role && (
                      <div className={styles.home__listRole}>
                        <KeyValue k="Role" v={project.role} />
                      </div>
                    )}

                    {Array.isArray(project.stack) && project.stack.length > 0 && (
                      <div className={styles.home__listTags}>
                        {project.stack.slice(0, 3).map((s: string) => (
                          <Tag key={s}>{s}</Tag>
                        ))}
                      </div>
                    )}

                    <div className={styles.home__listCTA}>
                      {project.slug === 'aura-meditation' ? 'EXECUTE' : 'VIEW LOG'}
                      {project.slug === 'aura-meditation' ? <ExternalLink size={12} /> : <RotateCcw size={12} />}
                    </div>
                  </a>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
