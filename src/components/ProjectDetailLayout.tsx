import { Database, ArrowRight, Code } from 'lucide-react';
import { Tag } from '@/components/UI';
import Breadcrumb from '@/components/Breadcrumb';

import { formatTitle, cleanTitle } from '@/helpers/text-helpers';
import styles from '@/styles/pages/_project-detail.module.scss';
import MarkdownExportMenu from '@/components/MarkdownExportMenu';
import React from 'react';

interface ExportData {
  content: string;
  metadata: Record<string, unknown>;
  filename: string;
}

interface ProjectDetailLayoutProps {
  project: any;
  headerNode?: React.ReactNode;
  nextLink?: string;
  children?: React.ReactNode;
  exportData?: ExportData;
}

export default function ProjectDetailLayout({ project, headerNode, nextLink, children, exportData }: ProjectDetailLayoutProps) {
  const frontmatter = project;

  return (
    <div className={styles.projectDetail}>
      <div className="page-container">
        {headerNode}

        <Breadcrumb 
          paths={[
            { name: 'projects', href: '/' },
            ...(project.slug?.includes('/') 
              ? project.slug.split('/').slice(0, -1).map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)) 
              : []),
            cleanTitle(frontmatter.title)
          ]} 
        />

        {/* Header Section */}
        <header className={styles.projectDetail__header}>
          <div className={styles.projectDetail__headerInfo}>
            <div className={styles.projectDetail__typeTag}>
              <Database size={14} />
              <span>{frontmatter.type}</span>
            </div>
            <h1 className={styles.projectDetail__title}>
              {formatTitle(frontmatter.title)}
            </h1>
          </div>

          <div className={styles.projectDetail__sidebarHeader}>
             <div className={styles.projectDetail__meta}>
                <div className={styles.projectDetail__metaRow}>
                   <span>STATUS</span>
                   <span className={styles.projectDetail__status}>{frontmatter.status || 'DEPLOYED'}</span>
                </div>
                <div className={styles.projectDetail__infoList}>
                   <div className={styles.projectDetail__infoItem}>
                      <span className={styles.projectDetail__infoItemKey}>Role</span>
                      <span className={styles.projectDetail__infoItemVal}>{frontmatter.role || 'Lead Designer'}</span>
                   </div>
                   <div className={styles.projectDetail__infoItem}>
                      <span className={styles.projectDetail__infoItemKey}>Timeline</span>
                      <span className={styles.projectDetail__infoItemVal}>{frontmatter.timeline || '12 Weeks'}</span>
                   </div>
                   <div className={styles.projectDetail__infoItem}>
                      <span className={styles.projectDetail__infoItemKey}>Client</span>
                      <span className={styles.projectDetail__infoItemVal}>{frontmatter.client || 'Nexus Financial'}</span>
                   </div>
                </div>
             </div>
          </div>
        </header>

        {/* Main Feature Image */}
        {frontmatter.image && (
          <div className={styles.projectDetail__hero}>
            <div className={styles.projectDetail__heroFrame}>
              <img
                src={(() => {
                  const rawImg = frontmatter.image;
                  if (!rawImg) return '';
                  
                  // Limpiar comillas
                  const img = rawImg.replace(/['"]+/g, '');

                  // If it's already an absolute URL (even if corrupted with a prefix)
                  if (img.includes('http')) {
                    const httpIndex = img.indexOf('http');
                    return img.substring(httpIndex);
                  }
                  // Normal local paths
                  return img.startsWith('/') ? img : `/${img}`;
                })()}
                alt={cleanTitle(frontmatter.title)}
                className={styles.projectDetail__heroImage}
                referrerPolicy="no-referrer"
              />
              <div className={styles.projectDetail__liveBadge}>

                 <div className={styles.projectDetail__liveBadgeDot}></div>
                 Live Preview
              </div>
            </div>
          </div>
        )}

        {exportData && <MarkdownExportMenu {...exportData} />}

        <div className={styles.projectDetail__mainGrid}>
          <article className={styles.projectDetail__content}>
            {children}
          </article>

          {/* Sidebar */}
          <aside className={styles.projectDetail__sidebar}>
            <div className={styles.projectDetail__stickyCard}>
               <div className={styles.projectDetail__stickyHeader}>
                  specs.json
               </div>

               <div className={styles.projectDetail__stickyBody}>
                  <div className={styles.projectDetail__stickyTitle}>
                     <Code size={18} />
                     <h3>Technical Specs</h3>
                  </div>

                  <div className={styles.projectDetail__specGroup}>
                     <h4 className={styles.projectDetail__specGroupLabel}>STACK</h4>
                      <div className={styles.projectDetail__tagStack}>
                        {Array.isArray(frontmatter.stack) ? frontmatter.stack.map((s: string) => <Tag key={s}>{s}</Tag>) : <Tag>{frontmatter.stack}</Tag>}
                     </div>
                  </div>

                  {frontmatter.codeSnippet && (
                    <div className={styles.projectDetail__specGroup}>
                       <h4 className={styles.projectDetail__specGroupLabel}>CODE BLUERPINT</h4>
                       <div className={styles.projectDetail__codeCard}>
                          <pre className={styles.projectDetail__codePre}>
                           <code>{frontmatter.codeSnippet}</code>
                          </pre>
                       </div>
                    </div>
                  )}
               </div>
            </div>

            {nextLink ? (
              <a href={nextLink} className={styles.projectDetail__nextBtn}>
                 NEXT PROJECT <ArrowRight size={18} />
              </a>
            ) : (
              <button className={styles.projectDetail__nextBtn}>
                 NEXT PROJECT <ArrowRight size={18} />
              </button>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
