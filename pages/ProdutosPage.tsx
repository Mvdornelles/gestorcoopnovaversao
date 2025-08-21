import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { getProducts, addProduct, updateProduct, deleteProduct, Produto } from '../services/api';
import { Plus, Search, Edit, Trash2, Power } from 'lucide-react';

const categoryColors: { [key: string]: string } = {
    'Crédito': 'bg-blue-100 text-blue-800',
    'Investimentos': 'bg-green-100 text-green-800',
    'Seguros': 'bg-yellow-100 text-yellow-800',
    'Consórcios': 'bg-purple-100 text-purple-800',
    'Serviços': 'bg-pink-100 text-pink-800',
};

type ProdutoFormData = Omit<Produto, 'id' | 'created_at' | 'user_id'>;

const ProdutoForm: React.FC<{
    produto?: Produto | null;
    onClose: () => void;
    onSave: (data: ProdutoFormData, id?: number) => void;
}> = ({ produto, onClose, onSave }) => {
    const [formData, setFormData] = useState<ProdutoFormData>({
        name: produto?.name || '',
        category: produto?.category || 'Serviços',
        price: produto?.price || 0,
        description: produto?.description || '',
        active: produto?.active ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, produto?.id);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-neutral-700">Nome do Produto</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Categoria</label>
                    <select value={formData.category ?? ''} onChange={e => setFormData({ ...formData, category: e.target.value })} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-white text-neutral-900">
                        {Object.keys(categoryColors).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-neutral-700">Preço Base/Taxa</label>
                    <input type="number" step="0.01" value={formData.price ?? 0} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-neutral-700">Descrição</label>
                <textarea rows={3} value={formData.description ?? ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"></textarea>
            </div>
            <div className="flex items-center">
                <input type="checkbox" id="active" checked={formData.active} onChange={e => setFormData({ ...formData, active: e.target.checked })} className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary" />
                <label htmlFor="active" className="ml-2 block text-sm text-neutral-900">Produto Ativo</label>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                <Button type="submit">{produto ? 'Salvar Alterações' : 'Criar Produto'}</Button>
            </div>
        </form>
    );
};


const ProdutoCard: React.FC<{ produto: Produto; onEdit: (p: Produto) => void; onDelete: (id: number) => void; }> = ({ produto, onEdit, onDelete }) => (
    <Card className="flex flex-col group">
        <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-neutral-800 pr-2">{produto.name}</h3>
            <div className="flex -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" onClick={() => onEdit(produto)} aria-label="Editar"><Edit size={16}/></Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(produto.id)} aria-label="Excluir"><Trash2 size={16} className="text-red-500 hover:text-red-600"/></Button>
            </div>
        </div>
        <p className="text-neutral-500 mt-2 flex-grow">{produto.description}</p>
        <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div className="flex flex-col">
                <span className="text-xs text-neutral-500">Categoria</span>
                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${categoryColors[produto.category ?? ''] || 'bg-gray-100 text-gray-800'}`}>
                    {produto.category}
                </span>
            </div>
            <div className="flex flex-col items-end">
                 <span className="text-xs text-neutral-500">Preço/Taxa</span>
                <span className="text-sm font-bold text-neutral-800">
                    {(produto.price ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
            </div>
            <div className="flex flex-col items-end">
                 <span className="text-xs text-neutral-500">Status</span>
                <span className={`text-sm font-semibold flex items-center gap-1 ${produto.active ? 'text-green-600' : 'text-red-600'}`}>
                    <Power size={14}/> {produto.active ? 'Ativo' : 'Inativo'}
                </span>
            </div>
        </div>
    </Card>
);

const ProdutosPage: React.FC = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Todos');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduto, setEditingProduto] = useState<Produto | null>(null);

    const fetchProdutos = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getProducts();
            setProdutos(data);
            setError(null);
        } catch (err) {
            setError('Falha ao carregar os produtos.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProdutos();
    }, [fetchProdutos]);

    const handleOpenModal = (produto: Produto | null = null) => {
        setEditingProduto(produto);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduto(null);
    };

    const handleSaveProduto = async (formData: ProdutoFormData, id?: number) => {
        try {
            if (id) {
                await updateProduct(id, formData);
            } else {
                await addProduct(formData);
            }
            await fetchProdutos(); // Refresh list
            handleCloseModal();
        } catch (err) {
            console.error("Failed to save product", err);
            alert("Falha ao salvar o produto. Tente novamente.");
        }
    };

    const handleDeleteProduto = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                await deleteProduct(id);
                await fetchProdutos(); // Refresh list
            } catch (err) {
                console.error("Failed to delete product", err);
                alert("Falha ao excluir o produto. Tente novamente.");
            }
        }
    };
    
    const categories = useMemo(() => ['Todos', ...Array.from(new Set(produtos.map(p => p.category).filter(Boolean)))], [produtos]);

    const filteredProdutos = useMemo(() => {
        return produtos.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = categoryFilter === 'Todos' || p.category === categoryFilter;
            const matchesStatus = statusFilter === 'Todos' || (statusFilter === 'Ativos' && p.active) || (statusFilter === 'Inativos' && !p.active);
            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [produtos, searchQuery, categoryFilter, statusFilter]);

    return (
        <div className="space-y-6">
             <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-800">Catálogo de Produtos</h1>
                    <p className="text-neutral-500 mt-1">Gerencie os produtos e serviços oferecidos pela cooperativa.</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="mt-4 md:mt-0" animated>
                    <Plus size={20} className="mr-2" />
                    Adicionar Novo Produto
                </Button>
            </div>
            
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-neutral-700">Buscar</label>
                        <div className="relative">
                            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input type="text" placeholder="Nome ou descrição..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="mt-1 w-full bg-white rounded-lg pl-10 pr-4 py-2 border focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700">Categoria</label>
                        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-white text-neutral-900">
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700">Status</label>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-white text-neutral-900">
                            <option>Todos</option>
                            <option>Ativos</option>
                            <option>Inativos</option>
                        </select>
                    </div>
                </div>
            </Card>

            {loading && <p>Carregando produtos...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProdutos.length > 0 ? (
                        filteredProdutos.map(produto => (
                            <ProdutoCard key={produto.id} produto={produto} onEdit={handleOpenModal} onDelete={handleDeleteProduto} />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-neutral-500">Nenhum produto encontrado.</p>
                    )}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingProduto ? 'Editar Produto' : 'Criar Novo Produto'}>
                <ProdutoForm 
                    produto={editingProduto}
                    onClose={handleCloseModal}
                    onSave={handleSaveProduto}
                />
            </Modal>
        </div>
    );
};

export default ProdutosPage;
