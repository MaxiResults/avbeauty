import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import TermosUso from "./pages/TermosUso";

// Loja
import BlackFriday from "./pages/BlackFriday";
import Checkout from "./pages/Checkout";
import PedidoConfirmacao from "./pages/PedidoConfirmacao";
import CadastroBlackFriday from "./pages/CadastroBlackFriday";
import Obrigado from "./pages/Obrigado";

// Admin
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Campanhas from "./pages/admin/Campanhas";
import ListaCampanhas from "./pages/admin/campanhas/ListaCampanhas";
import NovaCampanha from "./pages/admin/campanhas/NovaCampanha";
import EditarCampanha from "./pages/admin/campanhas/EditarCampanha";
import Produtos from "./pages/admin/Produtos";
import ListaProdutos from "./pages/admin/produtos/ListaProdutos";
import NovoProduto from "./pages/admin/produtos/NovoProduto";
import EditarProduto from "./pages/admin/produtos/EditarProduto";
import Pedidos from "./pages/admin/Pedidos";
import NovoPedidoManual from "./pages/admin/NovoPedidoManual";
import Usuarios from "./pages/admin/Usuarios";
import NovoUsuario from "./pages/admin/NovoUsuario";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider> {/* ✅ AGORA USA AUTH CUSTOMIZADA (sem auth nativo) */}
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Loja Routes */}
            <Route path="/black-friday" element={<BlackFriday />} />
            <Route path="/promocao" element={<BlackFriday />} />
            <Route path="/cadastro-black-friday" element={<CadastroBlackFriday />} />
            <Route path="/obrigado" element={<Obrigado />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/pedido/:codigo" element={<PedidoConfirmacao />} />
            
            {/* Legal Routes */}
            <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
            <Route path="/termos-de-uso" element={<TermosUso />} />
            
            {/* Admin Routes - CORRIGIDAS */}
            <Route path="/admin/login" element={<Login />} /> {/* ✅ Use Login, não Auth */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/campanhas"
              element={
                <ProtectedRoute>
                  <ListaCampanhas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/campanhas/nova"
              element={
                <ProtectedRoute>
                  <NovaCampanha />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/campanhas/:id"
              element={
                <ProtectedRoute>
                  <EditarCampanha />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/produtos"
              element={
                <ProtectedRoute>
                  <ListaProdutos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/produtos/novo"
              element={
                <ProtectedRoute>
                  <NovoProduto />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/produtos/:id"
              element={
                <ProtectedRoute>
                  <EditarProduto />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pedidos"
              element={
                <ProtectedRoute>
                  <Pedidos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pedidos/novo-manual"
              element={
                <ProtectedRoute>
                  <NovoPedidoManual />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/usuarios"
              element={
                <ProtectedRoute>
                  <Usuarios />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/usuarios/novo"
              element={
                <ProtectedRoute>
                  <NovoUsuario />
                </ProtectedRoute>
              }
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
