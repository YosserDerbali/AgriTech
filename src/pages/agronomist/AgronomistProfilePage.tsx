import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDiagnosisStore } from '@/stores/diagnosisStore';
import { useArticleStore } from '@/stores/articleStore';
import { 
  User, 
  Mail, 
  Award, 
  FileText, 
  CheckCircle, 
  Clock,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Briefcase
} from 'lucide-react';

const menuItems = [
  { icon: Bell, label: 'Notifications', badge: 3 },
  { icon: Award, label: 'Specialties' },
  { icon: Settings, label: 'Settings' },
  { icon: HelpCircle, label: 'Help & Support' },
  { icon: LogOut, label: 'Sign Out', danger: true },
];

export default function AgronomistProfilePage() {
  const { diagnoses } = useDiagnosisStore();
  const { getMyArticles } = useArticleStore();

  const approvedByMe = diagnoses.filter((d) => d.status === 'APPROVED').length;
  const myArticles = getMyArticles();

  return (
    <div className="min-h-screen pb-20">
      <PageHeader title="Profile" />

      <main className="p-4 space-y-4">
        {/* Profile Card */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-accent to-accent/70 h-20" />
          <CardContent className="relative pt-0 pb-4">
            <div className="absolute -top-10 left-4">
              <div className="w-20 h-20 rounded-full bg-background p-1">
                <div className="w-full h-full rounded-full bg-accent/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-accent" />
                </div>
              </div>
            </div>
            <div className="pt-12">
              <h2 className="font-semibold text-lg">Dr. Sarah Green</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                <Mail className="w-3.5 h-3.5" />
                sarah.green@agri.com
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium">
                  <Award className="w-3 h-3" />
                  Senior Agronomist
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                  <Briefcase className="w-3 h-3" />
                  8 years exp.
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specialties */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium text-sm mb-2">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {['Plant Pathology', 'Tomato Crops', 'Fungal Diseases', 'Organic Farming'].map((specialty) => (
                <span 
                  key={specialty}
                  className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <CheckCircle className="w-5 h-5 text-success mx-auto mb-1" />
              <p className="text-xl font-bold">{approvedByMe}</p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <FileText className="w-5 h-5 text-accent mx-auto mb-1" />
              <p className="text-xl font-bold">{myArticles.length}</p>
              <p className="text-xs text-muted-foreground">Articles</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xl font-bold">4.8</p>
              <p className="text-xs text-muted-foreground">Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Bio */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium text-sm mb-2">About</h3>
            <p className="text-sm text-muted-foreground">
              Experienced plant pathologist specializing in tomato and vegetable crop diseases. 
              Passionate about sustainable farming practices and helping farmers implement 
              effective disease management strategies.
            </p>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card>
          <CardContent className="p-0">
            {menuItems.map((item, index) => (
              <button
                key={item.label}
                className={`w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors ${
                  index !== menuItems.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${item.danger ? 'text-destructive' : 'text-muted-foreground'}`} />
                  <span className={item.danger ? 'text-destructive' : ''}>{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
