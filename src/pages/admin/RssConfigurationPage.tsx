import { useEffect, useState } from 'react';
import { useAdminStore } from '@/stores/adminStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Edit2, CheckCircle, XCircle, RefreshCw, Play, Clock, Image as ImageIcon, Settings, Rss, Tag, Type, Calendar } from 'lucide-react';

export default function RssConfigurationPage() {
  const {
    rssConfig,
    loadRssConfigurations,
    addRssFeed,
    removeRssFeed,
    updateRssFeed,
    toggleFeedActive,
    addKeyword,
    removeKeyword,
    addTagKeyword,
    removeTagKeyword,
    addFallbackImage,
    removeFallbackImage,
    validateFeedUrl,
    previewSync,
    triggerManualSync,
    refreshScheduleInfo,
  } = useAdminStore();

  const { toast } = useToast();

  // Local state for forms
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [newFeedAuthor, setNewFeedAuthor] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newTagKeyword, setNewTagKeyword] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [validatingUrl, setValidatingUrl] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [editFeedIndex, setEditFeedIndex] = useState<number | null>(null);
  const [editFeedUrl, setEditFeedUrl] = useState('');
  const [editFeedAuthor, setEditFeedAuthor] = useState('');

  useEffect(() => {
    loadRssConfigurations();
  }, [loadRssConfigurations]);

  const handleAddFeed = async () => {
    if (!newFeedUrl.trim() || !newFeedAuthor.trim()) {
      toast({
        title: 'Error',
        description: 'Both URL and Author Name are required',
        variant: 'destructive',
      });
      return;
    }

    setValidatingUrl(true);
    try {
      const validation = await validateFeedUrl(newFeedUrl);
      if (!validation.valid) {
        toast({
          title: 'Invalid RSS Feed',
          description: validation.error || 'The provided URL is not a valid RSS feed',
          variant: 'destructive',
        });
        setValidatingUrl(false);
        return;
      }

      await addRssFeed({
        url: newFeedUrl.trim(),
        authorName: newFeedAuthor.trim(),
        isActive: true,
      });

      toast({
        title: 'Success',
        description: `Added feed: ${validation.feedTitle || newFeedAuthor}`,
      });

      setNewFeedUrl('');
      setNewFeedAuthor('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add RSS feed',
        variant: 'destructive',
      });
    } finally {
      setValidatingUrl(false);
    }
  };

  const handleRemoveFeed = async (index: number) => {
    try {
      await removeRssFeed(index);
      toast({
        title: 'Success',
        description: 'RSS feed removed',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove RSS feed',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateFeed = async () => {
    if (editFeedIndex === null) return;

    try {
      const validation = await validateFeedUrl(editFeedUrl);
      if (!validation.valid) {
        toast({
          title: 'Invalid RSS Feed',
          description: validation.error || 'The provided URL is not a valid RSS feed',
          variant: 'destructive',
        });
        return;
      }

      await updateRssFeed(editFeedIndex, {
        url: editFeedUrl,
        authorName: editFeedAuthor,
      });

      toast({
        title: 'Success',
        description: 'RSS feed updated',
      });

      setEditFeedIndex(null);
      setEditFeedUrl('');
      setEditFeedAuthor('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update RSS feed',
        variant: 'destructive',
      });
    }
  };

  const handleAddKeyword = async (keyword: string, isTag: boolean = false) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    const existingKeywords = isTag ? rssConfig.tagKeywords : rssConfig.keywords;
    if (existingKeywords.some(k => k.toLowerCase() === trimmed.toLowerCase())) {
      toast({
        title: 'Duplicate Keyword',
        description: 'This keyword already exists',
        variant: 'destructive',
      });
      return;
    }

    if (trimmed.length > 100) {
      toast({
        title: 'Keyword Too Long',
        description: 'Keywords must be 100 characters or less',
        variant: 'destructive',
      });
      return;
    }

    const maxKeywords = 200;
    if (existingKeywords.length >= maxKeywords) {
      toast({
        title: 'Limit Reached',
        description: `Maximum ${maxKeywords} keywords allowed`,
        variant: 'destructive',
      });
      return;
    }

    try {
      if (isTag) {
        await addTagKeyword(trimmed);
        setNewTagKeyword('');
      } else {
        await addKeyword(trimmed);
        setNewKeyword('');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add keyword',
        variant: 'destructive',
      });
    }
  };

  const handleAddImage = async () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;

    if (!trimmed.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      toast({
        title: 'Invalid Image URL',
        description: 'URL must end with .jpg, .jpeg, .png, .gif, or .webp',
        variant: 'destructive',
      });
      return;
    }

    if (rssConfig.fallbackImages.length >= 100) {
      toast({
        title: 'Limit Reached',
        description: 'Maximum 100 images allowed',
        variant: 'destructive',
      });
      return;
    }

    try {
      await addFallbackImage(trimmed);
      setNewImageUrl('');
      toast({
        title: 'Success',
        description: 'Image added',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add image',
        variant: 'destructive',
      });
    }
  };

  const handlePreviewSync = async () => {
    try {
      const result = await previewSync();
      setPreviewData(result);
      setShowPreviewDialog(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to preview sync',
        variant: 'destructive',
      });
    }
  };

  const handleTriggerSync = async () => {
    try {
      await triggerManualSync();
      toast({
        title: 'Sync Triggered',
        description: 'RSS sync has been triggered. Check server logs for progress.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to trigger sync',
        variant: 'destructive',
      });
    }
  };

  const handleSchedulingChange = async (key: string, value: any) => {
    try {
      await useAdminStore.getState().updateRssConfiguration(key, value);
      await refreshScheduleInfo();
      toast({
        title: 'Success',
        description: 'Scheduling updated',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update scheduling',
        variant: 'destructive',
      });
    }
  };

  const formatNextSyncTime = (date?: Date) => {
    if (!date) return 'Not scheduled';
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    let timeAgo = '';
    if (diffDays > 0) {
      timeAgo = `in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      timeAgo = `in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    } else {
      timeAgo = 'soon';
    }

    return `${date.toLocaleString()} (${timeAgo})`;
  };

  if (rssConfig.isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (rssConfig.error) {
    return (
      <Alert variant="destructive" className="m-6">
        <XCircle className="h-4 w-4" />
        <AlertDescription>{rssConfig.error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">RSS Configuration</h1>
          <p className="text-muted-foreground mt-2">
            Manage RSS feed sources, keywords, images, and scheduling for article scraping
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreviewSync} disabled={rssConfig.isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Test Sync
          </Button>
          <Button onClick={handleTriggerSync} disabled={rssConfig.isLoading || !rssConfig.scheduling.syncEnabled}>
            <Play className="mr-2 h-4 w-4" />
            Trigger Sync Now
          </Button>
        </div>
      </div>

      <Tabs defaultValue="feeds" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feeds">
            <Rss className="mr-2 h-4 w-4" />
            Feeds
          </TabsTrigger>
          <TabsTrigger value="keywords">
            <Tag className="mr-2 h-4 w-4" />
            Keywords
          </TabsTrigger>
          <TabsTrigger value="images">
            <ImageIcon className="mr-2 h-4 w-4" />
            Images
          </TabsTrigger>
          <TabsTrigger value="scheduling">
            <Calendar className="mr-2 h-4 w-4" />
            Scheduling
          </TabsTrigger>
        </TabsList>

        {/* Feeds Tab */}
        <TabsContent value="feeds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>RSS Feed Sources</CardTitle>
              <CardDescription>
                Add, edit, or remove RSS feed sources for article scraping
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="feed-url">Feed URL</Label>
                  <Input
                    id="feed-url"
                    placeholder="https://example.com/feed.xml"
                    value={newFeedUrl}
                    onChange={(e) => setNewFeedUrl(e.target.value)}
                    disabled={validatingUrl}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="feed-author">Author Name</Label>
                  <Input
                    id="feed-author"
                    placeholder="Feed Source Name"
                    value={newFeedAuthor}
                    onChange={(e) => setNewFeedAuthor(e.target.value)}
                    disabled={validatingUrl}
                  />
                </div>
                <Button
                  onClick={handleAddFeed}
                  disabled={validatingUrl || !newFeedUrl.trim() || !newFeedAuthor.trim()}
                  className="mt-6"
                >
                  {validatingUrl ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Add Feed
                </Button>
              </div>

              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium">Status</th>
                      <th className="p-3 text-left font-medium">Author Name</th>
                      <th className="p-3 text-left font-medium">URL</th>
                      <th className="p-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rssConfig.feeds.map((feed, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3">
                          {editFeedIndex === index ? (
                            <span className="text-sm text-muted-foreground">Editing...</span>
                          ) : (
                            <Switch
                              checked={feed.isActive}
                              onCheckedChange={() => toggleFeedActive(index)}
                            />
                          )}
                        </td>
                        <td className="p-3">
                          {editFeedIndex === index ? (
                            <Input
                              value={editFeedAuthor}
                              onChange={(e) => setEditFeedAuthor(e.target.value)}
                              className="h-8"
                            />
                          ) : (
                            <div className="font-medium">{feed.authorName}</div>
                          )}
                        </td>
                        <td className="p-3">
                          {editFeedIndex === index ? (
                            <Input
                              value={editFeedUrl}
                              onChange={(e) => setEditFeedUrl(e.target.value)}
                              className="h-8 text-sm"
                            />
                          ) : (
                            <div className="text-sm text-muted-foreground max-w-md truncate">
                              {feed.url}
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {editFeedIndex === index ? (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditFeedIndex(null);
                                  setEditFeedUrl('');
                                  setEditFeedAuthor('');
                                }}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                              <Button size="sm" onClick={handleUpdateFeed}>
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditFeedIndex(index);
                                  setEditFeedUrl(feed.url);
                                  setEditFeedAuthor(feed.authorName);
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveFeed(index)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rssConfig.feeds.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    No RSS feeds configured. Add your first feed above.
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Total: {rssConfig.feeds.length} / 50 feeds</span>
                <span>Active: {rssConfig.feeds.filter(f => f.isActive).length}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Keywords Tab */}
        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Keywords Management</CardTitle>
              <CardDescription>
                Configure keywords for article relevance filtering and tag extraction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Relevance Keywords */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Relevance Keywords
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Articles must contain at least one of these keywords to be considered relevant
                    </p>
                  </div>
                  <Badge variant="outline">
                    {rssConfig.keywords.length} / 200
                  </Badge>
                </div>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Add relevance keyword..."
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword(newKeyword, false)}
                  />
                  <Button
                    onClick={() => handleAddKeyword(newKeyword, false)}
                    disabled={!newKeyword.trim() || rssConfig.keywords.length >= 200}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {rssConfig.keywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="group"
                    >
                      {keyword}
                      <button
                        onClick={() => removeKeyword(index)}
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XCircle className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {rssConfig.keywords.length === 0 && (
                    <span className="text-sm text-muted-foreground">
                      No relevance keywords configured
                    </span>
                  )}
                </div>
              </div>

              {/* Tag Keywords */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Tag Keywords
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Keywords to extract as article tags
                    </p>
                  </div>
                  <Badge variant="outline">
                    {rssConfig.tagKeywords.length} / 200
                  </Badge>
                </div>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Add tag keyword..."
                    value={newTagKeyword}
                    onChange={(e) => setNewTagKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword(newTagKeyword, true)}
                  />
                  <Button
                    onClick={() => handleAddKeyword(newTagKeyword, true)}
                    disabled={!newTagKeyword.trim() || rssConfig.tagKeywords.length >= 200}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {rssConfig.tagKeywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="group"
                    >
                      {keyword}
                      <button
                        onClick={() => removeTagKeyword(index)}
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XCircle className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {rssConfig.tagKeywords.length === 0 && (
                    <span className="text-sm text-muted-foreground">
                      No tag keywords configured
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fallback Images</CardTitle>
              <CardDescription>
                Configure fallback images for articles without cover images
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddImage()}
                />
                <Button
                  onClick={handleAddImage}
                  disabled={!newImageUrl.trim() || rssConfig.fallbackImages.length >= 100}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {rssConfig.fallbackImages.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={`Fallback ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="225"%3E%3Crect fill="%23f4f4f5" width="400" height="225"/%3E%3Ctext fill="%2371717a" font-family="sans-serif" font-size="14" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFallbackImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="bg-black/50 text-white text-xs p-1 rounded truncate">
                        {imageUrl}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Total: {rssConfig.fallbackImages.length} / 100 images</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scheduling Tab */}
        <TabsContent value="scheduling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduling & Settings</CardTitle>
              <CardDescription>
                Configure RSS sync scheduling and performance settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Master Toggle */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Enable RSS Sync</h3>
                  <p className="text-sm text-muted-foreground">
                    Master switch to enable or disable automatic RSS article synchronization
                  </p>
                </div>
                <Switch
                  checked={rssConfig.scheduling.syncEnabled}
                  onCheckedChange={(checked) => handleSchedulingChange('sync_enabled', checked)}
                />
              </div>

              {/* Next Sync Display */}
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription className="font-medium">
                  {rssConfig.scheduling.syncEnabled ? (
                    <>
                      Next sync: <span className="text-primary font-semibold">
                        {formatNextSyncTime(rssConfig.scheduling.nextSyncTime)}
                      </span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">Sync is disabled</span>
                  )}
                </AlertDescription>
              </Alert>

              {/* Scheduling Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="sync-interval">Sync Interval (hours)</Label>
                  <Input
                    id="sync-interval"
                    type="number"
                    min="1"
                    max="720"
                    value={rssConfig.scheduling.syncIntervalHours}
                    onChange={(e) => handleSchedulingChange('sync_interval_hours', parseInt(e.target.value))}
                    disabled={!rssConfig.scheduling.syncEnabled}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Between 1 hour and 30 days (720 hours)
                  </p>
                </div>

                <div>
                  <Label htmlFor="sync-time">Sync Time (hour)</Label>
                  <Input
                    id="sync-time"
                    type="number"
                    min="0"
                    max="23"
                    value={rssConfig.scheduling.syncTimeHour}
                    onChange={(e) => handleSchedulingChange('sync_time_hour', parseInt(e.target.value))}
                    disabled={!rssConfig.scheduling.syncEnabled}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Hour of day to run sync (0-23)
                  </p>
                </div>
              </div>

              {/* Performance Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold">Performance Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="parser-timeout">Parser Timeout (ms)</Label>
                    <Input
                      id="parser-timeout"
                      type="number"
                      min="1000"
                      max="60000"
                      value={rssConfig.scheduling.parserTimeout}
                      onChange={(e) => handleSchedulingChange('parser_timeout', parseInt(e.target.value))}
                      disabled={!rssConfig.scheduling.syncEnabled}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      RSS fetch timeout (1-60 seconds)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="batch-min">Batch Size Min</Label>
                    <Input
                      id="batch-min"
                      type="number"
                      min="1"
                      max="20"
                      value={rssConfig.scheduling.batchSizeMin}
                      onChange={(e) => handleSchedulingChange('batch_size_min', parseInt(e.target.value))}
                      disabled={!rssConfig.scheduling.syncEnabled}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum articles per sync (1-20)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="batch-max">Batch Size Max</Label>
                    <Input
                      id="batch-max"
                      type="number"
                      min="1"
                      max="20"
                      value={rssConfig.scheduling.batchSizeMax}
                      onChange={(e) => handleSchedulingChange('batch_size_max', parseInt(e.target.value))}
                      disabled={!rssConfig.scheduling.syncEnabled}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum articles per sync (1-20)
                    </p>
                  </div>
                </div>
              </div>

              {/* Schedule Info */}
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Schedule Information
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={rssConfig.scheduling.isScheduled ? 'text-green-600' : 'text-muted-foreground'}>
                      {rssConfig.scheduling.isScheduled ? 'Scheduled' : 'Not Scheduled'}
                    </span>
                  </div>
                  {rssConfig.scheduling.cronExpression && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cron Expression:</span>
                      <code className="text-xs bg-background px-2 py-1 rounded">
                        {rssConfig.scheduling.cronExpression}
                      </code>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sync Preview Results</DialogTitle>
            <DialogDescription>
              {previewData?.message || 'Preview of articles that would be added'}
            </DialogDescription>
          </DialogHeader>
          {previewData && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Articles Found:</span>
                <Badge variant="outline">{previewData.totalArticles}</Badge>
              </div>
              {previewData.articles && previewData.articles.length > 0 ? (
                <div className="space-y-2">
                  {previewData.articles.slice(0, 20).map((article: any, index: number) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg flex items-start gap-3"
                    >
                      <div className={`mt-1 ${article.relevant ? 'text-green-600' : 'text-red-600'}`}>
                        {article.relevant ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{article.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{article.feed}</div>
                        {article.tags && article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {article.tags.slice(0, 3).map((tag: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        View
                      </a>
                    </div>
                  ))}
                  {previewData.articles.length > 20 && (
                    <div className="text-center text-sm text-muted-foreground">
                      Showing 20 of {previewData.articles.length} articles
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No articles found in preview
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
