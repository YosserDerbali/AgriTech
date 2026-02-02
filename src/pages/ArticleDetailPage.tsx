import { useParams, Link } from 'react-router-dom';
import { useArticleStore } from '@/stores/articleStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Tag, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ArticleDetailPage() {
  const { id } = useParams();
  const article = useArticleStore((state) => state.getArticle(id || ''));

  if (!article) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <PageHeader title="Article" />
        <div className="px-4 py-12 text-center">
          <p className="text-muted-foreground mb-4">Article not found</p>
          <Link to="/articles">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Simple markdown-like rendering for content
  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      // Handle headers
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-semibold mt-6 mb-3">
            {paragraph.replace('## ', '')}
          </h2>
        );
      }
      if (paragraph.startsWith('# ')) {
        return (
          <h1 key={index} className="text-2xl font-bold mt-6 mb-4">
            {paragraph.replace('# ', '')}
          </h1>
        );
      }
      
      // Handle lists
      if (paragraph.includes('\n- ')) {
        const items = paragraph.split('\n- ').filter(Boolean);
        return (
          <ul key={index} className="list-disc list-inside space-y-2 my-4">
            {items.map((item, i) => (
              <li key={i} className="text-muted-foreground">
                {item.replace(/^- /, '')}
              </li>
            ))}
          </ul>
        );
      }

      // Handle numbered lists
      if (/^\d+\.\s/.test(paragraph)) {
        const items = paragraph.split('\n').filter(Boolean);
        return (
          <ol key={index} className="list-decimal list-inside space-y-2 my-4">
            {items.map((item, i) => (
              <li key={i} className="text-muted-foreground">
                {item.replace(/^\d+\.\s\*\*([^*]+)\*\*:?/, '<strong>$1</strong>:').replace(/\*\*([^*]+)\*\*/g, '')}
                <span dangerouslySetInnerHTML={{ 
                  __html: item.replace(/^\d+\.\s/, '').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                }} />
              </li>
            ))}
          </ol>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="text-muted-foreground leading-relaxed my-4">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader 
        title="Article" 
        leftAction={
          <Link to="/articles">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        }
      />

      <main className="px-4 py-6">
        {/* Cover Image */}
        {article.coverImageUrl && (
          <div className="relative w-full h-48 rounded-lg overflow-hidden mb-6">
            <img
              src={article.coverImageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
        )}

        {/* Title & Meta */}
        <h1 className="text-2xl font-bold mb-4">{article.title}</h1>

        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{article.authorName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDistanceToNow(article.createdAt, { addSuffix: true })}</span>
          </div>
          <Badge variant={article.source === 'EXTERNAL' ? 'outline' : 'secondary'}>
            {article.source === 'EXTERNAL' ? 'External Source' : 'Expert Article'}
          </Badge>
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* External Link */}
        {article.source === 'EXTERNAL' && article.externalUrl && (
          <a
            href={article.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
          >
            <ExternalLink className="w-4 h-4" />
            Read on original source
          </a>
        )}

        {/* Content */}
        <article className="prose prose-sm max-w-none">
          {renderContent(article.content)}
        </article>
      </main>
    </div>
  );
}
