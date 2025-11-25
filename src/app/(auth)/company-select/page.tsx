'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { Building2, Search, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CompanySelectPage() {
  const router = useRouter();
  const { companies, setCompany, user } = useAuthStore();
  const [search, setSearch] = useState('');

  const filteredCompanies = companies.filter(
    (company) =>
      company.companyName.toLowerCase().includes(search.toLowerCase()) ||
      company.companyCode.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectCompany = (companyId: string) => {
    setCompany(companyId);
    const company = companies.find((c) => c.companyId === companyId);
    toast.success(`Switched to ${company?.companyName}`);
    router.push('/dashboard');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Company</CardTitle>
        <CardDescription>
          Welcome back, {user?.name}! Choose which company to access.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        {companies.length > 3 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        )}

        {/* Company List */}
        <div className="space-y-2" data-testid="company-list">
          {filteredCompanies.map((company) => (
            <button
              key={company.companyId}
              onClick={() => handleSelectCompany(company.companyId)}
              className="w-full flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
              data-testid={`company-item-${company.companyCode.toLowerCase()}`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{company.companyName}</p>
                <p className="text-sm text-muted-foreground">
                  {company.companyCode} • {company.role}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}

          {filteredCompanies.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              No companies found matching &quot;{search}&quot;
            </p>
          )}
        </div>

        {/* Logout option */}
        <div className="pt-4 border-t">
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => {
              useAuthStore.getState().clearAuth();
              router.push('/login');
            }}
          >
            Sign out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
