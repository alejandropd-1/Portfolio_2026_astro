/**
 * GraphQL query para el Portfolio Dashboard de TinaCMS.
 * Obtiene todos los proyectos y páginas en un solo request.
 */
export const DASHBOARD_QUERY = `
  query DashboardData {
    projectsConnection {
      totalCount
      edges {
        node {
          title
          year
          client
          type
          description
          stack
          image
          showInPortfolio
          showInResume
          order
          _sys {
            filename
            relativePath
          }
        }
      }
    }
    pagesConnection {
      totalCount
      edges {
        node {
          ... on Document {
            _sys {
              filename
              relativePath
            }
          }
        }
      }
    }
  }
`;

export interface ProjectNode {
  title: string;
  year?: string;
  client?: string;
  type?: string;
  description?: string;
  stack?: string[];
  image?: string;
  showInPortfolio?: boolean;
  showInResume?: boolean;
  order?: number;
  _sys: {
    filename: string;
    relativePath: string;
  };
}

export interface PageNode {
  _sys: {
    filename: string;
    relativePath: string;
  };
}

export interface DashboardData {
  projectsConnection: {
    totalCount: number;
    edges: { node: ProjectNode }[];
  };
  pagesConnection: {
    totalCount: number;
    edges: { node: PageNode }[];
  };
}
