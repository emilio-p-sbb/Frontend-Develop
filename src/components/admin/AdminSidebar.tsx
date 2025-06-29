'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  Code,
  Settings,
  User,
  MessageCircle,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminStore } from '@/stores/adminStore';
import { useResources } from '@/hooks/private/use-resource';
import { Message } from '@/types/message';
import { useMemo } from 'react';
import { useSession } from 'next-auth/react';

interface AdminSidebarProps {
  collapsed: boolean;
}

export default function AdminSidebar({ collapsed }: AdminSidebarProps) {

  const { data: session, status } = useSession();

  const pathname = usePathname();
  // const { unreadMessages } = useAdminStore();

  const { data: initialMessages, isLoading: isLoadingAll, error: errorAll } = useResources<Message[]>("messages");
  const totalUnreadCount = useMemo(() => {
      return initialMessages?.data?.filter(msg => !msg.read).length ?? 0;
    }, [initialMessages]);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Briefcase, label: 'Experience', path: '/admin/experience' },
    { icon: GraduationCap, label: "Education", path: "/admin/education" },
    { icon: Code, label: 'Projects', path: '/admin/projects' },
    { icon: GraduationCap, label: 'Skills', path: '/admin/skills' },
    { icon: MessageCircle, label: 'Messages', path: '/admin/messages', badge: totalUnreadCount },
    { icon: TrendingUp, label: 'Analytics', path: '/admin/analytics' },
    { icon: User, label: 'Profile', path: '/admin/profile' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <aside className={cn('bg-blue-950 text-white transition-all duration-300 flex flex-col shadow-lg', collapsed ? 'w-16' : 'w-64')}>
      <div className={cn('p-4 flex items-center border-b border-gray-700', collapsed ? 'justify-center' : 'justify-between')}>
        {!collapsed && <h1 className="font-bold text-xl">Admin Panel</h1>}
      </div>

      <div className="flex-1 py-4">
        <nav>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={cn(
                    'flex items-center px-4 py-3 hover:bg-gray-700 transition-colors relative',
                    collapsed ? 'justify-center' : 'justify-start',
                    isActive(item.path) ? 'bg-blue-500 text-white' : ''
                  )}
                >
                  <item.icon size={20} />
                  {!collapsed && (
                    <div className="flex items-center justify-between w-full ml-3">
                      <span>{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                  {collapsed && item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={cn('p-4 border-t border-gray-700 flex items-center', collapsed ? 'justify-center' : '')}>
        {!collapsed && (
          <div>
            <p className="text-sm text-gray-300">Logged in as</p>
            <p className="font-medium">{session?.user?.name || 'Admin'}</p>
          </div>
        )}
      </div>
    </aside>
  );
}
