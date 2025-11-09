/**
 * Customer Support Utilities
 * Tools for better customer experience and support
 */

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
}

export interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  views: number;
  helpful: number;
}

/**
 * Generate support ticket from error
 */
export function createSupportTicketFromError(
  error: Error,
  userId: string,
  context?: Record<string, any>
): Omit<SupportTicket, "id" | "createdAt" | "updatedAt"> {
  return {
    userId,
    subject: `Error: ${error.message.substring(0, 100)}`,
    description: `Error occurred: ${error.message}\n\nStack: ${error.stack}\n\nContext: ${JSON.stringify(context, null, 2)}`,
    priority: "high",
    status: "open",
  };
}

/**
 * Search help articles
 */
export function searchHelpArticles(
  query: string,
  articles: HelpArticle[]
): HelpArticle[] {
  const lowerQuery = query.toLowerCase();
  return articles.filter(
    (article) =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.content.toLowerCase().includes(lowerQuery) ||
      article.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get suggested articles based on error
 */
export function getSuggestedArticles(
  error: Error,
  articles: HelpArticle[]
): HelpArticle[] {
  const errorKeywords = error.message.toLowerCase().split(/\s+/);
  return articles
    .filter((article) =>
      errorKeywords.some(
        (keyword) =>
          article.title.toLowerCase().includes(keyword) ||
          article.content.toLowerCase().includes(keyword) ||
          article.tags.some((tag) => tag.toLowerCase().includes(keyword))
      )
    )
    .slice(0, 3);
}
