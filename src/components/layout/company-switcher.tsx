'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button, Modal, Input, Badge } from '@/components/ui';
import { useAuthStore } from '@/stores';
import { brand } from '@/config/brand';
import {
  Building2,
  ChevronDown,
  Search,
  Check,
  Plus,
  Settings,
} from 'lucide-react';
import toast from 'react-hot-toast';

export function CompanySwitcher() {
  const router = useRouter();
  const { companies, companyId, setCompany } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const currentCompany = companies.find(c => c.companyId === companyId);

  const filteredCompanies = companies.filter(company =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCompanySwitch = (newCompanyId: string) => {
    if (newCompanyId === companyId) {
      setIsOpen(false);
      return;
    }

    setCompany(newCompanyId);
    setIsOpen(false);
    toast.success('Company switched successfully');
    router.push('/dashboard');
  };

  if (!currentCompany) return null;

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 h-auto"
      >
        <img
          src={brand.logoFull}
          alt={brand.name}
          className="h-12 w-auto object-contain invert dark:invert-0"
        />
        <div className="text-left hidden md:block">
          <p className="text-xs text-muted-foreground">{currentCompany.role}</p>
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Switch Company"
        size="sm"
      >
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Company List */}
          <div className="space-y-1 max-h-[300px] overflow-y-auto">
            {filteredCompanies.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground text-sm">
                No companies found
              </p>
            ) : (
              filteredCompanies.map((company) => {
                const isSelected = company.companyId === companyId;
                return (
                  <button
                    key={company.companyId}
                    onClick={() => handleCompanySwitch(company.companyId)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      isSelected
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'hover:bg-muted border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary/20' : 'bg-muted'}`}>
                        <Building2 className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <p className="font-medium">{company.companyName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="secondary" className="text-xs">
                            {company.role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-2 border-t">
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Company
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Manage
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default CompanySwitcher;
