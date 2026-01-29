import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Article } from '@/types/article';
import { formatDistanceToNow } from 'date-fns';
import { ChevronRight, Calendar, Tag } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  editMode?: boolean;
}

export function ArticleCard({ article, editMode = false }: ArticleCardProps) {
  const linkPath = editMode 
    ? `/agronomist/articles/edit/${article.id}`
    : `/articles/${article.id}`;

  return (
    <Link to={linkPath}>
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
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              </div>
              
              <p className="text-muted-foreground text-xs mb-2 line-clamp-2">
                {article.excerpt}
              </p>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDistanceToNow(article.createdAt, { addSuffix: true })}
                </span>
                {article.tags.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {article.tags[0]}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
