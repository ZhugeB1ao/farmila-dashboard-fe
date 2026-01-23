import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation - in real app would authenticate
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-primary rounded-xl mb-4">
            <span className="text-primary-foreground text-2xl">HR</span>
          </div>
          <h1 className="text-3xl">HR Management Portal</h1>
          <p className="text-muted-foreground">
            Sign in to access your account
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-input-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-input-background"
                />
              </div>

              <Button type="submit" className="w-full">
                Sign In
              </Button>

              <p className="text-sm text-muted-foreground text-center mt-4">
                Demo: Use any email and password to login
              </p>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          © 2026 HR Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
}
