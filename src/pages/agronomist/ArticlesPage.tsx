import { PageHeader } from '@/components/layout/PageHeader';
import { ArticleCard } from '@/components/agronomist/ArticleCard';
import { useArticleStore } from '@/stores/articleStore';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ArticlesPage() {
  const { getMyArticles } = useArticleStore();
  const myArticles = getMyArticles();

  return (
    <div className="min-h-screen pb-20">
      <PageHeader 
        title="My Articles" 
        action={
          <Button size="sm" asChild>
            <Link to="/agronomist/articles/new">
              <Plus className="w-4 h-4 mr-1" />
              New
            </Link>
          </Button>
        }
      />

      <main className="p-4 space-y-4">
        {myArticles.length === 0 ? (
          <div className="bg-muted/50 rounded-xl p-8 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">No articles yet</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Share your expertise with farmers by writing educational articles.
            </p>
            <Button asChild>
              <Link to="/agronomist/articles/new">
                <Plus className="w-4 h-4 mr-1" />
                Write Article
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {myArticles.map((article) => (
              <ArticleCard key={article.id} article={article} editMode />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
