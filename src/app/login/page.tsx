
'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState('Max Robinson');
  const [password, setPassword] = useState('password');
  const [role, setRole] = useState('USER');
  const [isLoading, setIsLoading] = useState(false);
  const [showJsonDialog, setShowJsonDialog] = useState(false);
  const [jsonPayload, setJsonPayload] = useState('');

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      username,
      password,
    };
    setJsonPayload(JSON.stringify(payload, null, 2));
    setShowJsonDialog(true);
  };

  const proceedWithLogin = async () => {
    setIsLoading(true);
    setShowJsonDialog(false);

    const endpoint = role === 'HOST'
      ? '/api/auth/loginAsHost'
      : '/api/auth/login';
    
    const payload = {
        username,
        password,
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = `Login failed: ${response.statusText}`;
        try {
            const errorData = await response.json();
            if (errorData && errorData.message) {
                errorMessage = errorData.message;
            }
        } catch (jsonError) {
            console.error("Could not parse error response as JSON:", jsonError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      const user = {
        username: data.username,
        roles: data.roles,
      };
      const token = data.token; 
      
      login(user, token);
      toast({
        title: "Login Successful!",
        description: `Welcome back, ${user.username}!`,
      });
      router.push('/');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="absolute top-4 left-4">
          <Button variant="ghost" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
        <Card className="mx-auto max-w-sm w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Login</CardTitle>
            <CardDescription>
              Enter your username below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="ml-auto inline-block text-sm underline">
                      Forgot your password?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    disabled={isLoading}
                  />
                </div>
                  <div className="grid gap-2">
                    <Label>Login as a</Label>
                    <RadioGroup 
                      defaultValue="USER" 
                      value={role}
                      onValueChange={setRole}
                      className="flex gap-4"
                      disabled={isLoading}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="USER" id="r-user" />
                        <Label htmlFor="r-user" className="font-normal">User</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="HOST" id="r-host" />
                        <Label htmlFor="r-host" className="font-normal">Host</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                  <Button variant="outline" className="w-full" disabled={isLoading}>
                    Login with Google
                  </Button>
                </div>
              </form>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline text-accent-foreground font-semibold">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

      <AlertDialog open={showJsonDialog} onOpenChange={setShowJsonDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>JSON Payload for Login</AlertDialogTitle>
            <AlertDialogDescription>
              This is the data that will be sent to the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <pre className="mt-2 w-full rounded-md bg-muted p-4 overflow-x-auto">
            <code className="text-muted-foreground">{jsonPayload}</code>
          </pre>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowJsonDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={proceedWithLogin}>Send Request</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
