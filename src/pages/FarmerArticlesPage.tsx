import { useArticleStore } from '@/stores/articleStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, Tag, ChevronRight, ExternalLink, Newspaper, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function FarmerArticlesPage() {
  const articles = useArticleStore((state) => state.articles);

  const agronomistArticles = articles.filter((a) => a.source === 'AGRONOMIST');
  const externalArticles = articles.filter((a) => a.source === 'EXTERNAL');

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Articles" subtitle="Learn from experts and trusted sources" />

      <main className="px-4 py-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="agronomist" className="flex-1">Experts</TabsTrigger>
            <TabsTrigger value="external" className="flex-1">External</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {articles.length === 0 ? (
              <EmptyState />
            ) : (
              articles.map((article) => (
                <ArticleListItem key={article.id} article={article} />
              ))
            )}
          </TabsContent>

          <TabsContent value="agronomist" className="space-y-4">
            {agronomistArticles.length === 0 ? (
              <EmptyState type="agronomist" />
            ) : (
              agronomistArticles.map((article) => (
                <ArticleListItem key={article.id} article={article} />
              ))
            )}
          </TabsContent>

          <TabsContent value="external" className="space-y-4">
            {externalArticles.length === 0 ? (
              <EmptyState type="external" />
            ) : (
              externalArticles.map((article) => (
                <ArticleListItem key={article.id} article={article} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

interface ArticleListItemProps {
  article: {
    id: string;
    title: string;
    excerpt: string;
    coverImageUrl?: string;
    authorName: string;
    source: 'AGRONOMIST' | 'EXTERNAL';
    externalUrl?: string;
    tags: string[];
    createdAt: Date;
  };
}

function ArticleListItem({ article }: ArticleListItemProps) {
  const isExternal = article.source === 'EXTERNAL';
  const linkPath = isExternal ? article.externalUrl : `/articles/${article.id}`;

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (isExternal && article.externalUrl) {
      return (
        <a href={article.externalUrl} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return <Link to={`/articles/${article.id}`}>{children}</Link>;
  };

  return (
    <CardWrapper>
      <Card className="overflow-hidden hover:shadow-card transition-shadow animate-fade-up">
        <CardContent className="p-0">
          <div className="flex gap-4">
            {article.coverImageUrl && (
              <div className="relative w-24 h-24 flex-shrink-0">
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
            
            <div className={`flex-1 py-3 pr-3 ${!article.coverImageUrl ? 'pl-4' : ''}`}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-medium text-sm line-clamp-2">{article.title}</h3>
                {isExternal ? (
                  <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                )}
              </div>
              
              <p className="text-muted-foreground text-xs mb-2 line-clamp-2">
                {article.excerpt}
              </p>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge variant={isExternal ? 'outline' : 'secondary'} className="text-xs">
                  {isExternal ? 'External' : 'Expert'}
                </Badge>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDistanceToNow(article.createdAt, { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
}

function EmptyState({ type }: { type?: 'agronomist' | 'external' }) {
  return (
    <div className="text-center py-12">
      <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="font-medium mb-2">No articles yet</h3>
      <p className="text-sm text-muted-foreground">
        {type === 'agronomist' 
          ? 'Expert articles will appear here'
          : type === 'external'
          ? 'External articles will be synced automatically'
          : 'Check back later for new articles'}
      </p>
    </div>
  );
}
