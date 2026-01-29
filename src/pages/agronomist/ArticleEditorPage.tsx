import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useArticleStore } from '@/stores/articleStore';
import { Save, Eye, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';

export default function ArticleEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addArticle, updateArticle, deleteArticle, getArticle } = useArticleStore();

  const isEditing = !!id;
  const existingArticle = isEditing ? getArticle(id) : null;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingArticle) {
      setTitle(existingArticle.title);
      setContent(existingArticle.content);
      setExcerpt(existingArticle.excerpt);
      setCoverImageUrl(existingArticle.coverImageUrl || '');
      setTags(existingArticle.tags.join(', '));
    }
  }, [existingArticle]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!content.trim()) {
      toast.error('Please enter content');
      return;
    }
    if (!excerpt.trim()) {
      toast.error('Please enter an excerpt');
      return;
    }

    setIsSubmitting(true);

    const articleData = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim(),
      coverImageUrl: coverImageUrl.trim() || undefined,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (isEditing && id) {
        updateArticle(id, articleData);
        toast.success('Article updated successfully');
      } else {
        addArticle(articleData);
        toast.success('Article published successfully');
      }
      navigate('/agronomist/articles');
    } catch (error) {
      toast.error('Failed to save article');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (id && window.confirm('Are you sure you want to delete this article?')) {
      deleteArticle(id);
      toast.success('Article deleted');
      navigate('/agronomist/articles');
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <PageHeader 
        title={isEditing ? 'Edit Article' : 'New Article'} 
        showBack
        action={
          isEditing && (
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          )
        }
      />

      <main className="p-4 space-y-4">
        {/* Cover Image */}
        <Card>
          <CardContent className="p-4">
            <Label className="text-sm">Cover Image URL (Optional)</Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                placeholder="https://example.com/image.jpg"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
              />
              {coverImageUrl && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCoverImageUrl('')}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            {coverImageUrl && (
              <div className="mt-3 relative aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={coverImageUrl}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
            )}
            {!coverImageUrl && (
              <div className="mt-3 aspect-video rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center text-muted-foreground">
                <ImageIcon className="w-8 h-8 mb-2" />
                <span className="text-sm">Add a cover image URL</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Title */}
        <Card>
          <CardContent className="p-4">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter article title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1.5"
            />
          </CardContent>
        </Card>

        {/* Excerpt */}
        <Card>
          <CardContent className="p-4">
            <Label htmlFor="excerpt">Excerpt *</Label>
            <p className="text-xs text-muted-foreground mb-1.5">
              A brief summary that appears in article lists
            </p>
            <Textarea
              id="excerpt"
              placeholder="Write a short summary..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="min-h-[80px]"
            />
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardContent className="p-4">
            <Label htmlFor="content">Content *</Label>
            <p className="text-xs text-muted-foreground mb-1.5">
              Supports Markdown formatting
            </p>
            <Textarea
              id="content"
              placeholder="Write your article content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardContent className="p-4">
            <Label htmlFor="tags">Tags</Label>
            <p className="text-xs text-muted-foreground mb-1.5">
              Separate tags with commas
            </p>
            <Input
              id="tags"
              placeholder="e.g., tomato, disease prevention, organic"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </CardContent>
        </Card>
      </main>

      {/* Action Buttons */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background border-t border-border">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate('/agronomist/articles')}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>
    </div>
  );
}
