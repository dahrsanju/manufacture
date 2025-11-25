'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { useAuthStore } from '@/stores';
import { brand } from '@/config/brand';
import { Mail, KeyRound, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, setAuth } = useAuthStore();

  // Demo mode pre-filled values
  const [email, setEmail] = useState('demo@flowsense.ai');
  const [otp, setOtp] = useState('000000');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Demo mode: simulate login delay then authenticate
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Set demo auth data
    setAuth({
      user: {
        id: 'demo-user-001',
        email: 'demo@flowsense.ai',
        name: 'Demo User',
        avatar: undefined,
        phone: undefined,
        isActive: true,
        lastLoginAt: new Date().toISOString(),
        preferences: {
          theme: 'system',
          language: 'en',
          timezone: 'UTC',
          dateFormat: 'MM/DD/YYYY',
          notifications: {
            email: true,
            push: true,
            inApp: true,
            sound: true,
          },
        },
      },
      accessToken: 'demo-access-token-' + Date.now(),
      refreshToken: 'demo-refresh-token-' + Date.now(),
      companies: [
        {
          id: 'uc-demo-001',
          companyId: 'demo-company-001',
          companyName: 'FlowSense Demo',
          companyCode: 'DEMO',
          role: 'ADMIN',
          permissions: ['all'],
          isDefault: true,
        },
      ],
      permissions: ['all'],
    });

    setIsLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background gradient with blue glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />

      {/* Animated background elements - FlowSense blue glow */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-primary/15 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="border-border/50 shadow-2xl bg-card/95 backdrop-blur-sm">
          <CardContent className="pt-8 pb-8 px-8">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col items-center mb-8"
            >
              <img
                src={brand.logoFull}
                alt={`${brand.name} - ${brand.tagline}`}
                className="h-20 w-auto mx-auto object-contain invert dark:invert-0"
              />
            </motion.div>

            {/* Login Form */}
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              onSubmit={handleLogin}
              className="space-y-5"
            >
              {/* Email Input */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-background/50"
                  required
                />
              </div>

              {/* OTP Input */}
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="One-time password"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="pl-10 h-11 bg-background/50 tracking-widest"
                  required
                />
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  />
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </motion.form>

            {/* Demo mode indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-6 pt-6 border-t border-border/50"
            >
              <p className="text-center text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Demo Mode
                </span>
              </p>
              <p className="text-center text-xs text-muted-foreground mt-2">
                Click Sign In to access the dashboard
              </p>
            </motion.div>
          </CardContent>
        </Card>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-center text-xs text-muted-foreground mt-6"
        >
          © {new Date().getFullYear()} {brand.name}. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
}
