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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/context/auth-context";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [role, setRole] = useState('guest');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSignup = (event: React.FormEvent) => {
    event.preventDefault();

    if (!firstName || !lastName) {
      toast({
        title: "Validation Error",
        description: "Please enter your first and last name.",
        variant: "destructive",
      });
      return;
    }

    const mockAuthResponse = {
      username: `${firstName} ${lastName}`,
      jwttoken: 'fake-jwt-token-for-prototype-signup',
      roles: [role],
    };

    login(
      { username: mockAuthResponse.username, roles: mockAuthResponse.roles },
      mockAuthResponse.jwttoken
    );

    router.push('/');
  };

  return (
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
          <CardTitle className="text-2xl font-headline">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input 
                    id="first-name" 
                    placeholder="Max" 
                    required 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input 
                    id="last-name" 
                    placeholder="Robinson" 
                    required 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="grid gap-2">
                <Label>Sign up as a</Label>
                <RadioGroup 
                  defaultValue="guest" 
                  value={role}
                  onValueChange={setRole}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="guest" id="r-guest" />
                    <Label htmlFor="r-guest" className="font-normal">Guest</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="host" id="r-host" />
                    <Label htmlFor="r-host" className="font-normal">Host</Label>
                  </div>
                </RadioGroup>
              </div>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Create an account
              </Button>
              <Button variant="outline" className="w-full">
                Sign up with Google
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline text-accent-foreground font-semibold">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
