import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Megaphone, ShoppingBag, ShoppingCart, Users, LogOut, Menu } from 'lucide-react';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { customLogout } from '@/utils/customAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const menuItems = [
  { title: 'Dashboard', url: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Campanhas', url: '/admin/campanhas', icon: Megaphone },
  { title: 'Produtos', url: '/admin/produtos', icon: ShoppingBag },
  { title: 'Pedidos', url: '/admin/pedidos', icon: ShoppingCart },
  { title: 'Usuários', url: '/admin/usuarios', icon: Users },
];

export const Sidebar = () => {
  const { user } = useCustomAuth();
  const isMobile = useIsMobile();

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const SidebarContent = () => (
    <div className="h-full bg-secondary text-secondary-foreground flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-secondary-foreground/10">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-terracota rounded-lg">
          <span className="text-xl font-bold text-terracota-foreground">AV Beauty</span>
        </div>
      </div>
      {/* Menu */}
      <nav className="flex-1 py-6">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.url}>
              <NavLink
                to={item.url}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth ${
                    isActive
                      ? 'bg-primary border-l-4 border-terracota'
                      : 'hover:bg-primary/50'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-secondary-foreground/10">
        <div className="flex items-center gap-3 mb-3">
          <Avatar>
            <AvatarFallback className="bg-terracota text-terracota-foreground">
              {getInitials(user?.nome)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.nome || 'Usuário'}</p>
            <p className="text-xs text-secondary-foreground/70 truncate">{user?.email || ''}</p>
          </div>
        </div>
        <Button
          onClick={customLogout}
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-4 left-4 z-50 lg:hidden bg-secondary"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-secondary text-secondary-foreground flex flex-col z-50">
      <SidebarContent />
    </aside>
  );
};
