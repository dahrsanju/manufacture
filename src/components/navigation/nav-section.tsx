'use client';

import { cn } from '@/lib/utils';
import { NavItem } from './nav-item';
import type { NavSection as NavSectionType } from './nav-config';

interface NavSectionProps {
  section: NavSectionType;
  collapsed?: boolean;
}

export function NavSection({ section, collapsed }: NavSectionProps) {
  return (
    <div className="mb-4">
      {!collapsed && (
        <h3 className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          {section.title}
        </h3>
      )}
      {collapsed && (
        <div className="mb-2 h-px bg-border mx-2" />
      )}
      <div className="space-y-1">
        {section.items.map((item) => (
          <NavItem key={item.href} item={item} collapsed={collapsed} />
        ))}
      </div>
    </div>
  );
}

export default NavSection;
