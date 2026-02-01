import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { Header } from './components/ui/Header';
import { BottomNav } from './components/nav/BottomNav';


import { BatchActionModal } from './components/batches/BatchActionModal';
import { Login } from './pages/Login';
import { AddBatch } from './pages/AddBatch';
import { ImportPage } from './pages/ImportPage';
import { ImportPdf } from './pages/ImportPdf';
import { LandingPage } from './pages/LandingPage';
import { OnboardingWizard } from './pages/OnboardingWizard';
import { PlanSelection } from './pages/PlanSelection';
import { RegisterPage } from './pages/RegisterPage';
import { JoinTeam } from './pages/JoinTeam';
import { ForgotPassword } from './pages/ForgotPassword';
import { UpdatePassword } from './pages/UpdatePassword';
import { TeamSettings } from './pages/TeamSettings';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { AffiliatePage } from './pages/AffiliatePage';

import { batchService } from './services/batchService';
import type { Batch } from './types/database.types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layers, ChevronDown, ChevronRight } from 'lucide-react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) return null;
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

import { ProductGroupCard } from './components/batches/ProductGroupCard';

function SectionGroup({ sectionName, batches, onBatchClick, onAddBatch }: { sectionName: string, batches: Batch[], onBatchClick: (b: Batch) => void, onAddBatch: (pid: string, q: number, d: string) => Promise<void> }) {
  const [isOpen, setIsOpen] = useState(false);



  if (batches.length === 0) return null;

  // Group batches by Product ID
  const groupedByProduct: Record<string, { name: string, batches: Batch[] }> = {};

  batches.forEach(batch => {
    const prodId = batch.product_id;
    if (!groupedByProduct[prodId]) {
      groupedByProduct[prodId] = {
        name: batch.produtos?.nome || 'Item sem nome',
        batches: []
      };
    }
    groupedByProduct[prodId].batches.push(batch);
  });

  // Sort batches within product (Date ASC - FIFO already comes from SQL order usually, but let's ensure)
  // SQL Service does: .order('expiration_date', { ascending: true }); so they are sorted globally.
  // Pushing them in order preserves that.

  const productIds = Object.keys(groupedByProduct);

  return (
    <section className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-zinc-900/50 p-4 border border-zinc-800 active:bg-zinc-800 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-full bg-black border border-zinc-700 transition-colors ${isOpen ? 'text-industrial-yellow border-industrial-yellow' : 'text-zinc-500'}`}>
            <Layers size={16} />
          </div>
          <h2 className={`font-black text-sm uppercase tracking-wider transition-colors ${isOpen ? 'text-white' : 'text-zinc-400'}`}>
            {sectionName}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-black px-2 py-1 rounded text-zinc-500 font-mono border border-zinc-800">
            {productIds.length} Prods
          </span>
          {isOpen ? <ChevronDown size={18} className="text-zinc-500" /> : <ChevronRight size={18} className="text-zinc-500" />}
        </div>
      </button>

      {isOpen && (
        <div className="space-y-2 mt-2 pl-2 border-l-2 border-zinc-800 ml-4 animate-in slide-in-from-top-2 duration-200">
          {productIds.map(prodId => (
            <ProductGroupCard
              key={prodId}
              productName={groupedByProduct[prodId].name}
              productId={prodId}
              batches={groupedByProduct[prodId].batches}
              onBatchClick={onBatchClick}
              onAddBatch={onAddBatch}
            />
          ))}
        </div>
      )}
    </section>
  );
}

import { useOrganization } from './contexts/OrganizationContext';

function Dashboard() {
  const { currentOrg, loading: orgLoading } = useOrganization();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Action Modal State
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Collapse State for Critical Items
  const [isCriticalOpen, setIsCriticalOpen] = useState(false);

  async function loadData() {
    if (!currentOrg) return;
    try {
      setLoading(true); // Soft loading if needed, or just standard
      const data = await batchService.getAllBatches(currentOrg.id);
      setBatches(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar dados. Verifique a conexão.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (currentOrg) {
      loadData();
    }
  }, [currentOrg]);

  useEffect(() => {
    window.addEventListener('focus', loadData);
    return () => window.removeEventListener('focus', loadData);
  }, [currentOrg]); // Re-bind with new closure if org changes

  const handleBatchAction = async (action: 'consumed' | 'discarded' | 'delete_product') => {
    if (!selectedBatch) return;
    setActionLoading(true);
    try {
      if (action === 'delete_product') {
        if (selectedBatch.produtos?.id) {
          await batchService.deleteProduct(selectedBatch.produtos.id);
        }
      } else {
        await batchService.updateBatchStatus(selectedBatch.id, action);
      }
      // Close and Refresh
      setSelectedBatch(null);
      await loadData();
    } catch (e: unknown) {
      console.error(e);
      alert("Não foi possível realizar a ação. Verifique sua conexão.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleQuickAdd = async (productId: string, quantity: number, date: string) => {
    if (!currentOrg) return;
    await batchService.addBatchToProduct(currentOrg.id, productId, quantity, date);
    await loadData();
  };

  // Filter critical directly for the header alert
  const criticalBatches = batches.filter(batch => batchService.getDaysRemaining(batch.expiration_date) <= 7);

  // Group by Section
  const groupedBatches: Record<string, Batch[]> = {};
  batches.forEach(batch => {
    const sectionName = batch.produtos?.categorias?.nome || 'Sem Sessão';
    if (!groupedBatches[sectionName]) {
      groupedBatches[sectionName] = [];
    }
    groupedBatches[sectionName].push(batch);
  });

  // Sort sections alphabetically
  const sortedSections = Object.keys(groupedBatches).sort();

  // Count unique products
  const uniqueProductIds = new Set(batches.map(b => b.product_id));
  const totalProducts = uniqueProductIds.size;

  if (loading && batches.length === 0 || orgLoading) {
    return (
      <AppShell>
        <div className="flex h-screen items-center justify-center">
          <span className="text-white font-mono animate-pulse">CARREGANDO SESSÕES...</span>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <Header criticalCount={criticalBatches.length} totalItems={totalProducts} />

      <main className="p-4 pb-24 space-y-6">
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 text-xs font-mono mb-4">
            SYSTEM ERROR: {error}
          </div>
        )}

        {/* Global Critical Alerts - Collapsible */}
        {criticalBatches.length > 0 && (
          <section className="mb-8">
            <button
              onClick={() => setIsCriticalOpen(!isCriticalOpen)}
              className="w-full flex items-center justify-between bg-industrial-red p-4 border-2 border-industrial-red shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:bg-red-600 transition-colors group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-white rounded-full animate-ping" />
                <h2 className="font-black text-sm uppercase tracking-wider text-white">
                  Alertas Críticos ({criticalBatches.length})
                </h2>
              </div>
              {isCriticalOpen ? (
                <ChevronDown className="text-white" size={20} strokeWidth={3} />
              ) : (
                <ChevronRight className="text-white" size={20} strokeWidth={3} />
              )}
            </button>

            {isCriticalOpen && (
              <div className="mt-2 overflow-hidden border border-industrial-red/30 rounded-lg animate-in slide-in-from-top-2 duration-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-industrial-red text-white uppercase font-black text-xs tracking-wider">
                    <tr>
                      <th className="p-3">Produto</th>
                      <th className="p-3 text-center">Vence em</th>
                      <th className="p-3 text-center">Qtd</th>
                      <th className="p-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-industrial-red/20 bg-industrial-surface">
                    {criticalBatches.map(batch => {
                      const days = batchService.getDaysRemaining(batch.expiration_date);
                      return (
                        <tr key={'crit-' + batch.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 font-bold text-white uppercase">{batch.produtos?.nome || 'Desconhecido'}</td>
                          <td className="p-3 text-center font-mono font-bold text-industrial-red">
                            {days <= 0 ? (
                              <span className="animate-pulse">VENCIDO</span>
                            ) : (
                              <span>{days}d</span>
                            )}
                          </td>
                          <td className="p-3 text-center font-mono text-zinc-400">{batch.quantity}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => setSelectedBatch(batch)}
                              className="text-xs bg-industrial-red/10 text-industrial-red border border-industrial-red/50 px-2 py-1 rounded hover:bg-industrial-red hover:text-white transition-colors uppercase font-bold"
                            >
                              Baixar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Sections List */}
        {sortedSections.length === 0 ? (
          <div className="text-center py-12 opacity-50">
            <p className="mb-2">Nenhuma sessão criada.</p>
            <p className="text-xs">Cadastre um produto para criar sessões.</p>
          </div>
        ) : (
          sortedSections.map(section => (
            <SectionGroup
              key={section}
              sectionName={section}
              batches={groupedBatches[section]}
              onBatchClick={setSelectedBatch}
              onAddBatch={handleQuickAdd}
            />
          ))
        )}
      </main>

      {/* ACTION MODAL */}
      <BatchActionModal
        batch={selectedBatch}
        onClose={() => setSelectedBatch(null)}
        loading={actionLoading}
        onAction={handleBatchAction}
      />

      <BottomNav />
    </AppShell>
  );
}

import { OrganizationProvider } from './contexts/OrganizationContext';

import { CookieConsent } from './components/privacy/CookieConsent';

function App() {
  return (
    <Router>
      <AuthProvider>
        <OrganizationProvider>
          <Routes>
            {/* Public SaaS Funnel */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/intro" element={<OnboardingWizard />} />
            <Route path="/checkout" element={<PlanSelection />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<JoinTeam />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/parceiros" element={<AffiliatePage />} />

            {/* Protected App Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/add" element={
              <ProtectedRoute>
                <AddBatch />
              </ProtectedRoute>
            } />
            <Route path="/import" element={
              <ProtectedRoute>
                <ImportPage />
              </ProtectedRoute>
            } />
            <Route path="/import-pdf" element={
              <ProtectedRoute>
                <ImportPdf />
              </ProtectedRoute>
            } />
            <Route path="/import-pdf" element={
              <ProtectedRoute>
                <ImportPdf />
              </ProtectedRoute>
            } />
            <Route path="/team" element={
              <ProtectedRoute>
                <TeamSettings />
              </ProtectedRoute>
            } />
            {/* Catch-all: Redirect to Landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <CookieConsent />
        </OrganizationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
