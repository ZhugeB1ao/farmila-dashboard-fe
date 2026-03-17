import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export function LoginPage() {
  const { logIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError(null);
    try {
      await logIn(email, password);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoggingIn(false);
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
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                  {error}
                </div>
              )}
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
                  autoComplete="email"
                  spellCheck={false}
                  disabled={isLoggingIn}
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
                  autoComplete="current-password"
                  disabled={isLoggingIn}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Signing In...
                    </>
                ) : 'Sign In'}
              </Button>

              <p className="text-sm text-muted-foreground text-center mt-4">
                Seed Data: Use <b>admin@company.com</b> and <b>password123</b>
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
