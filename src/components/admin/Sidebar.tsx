import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Megaphone, ShoppingBag, ShoppingCart, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const menuItems = [
  { title: 'Dashboard', url: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Campanhas', url: '/admin/campanhas', icon: Megaphone },
  { title: 'Produtos', url: '/admin/produtos', icon: ShoppingBag },
  { title: 'Pedidos', url: '/admin/pedidos', icon: ShoppingCart },
];

export const Sidebar = () => {
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-secondary text-secondary-foreground flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-secondary-foreground/10">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-terracota rounded-lg">
          <span className="text-2xl font-bold text-terracota-foreground">NG</span>
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
              {user ? getInitials(user.Nome) : 'AD'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.Nome}</p>
            <p className="text-xs text-secondary-foreground/70 truncate">{user?.Email}</p>
          </div>
        </div>
        <Button
          onClick={logout}
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </aside>
  );
};
