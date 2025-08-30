/**
 * HomePage Component - Main Landing Page with Aurora Theme
 * @file src/web/main/features/home/pages/root.tsx
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Badge, 
  Card, 
  CardHeader,
  CardTitle,
  CardContent,
  Button, 
  Separator 
} from '@voilajsx/uikit';
import { PageLayout } from '@voilajsx/uikit/page';

interface HomePageProps {
  className?: string;
}

export const HomePage: React.FC<HomePageProps> = ({ className }) => {
  const navigation = [
    { key: 'home', label: 'Home', href: '/', isActive: true },
    { key: 'greeting', label: 'Greeting App', href: '/greeting/hello' },
    { key: 'admin', label: 'Admin', href: '/admin' },
    { key: 'about', label: 'About', href: '/about' }
  ];

  return (
    <PageLayout scheme="default" tone="brand" size="xl" className={className}>
      <PageLayout.Header
        title="Voila Framework"
        navigation={navigation}
        currentPath="/"
        onNavigate={(href) => window.location.href = href}
        logo={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">🚀</span>
            </div>
            <span className="text-xl font-bold text-foreground">Voila</span>
          </div>
        }
      />
      
      <PageLayout.Content>
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-foreground mb-6">
            🚀 Voila Framework
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            A modern, contract-driven full-stack framework with auto-discovery and AI-friendly architecture.
            Now showcasing the <strong className="text-primary">Aurora Theme</strong> with purple/green creative colors!
          </p>
          <div className="flex justify-center gap-3 mb-8">
            <Badge className="bg-primary text-primary-foreground">TypeScript</Badge>
            <Badge className="bg-accent text-accent-foreground">React</Badge>
            <Badge className="bg-secondary text-secondary-foreground">Express</Badge>
            <Badge className="bg-muted text-muted-foreground">Prisma</Badge>
          </div>
          <div className="flex justify-center gap-4">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
            <Button variant="outline" className="border-border text-foreground hover:bg-accent hover:text-accent-foreground">Learn More</Button>
          </div>
        </div>

        {/* Feature Cards - Showcasing Aurora Theme Colors */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Greeting App - Active */}
          <Card className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                👋 Greeting App
                <Badge className="bg-accent text-accent-foreground">Active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Interactive greeting service with multi-language support and database logging
              </p>
              <div className="space-y-3">
                <Link to="/greeting/hello" className="block">
                  <Button className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90">
                    🌍 Hello Feature
                  </Button>
                </Link>
                <Link to="/greeting/logs" className="block">
                  <Button variant="outline" className="w-full justify-start border-border text-foreground hover:bg-accent hover:text-accent-foreground">
                    📋 Logs Management
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Climate App (Future) */}
          <Card className="bg-card border-border opacity-70">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                🌡️ Climate App
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground">Coming Soon</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Weather data and climate information services
              </p>
              <div className="space-y-3">
                <Button disabled className="w-full justify-start">
                  🌤️ Weather Feature
                </Button>
                <Button disabled variant="outline" className="w-full justify-start">
                  🔍 Search Feature
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Welcome App (Future) */}
          <Card className="bg-card border-border opacity-70">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                🎉 Welcome App
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground">Coming Soon</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                User onboarding and welcome experience
              </p>
              <div className="space-y-3">
                <Button disabled className="w-full justify-start">
                  👤 User Greet
                </Button>
                <Button disabled variant="outline" className="w-full justify-start">
                  📊 Status Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-16 border-border" />

        {/* Framework Features - Aurora Theme Showcase */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">Framework Features</h2>
          <p className="text-lg text-muted-foreground mb-12">
            Built with semantic colors that adapt to the current theme
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card border-border hover:bg-accent/10 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-4">🔄</div>
                <h3 className="font-semibold text-card-foreground mb-3">Auto-Discovery</h3>
                <p className="text-muted-foreground text-sm">
                  Automatic route and API discovery from file structure
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border hover:bg-accent/10 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-4">📋</div>
                <h3 className="font-semibold text-card-foreground mb-3">Contract-Driven</h3>
                <p className="text-muted-foreground text-sm">
                  Type-safe contracts define behavior before implementation
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border hover:bg-accent/10 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-4">🤖</div>
                <h3 className="font-semibold text-card-foreground mb-3">AI-Friendly</h3>
                <p className="text-muted-foreground text-sm">
                  Consistent patterns optimized for AI code generation
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border hover:bg-accent/10 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-4">⚡</div>
                <h3 className="font-semibold text-card-foreground mb-3">Full-Stack</h3>
                <p className="text-muted-foreground text-sm">
                  Unified backend and frontend with shared validation
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Theme Information */}
          <div className="mt-16 p-8 bg-muted/30 rounded-xl border-border">
            <h3 className="text-xl font-semibold text-foreground mb-4">🎨 Current Theme: Aurora</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="w-4 h-4 bg-primary rounded-full mx-auto mb-2"></div>
                <p className="font-medium text-foreground">Primary</p>
                <p className="text-muted-foreground">Purple tones</p>
              </div>
              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <div className="w-4 h-4 bg-accent rounded-full mx-auto mb-2"></div>
                <p className="font-medium text-foreground">Accent</p>
                <p className="text-muted-foreground">Green highlights</p>
              </div>
              <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                <div className="w-4 h-4 bg-secondary rounded-full mx-auto mb-2"></div>
                <p className="font-medium text-foreground">Secondary</p>
                <p className="text-muted-foreground">Neutral tones</p>
              </div>
              <div className="p-4 bg-muted rounded-lg border border-border">
                <div className="w-4 h-4 bg-muted-foreground rounded-full mx-auto mb-2"></div>
                <p className="font-medium text-foreground">Muted</p>
                <p className="text-muted-foreground">Subtle text</p>
              </div>
            </div>
          </div>
        </div>
      </PageLayout.Content>
      
      <PageLayout.Footer
        copyright="© 2024 Voila Framework. Showcasing Aurora Theme with semantic colors."
        navigation={[
          { key: 'docs', label: 'Documentation', href: '/docs' },
          { key: 'github', label: 'GitHub', href: 'https://github.com/voilajsx' },
          { key: 'support', label: 'Support', href: '/support' }
        ]}
      />
    </PageLayout>
  );
};

// Default export for auto-discovery router
export default HomePage;