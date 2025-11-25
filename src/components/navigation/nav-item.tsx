'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import { Badge } from '@/components/ui';
import type { NavItem as NavItemType } from './nav-config';

interface NavItemProps {
  item: NavItemType;
  collapsed?: boolean;
}

export function NavItem({ item, collapsed }: NavItemProps) {
  const pathname = usePathname();

  const isActive = pathname === item.href ||
    (item.href !== '/dashboard' && pathname.startsWith(item.href));

  const linkContent = (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
        'hover:bg-accent hover:text-accent-foreground',
        isActive && [
          'bg-primary/10 text-primary font-semibold',
          'border-l-2 border-primary -ml-[2px] pl-[14px]',
        ],
        !isActive && 'text-muted-foreground',
        collapsed && 'justify-center px-2'
      )}
    >
      <item.icon className={cn(
        'h-4 w-4 flex-shrink-0',
        isActive && 'text-primary'
      )} />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.title}</span>
          {item.badge && (
            <Badge variant="secondary" className="ml-auto text-xs">
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {linkContent}
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {item.title}
          {item.badge && (
            <Badge variant="secondary" className="text-xs">
              {item.badge}
            </Badge>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}

export default NavItem;
