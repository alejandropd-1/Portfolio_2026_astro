'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Download, ChevronRight, Check, X, Folder } from 'lucide-react';

import { SyntaxCard, Tag, KeyValue } from '@/components/UI';
import styles from '@/styles/pages/_resume.module.scss';
import { clsx } from 'clsx';
import { formatTitle } from '@/helpers/text-helpers';
import Breadcrumb from '@/components/Breadcrumb';
import MarkdownExportMenu from '@/components/MarkdownExportMenu';

interface ExportData {
  content: string;
  metadata: Record<string, unknown>;
  filename: string;
}


const DEFAULT_SKILLS = [
  { category: 'DESIGN ARCHITECTURE', items: [
    { name: 'Design Systems', value: '95%' },
    { name: 'Interaction Design', value: '90%' },
    { name: 'Wireframing', value: '95%' },
    { name: 'Prototyping (Figma)', value: '98%' },
  ]},
  { category: 'FRONT-END EXECUTION', items: [
    { name: 'HTML/Semantic DOM', value: '95%' },
    { name: 'CSS/SASS/Tokens', value: '98%' },
    { name: 'JavaScript (ES6+)', value: '85%' },
    { name: 'React Basics', value: '75%' },
  ]},
  { category: 'METHODOLOGIES', items: [
    { name: 'Agile/Scrum', value: 'Yes' },
    { name: 'Atomic Design', value: 'Yes' },
    { name: 'A/B Testing', value: 'Yes' },
    { name: 'WCAG Accessibility', value: 'Yes' },
  ]}
];

const DEFAULT_EDUCATION = {
  degree: 'Bachelor of Fine Arts in Interaction Design',
  institution: 'California College of the Arts',
  year: 'Class of 2015',
};

