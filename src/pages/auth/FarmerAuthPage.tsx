import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/stores/appStore';
import { useToast } from '@/hooks/use-toast';
import { registerUser, loginUser, setAuthToken } from '@/services/authAPIs';

export default function FarmerAuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const { setRole, setUser, setIsAuthenticated } = useAppStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Call register API
        if (!formData.email || !formData.password || !formData.name) {
          toast({
            title: 'Error',
            description: 'Please fill in all fields',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        const response = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'FARMER',
        });

        // Store token and user data
        setAuthToken(response.token);
        setUser({ 
          name: response.user.name, 
          email: response.user.email, 
          role: 'farmer' 
        });
        setRole('farmer');
        setIsAuthenticated(true);
        
        toast({
          title: 'Account created!',
          description: 'Welcome to Smart Agriculture Platform',
        });
        navigate('/');
      } else {
        // Call login API
        const response = await loginUser({
          email: formData.email,
          password: formData.password,
          role: 'FARMER',
        });

        // Store token and user data
        setAuthToken(response.token);
        setUser({ 
          name: response.user.name, 
          email: response.user.email, 
          role: 'farmer' 
        });
        setRole('farmer');
        setIsAuthenticated(true);
        
        toast({
          title: 'Welcome back!',
          description: `Signed in as ${response.user.name}`,
        });
        navigate('/');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-background flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
          <Sprout className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          {isSignUp
            ? 'Join thousands of farmers using AI to protect their crops'
            : 'Sign in to continue to Smart Agriculture'}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  className="pl-10 h-12"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="farmer@test.com"
                className="pl-10 h-12"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="password123"
                className="pl-10 pr-10 h-12"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isSignUp ? 'Create Account' : 'Sign In'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </form>

        {/* Toggle */}
        <p className="mt-6 text-muted-foreground">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary font-medium"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>

        {/* Role switch */}
        <div className="mt-8 pt-6 border-t border-border w-full max-w-sm">
          <p className="text-sm text-muted-foreground text-center mb-3">Are you an agronomist?</p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/auth/agronomist')}
          >
            Sign in as Agronomist
          </Button>
        </div>
      </div>

      {/* Demo credentials */}
      <div className="px-6 py-4 bg-muted/50 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          <strong>Demo:</strong> farmer@test.com / password123
        </p>
      </div>
    </div>
  );
}
