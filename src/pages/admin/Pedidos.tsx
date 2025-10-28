import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';

export default function Pedidos() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <Header title="Pedidos" />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">Gerenciamento de Pedidos</h2>
            <p className="text-muted-foreground">Esta funcionalidade será implementada em breve.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
