/**
 * Admin Dashboard - Aurora Theme Showcase
 * Route: /admin
 * Path: admin/home/pages/root.tsx
 */

import React from 'react';
import { AdminLayout } from '@voilajsx/uikit/admin';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@voilajsx/uikit';
import { Users, BarChart3, Settings, Home } from 'lucide-react';

const AdminHomePage: React.FC = () => {
  const navigation = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      href: '/admin',
      icon: Home,
      isActive: true,
    },
    {
      key: 'users',
      label: 'Users',
      href: '/admin/users',
      icon: Users,
      badge: '12',
    },
    {
      key: 'analytics',
      label: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
    },
    {
      key: 'settings',
      label: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    }
  ];

  return (
    <AdminLayout scheme="sidebar" tone="brand" size="lg">
      <AdminLayout.Header
        title="Admin Dashboard"
        position="sticky"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Dashboard' }
        ]}
        actions={
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            New Item
          </Button>
        }
      />

      <AdminLayout.Sidebar
        navigation={navigation}
        currentPath="/admin"
        onNavigate={(href) => window.location.href = href}
        logo={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">V</span>
            </div>
            <span className="text-xl font-bold text-foreground">Admin</span>
          </div>
        }
      />

      <AdminLayout.Content>
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-8 rounded-xl border border-primary/20">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              🎨 Welcome to Aurora Theme Admin
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              This admin dashboard showcases the Aurora theme with purple/green creative colors and semantic UIKit components.
            </p>
            <div className="flex gap-3">
              <Badge className="bg-primary text-primary-foreground">Aurora Theme</Badge>
              <Badge className="bg-accent text-accent-foreground">Brand Tone</Badge>
              <Badge className="bg-secondary text-secondary-foreground">Admin Layout</Badge>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card border-border hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">1,234</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-accent" />
                  Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">5,678</div>
                <p className="text-xs text-muted-foreground">+8% from last week</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Settings className="h-5 w-5 text-secondary-foreground" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">42</div>
                <p className="text-xs text-muted-foreground">Configurations active</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Home className="h-5 w-5 text-muted-foreground" />
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">Active</div>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </CardContent>
            </Card>
          </div>

          {/* Theme Information */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">🎨 Current Theme Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Theme Settings</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Theme:</span>
                      <span className="text-foreground font-medium">Aurora (Purple/Green)</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Mode:</span>
                      <span className="text-foreground font-medium">Light</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Tone:</span>
                      <span className="text-foreground font-medium">Brand (Primary colored)</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="text-foreground font-medium">Large (256px sidebar)</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Color Preview</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-primary rounded-full"></div>
                      <span className="text-sm text-muted-foreground">Primary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-accent rounded-full"></div>
                      <span className="text-sm text-muted-foreground">Accent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-secondary rounded-full"></div>
                      <span className="text-sm text-muted-foreground">Secondary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-muted rounded-full"></div>
                      <span className="text-sm text-muted-foreground">Muted</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="flex gap-4">
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => window.location.href = '/admin/users'}
            >
              Manage Users
            </Button>
            <Button 
              variant="outline" 
              className="border-border text-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={() => window.location.href = '/admin/analytics'}
            >
              View Analytics
            </Button>
            <Button 
              variant="outline" 
              className="border-border text-foreground hover:bg-secondary hover:text-secondary-foreground"
              onClick={() => window.location.href = '/'}
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </AdminLayout.Content>
    </AdminLayout>
  );
};

export default AdminHomePage;