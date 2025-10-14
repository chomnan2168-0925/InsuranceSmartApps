import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Article } from '@/types';
import { supabase } from '@/lib/supabaseClient';

const IssueBadge = ({ text, level }: { text: string, level: 'error' | 'warning' }) => {
  const colorClass = level === 'error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
  return <p className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block ${colorClass}`}>{text}</p>;
};

const ContentAuditTool = () => {
  const [articlesWithIssues, setArticlesWithIssues] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runAudit = async () => {
      setLoading(true);
      const { data: articles, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'Published');

      if (articles) {
        const issues = articles.filter(a => {
          const titleLength = a.title.length;
          const description = a.metaDescription || '';
          const keyword = a.targetKeyword || '';
          const hasTitleIssue = titleLength > 70 || titleLength < 40;
          const hasDescriptionIssue = description.length > 160 || description.length < 70;
          const keywordNotInTitle = keyword && !a.title.toLowerCase().includes(keyword.toLowerCase());
          return hasTitleIssue || hasDescriptionIssue || keywordNotInTitle;
        }).slice(0, 10);
        setArticlesWithIssues(issues);
      }
      setLoading(false);
    };
    runAudit();
  }, []);

  const IssueList = ({ article }: { article: Article }) => {
    const titleLength = article.title.length;
    const description = article.metaDescription || '';
    const keyword = article.targetKeyword || '';
    const issues: JSX.Element[] = [];

    // Check title length
    if (titleLength > 70) {
      issues.push(<IssueBadge key="title-long" text="Title too long (>70 chars)" level="warning" />);
    } else if (titleLength < 40) {
      issues.push(<IssueBadge key="title-short" text="Title too short (<40 chars)" level="warning" />);
    }

    // Check description length
    if (description.length > 160) {
      issues.push(<IssueBadge key="desc-long" text="Meta description too long (>160 chars)" level="warning" />);
    } else if (description.length < 70) {
      issues.push(<IssueBadge key="desc-short" text="Meta description too short (<70 chars)" level="warning" />);
    }

    // Check keyword in title
    if (keyword && !article.title.toLowerCase().includes(keyword.toLowerCase())) {
      issues.push(<IssueBadge key="keyword-missing" text="Target keyword not in title" level="error" />);
    }

    // FIXED: Added return statement
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {issues}
      </div>
    );
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-navy-blue mb-4">On-Page SEO Content Audit</h3>
      <p className="text-sm text-gray-600 mb-4">A prioritized list of published articles from the database with potential on-page SEO improvements.</p>
      
      <div className="border rounded-lg">
        {loading ? (
          <p className="p-4 text-center">Running audit on live articles...</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {articlesWithIssues.length > 0 ? (
              articlesWithIssues.map(article => (
                <li key={article.slug} className="p-3">
                  <Link
                    href={`/admin0925/content/${article.slug}`}
                    className="text-navy-blue hover:underline font-semibold"
                  >
                    {article.title}
                  </Link>
                  <IssueList article={article} />
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-gray-500">
                No major SEO issues found in your published articles. Great job!
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ContentAuditTool;