export default function ClientResume({ frontmatter, children, jobs, exportData }: { frontmatter: any, children?: React.ReactNode, jobs: any[], exportData?: ExportData }) {
  const experiences = useMemo(() => {
    return jobs.map(job => ({
      role: job.role || job.title,
      company: job.client,
      period: job.year,
      description: job.description,
      stack: job.stack || [],
      type: job.type,
      points: job.points
    }));
  }, [jobs]);

  // Use CMS data if available, fall back to defaults
  const skills = (frontmatter.skillGroups && frontmatter.skillGroups.length > 0)
    ? frontmatter.skillGroups
    : DEFAULT_SKILLS;

  const education = frontmatter.education?.degree
    ? frontmatter.education
    : DEFAULT_EDUCATION;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract unique tags from all experiences dynamically
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    experiences.forEach(exp => exp.stack.forEach(s => tags.add(s.toUpperCase())));
    return Array.from(tags).sort();
  }, []);

  const filteredExperiences = useMemo(() => {
    return experiences.filter(exp => {
      const searchTerms = searchQuery.toLowerCase();
      const matchesSearch = 
        exp.role.toLowerCase().includes(searchTerms) ||
        exp.company.toLowerCase().includes(searchTerms) ||
        exp.description?.toLowerCase().includes(searchTerms) ||
        exp.stack.some(s => s.toLowerCase().includes(searchTerms));

      const matchesTags = activeTags.length === 0 || 
        activeTags.every(tag => exp.stack.some(s => s.toUpperCase() === tag.toUpperCase()));

      return matchesSearch && matchesTags;
    });
  }, [searchQuery, activeTags]);

  const toggleTag = (tag: string) => {
    setActiveTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearAll = () => {
    setSearchQuery('');
    setActiveTags([]);
  };

  const downloadATS = () => {
    let cvContent = `ALEXANDRO DELGADO - UX/UI Web Designer\n\n`;
    cvContent += `Location: Buenos Aires, Argentina\nEmail: hello@aledesign.com\n\n`;
    cvContent += `EXPERIENCE\n\n`;
    
    filteredExperiences.forEach(exp => {
      cvContent += `${exp.role} at ${exp.company} (${exp.period})\n`;
      if (exp.type) cvContent += `Type: ${exp.type}\n`;
      if (exp.description) cvContent += `${exp.description}\n`;
      if (exp.stack && exp.stack.length > 0) cvContent += `Tech Stack: ${exp.stack.join(', ')}\n`;
      cvContent += `\n`;
    });

    const blob = new Blob([cvContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Alejandro_Delgado_ATS_CV.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCustom = () => {
    window.print();
  };

  if (!mounted) return null;

  return (
    <div className="page-container">
      <div className={styles.resume}>
        <Breadcrumb paths={['resume']} />

        {/* Search Bar Section - Terminal Style */}
        <section className={styles.resume__search}>
          <p className={styles.resume__searchLabel}>Refine your search</p>
          
          <div className={styles.resume__terminal}>
            <div className={styles.resume__terminalHeader}>
              <div className={styles.resume__terminalDots}>
                <span className={styles.resume__dotRed}></span>
                <span className={styles.resume__dotYellow}></span>
                <span className={styles.resume__dotGreen}></span>
              </div>
              <div className={styles.resume__terminalPath}>
                <Folder size={12} />
                <span>~/aledesign/query_db.sh</span>
              </div>
            </div>

            <div className={styles.resume__terminalBody}>
              <div className={styles.resume__searchBox}>
                <span className={styles.resume__prompt}>{">"}</span>
                <input 
                  type="text" 
                  placeholder="Search for keywords, skills, or roles..."
                  className={styles.resume__input}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className={styles.resume__filters}>
                <div className={styles.resume__tags}>
                  {availableTags.map(tag => (
                    <button key={tag} onClick={() => toggleTag(tag)} className={styles.resume__tagBtn}>
                      <Tag active={activeTags.includes(tag)}>{tag}</Tag>
                    </button>
                  ))}
                  {(searchQuery || activeTags.length > 0) && (
                    <button onClick={clearAll} className={styles.resume__clearAll}>
                      Clear All
                    </button>
                  )}
                </div>
                <div className={styles.resume__downloads}>
                  <button className={styles.resume__downloadBtn} onClick={downloadATS}>
                    <Download size={14} /> ATS CV
                  </button>
                  <button className={styles.resume__downloadBtn} onClick={downloadCustom}>
                    <Download size={14} /> CUSTOM CV
                  </button>
                  {exportData && <MarkdownExportMenu {...exportData} />}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Resume Heading */}
        <header className={styles.resume__hero}>
          <h1>
            {formatTitle(frontmatter.title || "UX/UI // Web Designer")}
          </h1>
          <div className={styles.resume__subtitle}>
            {children || (
              <p>
                Bridging the gap between conceptual editorial design and robust front-end architectures. Specializing in design systems and high-fidelity prototypes.
              </p>
            )}
          </div>
          <div className={styles.resume__meta}>
            <div className={styles.resume__metaGroup}>
              <span>Location =</span>
              <span>{frontmatter.location || "Buenos Aires, Argentina"};</span>
            </div>
            <div className={clsx(styles.resume__metaGroup, styles['resume__metaGroup--primary'])}>
              <span>Email =</span>
              <span>{frontmatter.email || "hello@aledesign.com"};</span>
            </div>
            <div className={styles.resume__metaGroup}>
              <span>Status =</span>
              <span>{frontmatter.status || "Available for new opportunities"};</span>
            </div>
          </div>
        </header>

        {/* Sections */}
        <div className={styles.resume__sectionGroup}>
          {/* 01. Experience Map */}
          <section className={styles.resume__section}>
            <div className={styles.resume__sectionHeader}>
              <span>01.</span>
              <h2>Experience Map</h2>
            </div>

            <div className={styles.resume__experienceList}>
              <AnimatePresence mode='popLayout'>
                {filteredExperiences.map((exp) => (
                  <motion.div 
                    key={exp.company + exp.role}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <SyntaxCard className={styles.resume__expCard}>
                      <div className={styles.resume__expCardHeader}>
                        <div>
                          <h3 className={styles.resume__expCardTitle}>{exp.role}</h3>
                          <div className={styles.resume__expCardCompany}>
                            <span>{exp.type ? exp.type : 'Company'} =</span>
                            <span>{exp.company}</span>
                          </div>
                        </div>
                        <Tag active>{exp.period}</Tag>
                      </div>

                      {exp.description && (
                         <>
                          <p className={styles.resume__expCardDesc}>
                            {exp.description}
                          </p>
                          {exp.points && (
                            <ul className={styles.resume__expCardPoints}>
                              {exp.points.map((point, idx) => (
                                <li key={idx} className={styles.resume__expCardPoint}>
                                  <span><ChevronRight size={14} /></span>
                                  {point}
                                </li>
                              ))}
                            </ul>
                          )}
                          <div className={styles.resume__tagStack}>
                            {exp.stack.map(s => (
                              <Tag key={s} active={activeTags.includes(s.toUpperCase())}>{s}</Tag>
                            ))}
                          </div>
                         </>
                      )}
                    </SyntaxCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* 02. System Constraints */}
          <section className={styles.resume__section}>
            <div className={styles.resume__sectionHeader}>
              <span>02.</span>
              <h2>System Constraints</h2>
            </div>

            <div className={styles.resume__skillGrid}>
              {skills.map((skillGroup, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className={styles.resume__skillCard}>
                    <h4 className={styles.resume__skillCardCategory}>{skillGroup.category}</h4>
                    <div className={styles.resume__skillCardItems}>
                      {skillGroup.items.map((item, idx) => (
                        <div key={idx} className={styles.resume__skillCardItem}>
                          <span className={styles.resume__skillCardItemName}>{item.name}</span>
                          <span className={styles.resume__skillCardItemVal}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* 03. Base Compilation */}
          <section className={styles.resume__footer}>
            <div className={styles.resume__sectionHeader}>
              <span>03.</span>
              <h2>Base Compilation</h2>
            </div>

            <SyntaxCard className={styles.resume__eduCard}>
               <div className={styles.resume__eduCardHeader}>
                  <h3>{education.degree}</h3>
                  <span>{education.year}</span>
               </div>
               <div className={styles.resume__expCardCompany}>
                  <span>Institution =</span>
                  <span>{education.institution};</span>
               </div>
            </SyntaxCard>
          </section>
        </div>
      </div>
    </div>
  );
}
