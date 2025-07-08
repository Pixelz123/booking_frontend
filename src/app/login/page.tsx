'use client'; // Make this a client component

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
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [role, setRole] = useState('USER');
  const [loginData, setLoginData] = useState<any>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    
    const mockAuthResponse = {
      username: 'Max Robinson',
      jwttoken: 'fake-jwt-token-for-prototype',
      roles: [role]
    };

    setLoginData(mockAuthResponse);
    setIsAlertOpen(true);
  };

  const confirmLogin = () => {
    if (loginData) {
      login(
        { username: loginData.username, roles: loginData.roles },
        loginData.jwttoken
      );
      router.push('/');
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
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    defaultValue="m@example.com" // Pre-fill for demo
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="ml-auto inline-block text-sm underline">
                      Forgot your password?
                    </Link>
                  </div>
                  <Input id="password" type="password" defaultValue="password" required />
                </div>
                 <div className="grid gap-2">
                  <Label>Login as a</Label>
                  <RadioGroup 
                    defaultValue="USER" 
                    value={role}
                    onValueChange={setRole}
                    className="flex gap-4"
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
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Login
                </Button>
                <Button variant="outline" className="w-full">
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
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Login Data (Simulation)</AlertDialogTitle>
            <AlertDialogDescription>
              This is the mock data that simulates a successful login response from a server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 max-h-60 overflow-y-auto rounded-md border bg-muted p-4">
            <pre className="text-sm text-muted-foreground">
              <code>{loginData ? JSON.stringify(loginData, null, 2) : ''}</code>
            </pre>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={confirmLogin}>
              Confirm & Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
