'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { Sidebar, MobileSidebar, TopNav } from '@/components/navigation';
import { CommandBar, AIInspectorPanel } from '@/components/ai';
import { NotificationPanel } from '@/components/notifications';
import { useUIStore } from '@/stores';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed, aiPanelOpen, setAIPanelOpen, notificationPanelOpen, setNotificationPanelOpen } = useUIStore();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Sidebar */}
        <MobileSidebar />

        {/* Top Navigation */}
        <TopNav />

        {/* Main Content */}
        <main
          className="pt-[60px] min-h-screen transition-all duration-300"
          style={{
            marginLeft: sidebarCollapsed ? '72px' : '240px',
          }}
        >
          {/* Mobile adjustment - no margin on mobile */}
          <style jsx>{`
            @media (max-width: 1023px) {
              main {
                margin-left: 0 !important;
              }
            }
          `}</style>
          <div className="p-6">{children}</div>
        </main>

        {/* Command Bar (⌘+K) */}
        <CommandBar />

        {/* AI Inspector Panel */}
        <AIInspectorPanel
          isOpen={aiPanelOpen}
          onClose={() => setAIPanelOpen(false)}
        />

        {/* Notification Panel */}
        <NotificationPanel
          isOpen={notificationPanelOpen}
          onClose={() => setNotificationPanelOpen(false)}
        />
      </div>
    </ProtectedRoute>
  );
}
