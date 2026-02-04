import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Mail, Lock, User, Eye, EyeOff, ArrowRight, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/stores/appStore';
import { useToast } from '@/hooks/use-toast';

// Mock credentials for testing
const MOCK_AGRONOMIST = {
  email: 'agronomist@test.com',
  password: 'password123',
  name: 'Dr. Sarah Green',
};

export default function AgronomistAuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialties: '',
    experience: '',
  });

  const navigate = useNavigate();
  const { setRole, setUser, setIsAuthenticated } = useAppStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (isSignUp) {
      // Mock sign up
      if (formData.email && formData.password && formData.name) {
        setUser({ name: formData.name, email: formData.email, role: 'agronomist' });
        setRole('agronomist');
        setIsAuthenticated(true);
        toast({
          title: 'Account created!',
          description: 'Welcome to the Agronomist Portal',
        });
        navigate('/agronomist');
      } else {
        toast({
          title: 'Error',
          description: 'Please fill in all required fields',
          variant: 'destructive',
        });
      }
    } else {
      // Mock sign in
      if (formData.email === MOCK_AGRONOMIST.email && formData.password === MOCK_AGRONOMIST.password) {
        setUser({ name: MOCK_AGRONOMIST.name, email: MOCK_AGRONOMIST.email, role: 'agronomist' });
        setRole('agronomist');
        setIsAuthenticated(true);
        toast({
          title: 'Welcome back!',
          description: `Signed in as ${MOCK_AGRONOMIST.name}`,
        });
        navigate('/agronomist');
      } else {
        toast({
          title: 'Invalid credentials',
          description: 'Use agronomist@test.com / password123',
          variant: 'destructive',
        });
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/20 via-background to-background flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-20 h-20 rounded-full bg-accent/30 flex items-center justify-center mb-6">
          <Stethoscope className="w-10 h-10 text-accent-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {isSignUp ? 'Join as Agronomist' : 'Agronomist Portal'}
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          {isSignUp
            ? 'Help farmers protect their crops with your expertise'
            : 'Sign in to review diagnoses and help farmers'}
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
                  placeholder="Dr. Your Name"
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
                placeholder="agronomist@test.com"
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

          {isSignUp && (
            <>
              <div className="space-y-2">
                <Label htmlFor="specialties">Specialties</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Textarea
                    id="specialties"
                    placeholder="e.g., Tomato diseases, Rice cultivation, Organic farming"
                    className="pl-10 min-h-[80px]"
                    value={formData.specialties}
                    onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  placeholder="5"
                  className="h-12"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                />
              </div>
            </>
          )}

          <Button type="submit" className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
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
          <p className="text-sm text-muted-foreground text-center mb-3">Are you a farmer?</p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/auth/farmer')}
          >
            Sign in as Farmer
          </Button>
        </div>
      </div>

      {/* Demo credentials */}
      <div className="px-6 py-4 bg-muted/50 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          <strong>Demo:</strong> agronomist@test.com / password123
        </p>
      </div>
    </div>
  );
}
