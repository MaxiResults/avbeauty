import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';

export default function Campanhas() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Campanhas" />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 lg:ml-64 min-h-screen">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">Gerenciamento de Campanhas</h2>
            <p className="text-muted-foreground">Esta funcionalidade será implementada em breve.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
