import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { BottomNav } from '../components/nav/BottomNav';
import { teamService } from '../services/teamService';
import type { OrganizationMember } from '../types/database.types';
import { useOrganization } from '../contexts/OrganizationContext';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Users, Plus, Trash2, Crown, Shield, Mail, Loader2, AlertCircle, Copy } from 'lucide-react';
import { getPlanLimit } from '../config/limits';

export function TeamSettings() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { currentOrg } = useOrganization();

    const [members, setMembers] = useState<OrganizationMember[]>([]);
    const [invites, setInvites] = useState<{ id: string, email: string }[]>([]); // New State
    const [loading, setLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const plan = currentOrg?.plan || 'start';
    const limits = getPlanLimit(plan);
    const usedSlots = members.length + invites.length; // Count invites too
    const canAdd = usedSlots < limits.users;
    const isOwner = members.find(m => m.user_id === user?.id)?.role === 'owner';

    // Load Members & Invites
    useEffect(() => {
        if (currentOrg) {
            loadData();
        }
    }, [currentOrg]);

    async function loadData() {
        if (!currentOrg) return;
        try {
            setLoading(true);
            const [membersData, invitesData] = await Promise.all([
                teamService.getMembers(currentOrg.id),
                teamService.getInvites(currentOrg.id)
            ]);
            setMembers(membersData);
            setInvites(invitesData);
        } catch (err) {
            console.error(err);
            setError("Erro ao carregar equipe.");
        } finally {
            setLoading(false);
        }
    }

    // Wrapped for compatibility
    const loadMembers = loadData;

    // Cancel Invite
    async function handleCancelInvite(inviteId: string) {
        if (!confirm("Cancelar este convite?")) return;
        try {
            await teamService.cancelInvite(inviteId);
            loadData();
        } catch (err) {
            console.error(err);
            alert("Erro desconhecido.");
        }
    }

    async function handleAddMember(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!currentOrg) return;
        if (!canAdd) {
            setError(`Limite do plano ${limits.label} atingido.`);
            return;
        }

        setAdding(true);
        try {
            const result = await teamService.addMember(currentOrg.id, inviteEmail);
            if (result.success) {
                setSuccess(result.message);
                setInviteEmail('');
                loadMembers();
            } else {
                setError(result.message);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Erro ao adicionar membro.");
        } finally {
            setAdding(false);
        }
    }

    async function handleRemove(userId: string) {
        if (!currentOrg || !confirm("Tem certeza que deseja remover este membro?")) return;
        try {
            await teamService.removeMember(currentOrg.id, userId);
            loadMembers();
        } catch (err) {
            console.error(err);
            alert("Erro ao remover membro.");
        }
    }

    return (
        <AppShell>
            <header className="p-4 border-b-2 border-industrial bg-industrial-bg sticky top-0 z-40 flex items-center gap-4">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-industrial text-white p-2 border-2 border-black shadow-industrial active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                >
                    <ArrowLeft size={20} strokeWidth={3} />
                </button>
                <h1 className="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-2">
                    <Users size={24} /> Gestão de Equipe
                </h1>
            </header>

            <main className="p-6 pb-32 space-y-8">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 size={32} className="animate-spin text-zinc-500" />
                    </div>
                ) : (
                    <>
                        {/* PENDING INVITES */}
                        {invites.length > 0 && (
                            <section className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-xl">
                                <h3 className="text-sm font-black uppercase text-zinc-500 mb-4 block flex items-center gap-2">
                                    <Mail size={16} /> Convites Pendentes
                                </h3>

                                <div className="space-y-2">
                                    {invites.map(invite => (
                                        <div key={invite.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg flex items-center justify-between border-dashed border-zinc-700">
                                            <div>
                                                <h4 className="text-zinc-300 font-bold text-sm">
                                                    {invite.email}
                                                </h4>
                                                <span className="text-[10px] text-zinc-500 font-mono uppercase bg-zinc-800 px-2 py-0.5 rounded">
                                                    Aguardando Cadastro
                                                </span>
                                            </div>

                                            {isOwner && (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => {
                                                            const url = `${window.location.origin}/join?email=${invite.email}`;
                                                            navigator.clipboard.writeText(url);
                                                            alert("Link copiado: " + url);
                                                        }}
                                                        className="p-2 text-zinc-500 hover:text-industrial-yellow hover:bg-industrial-yellow/10 rounded transition-colors"
                                                        title="Copiar Link de Convite"
                                                    >
                                                        <Copy size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancelInvite(invite.id)}
                                                        className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                                        title="Cancelar convite"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* PLAN STATUS */}
                        <section className="bg-zinc-900 border-2 border-zinc-800 p-6 rounded-xl relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div>
                                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Seu Plano</span>
                                    <h2 className="text-2xl font-black uppercase text-white flex items-center gap-2">
                                        {limits.label}
                                    </h2>
                                </div>
                                {plan === 'start' && (
                                    <button
                                        onClick={() => navigate('/checkout')}
                                        className="bg-industrial-yellow text-black text-xs font-bold uppercase px-3 py-1 rounded border border-black hover:bg-white transition-colors animate-pulse"
                                    >
                                        Fazer Upgrade
                                    </button>
                                )}
                            </div>

                            <div className="space-y-2 relative z-10">
                                <div className="flex justify-between text-xs font-bold uppercase text-zinc-400">
                                    <span>Utilização</span>
                                    <span>{usedSlots} / {limits.users === Infinity ? '∞' : limits.users} Usuários</span>
                                </div>
                                <div className="h-4 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
                                    <div
                                        className={`h-full transition-all duration-500 ${usedSlots >= limits.users ? 'bg-red-500' : 'bg-green-500'}`}
                                        style={{ width: `${Math.min(100, (usedSlots / (limits.users === Infinity ? 100 : limits.users)) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* ADD MEMBER */}
                        <section>
                            <h3 className="text-sm font-black uppercase text-zinc-500 mb-4 block">Adicionar Novo Membro</h3>

                            <form onSubmit={handleAddMember} className="space-y-4">
                                <div className="bg-industrial-surface border-2 border-industrial p-4 rounded-lg">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold uppercase text-zinc-400 mb-1 block">E-mail do Funcionário</label>
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                                    <input
                                                        type="email"
                                                        required
                                                        value={inviteEmail}
                                                        onChange={e => setInviteEmail(e.target.value)}
                                                        placeholder="joao@zeroperda.com.br"
                                                        className="w-full bg-zinc-900 border border-zinc-700 p-3 pl-10 text-white font-bold outline-none focus:border-white transition-colors rounded"
                                                        disabled={!canAdd || !isOwner}
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={!canAdd || adding || !isOwner}
                                                    className="bg-white text-black font-black uppercase px-4 rounded border-2 border-zinc-300 hover:bg-industrial-yellow hover:border-black transition-colors disabled:opacity-50 disabled:grayscale"
                                                >
                                                    {adding ? <Loader2 className="animate-spin" /> : <Plus size={20} strokeWidth={3} />}
                                                </button>
                                            </div>
                                        </div>

                                        {!canAdd && (
                                            <div className="text-xs text-red-400 font-bold uppercase flex items-center gap-2 bg-red-900/20 p-2 rounded">
                                                <AlertCircle size={14} />
                                                Limite de usuários atingido para este plano.
                                            </div>
                                        )}

                                        {!isOwner && (
                                            <div className="text-xs text-orange-400 font-bold uppercase flex items-center gap-2 bg-orange-900/20 p-2 rounded">
                                                <Shield size={14} />
                                                Apenas o dono pode adicionar membros.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {error && (
                                    <div className="text-xs text-red-500 font-bold uppercase animate-shake bg-red-950/50 p-3 border border-red-500/50 rounded">
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="text-xs text-green-500 font-bold uppercase animate-bounce bg-green-950/50 p-3 border border-green-500/50 rounded">
                                        {success}
                                    </div>
                                )}
                            </form>

                            <p className="text-[10px] text-zinc-500 mt-2 px-1">
                                * O usuário precisa criar uma conta no Zero Perda antes de ser adicionado.
                            </p>
                        </section>

                        {/* MEMBERS LIST */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-black uppercase text-zinc-500 block">Equipe Atual</h3>

                            <div className="space-y-2">
                                {members.map(member => (
                                    <div key={member.id} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg flex items-center justify-between group hover:border-zinc-600 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${member.role === 'owner' ? 'bg-industrial-yellow text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                                                {member.role === 'owner' ? <Crown size={16} fill="currentColor" /> : <Users size={16} />}
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold text-sm">
                                                    {member.profiles?.full_name || 'Usuário'}
                                                </h4>
                                                <span className="text-xs text-zinc-500 font-mono">
                                                    {member.profiles?.email || 'Email oculto'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${member.role === 'owner' ? 'bg-industrial-yellow/20 text-industrial-yellow' : 'bg-zinc-800 text-zinc-400'}`}>
                                                {member.role === 'owner' ? 'Dono' : 'Membro'}
                                            </span>

                                            {isOwner && member.role !== 'owner' && (
                                                <button
                                                    onClick={() => handleRemove(member.user_id)}
                                                    className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Remover membro"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </main>

            <BottomNav />
        </AppShell>
    );
}
