import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Package, Plus, Search, X, Calendar, Phone, MapPin, FileText, DollarSign, AlertTriangle } from 'lucide-react';
import api from '../../api/axios';

const AdminGoods = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        productName: '',
        quantity: 1,
        price: 0,
        supplier: '',
        address: '',
        phoneNumber: '',
        note: '',
    });

    const { data: goods, isLoading } = useQuery({
        queryKey: ['adminGoods'],
        queryFn: () => api.get('/Goods/get-all').then(res => res.data),
    });

    const createMutation = useMutation({
        mutationFn: (data) => api.post('/Goods/create-goods', data),
        onSuccess: () => {
            toast.success('Tạo phiếu nhập thành công!', {
                style: { borderRadius: '12px', background: '#000', color: '#fff', border: '3px solid #4ADE80' }
            });
            queryClient.invalidateQueries(['adminGoods']);
            setIsModalOpen(false);
            setFormData({ productName: '', quantity: 1, price: 0, supplier: '', address: '', phoneNumber: '', note: '' });
        },
        onError: () => {
            toast.error('Tạo phiếu nhập thất bại!', {
                style: { borderRadius: '12px', background: '#000', color: '#fff', border: '3px solid #FF5757' }
            });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    const filteredGoods = goods?.filter(g =>
        g.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const totalValue = filteredGoods.reduce((sum, g) => sum + (g.total || 0), 0);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="skeleton h-20"></div>
                <div className="skeleton h-96"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter">
                        Quản lý <span className="text-secondary">nhập hàng</span>
                    </h1>
                    <p className="text-slate-500 font-bold mt-1">{filteredGoods.length} phiếu nhập</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="brutal-btn-primary py-3 px-6">
                    <Plus className="w-5 h-5" /> Tạo phiếu nhập
                </button>
            </div>

            {/* Stats */}
            <div className="brutal-card bg-black text-white !p-6 hover:translate-x-0 hover:translate-y-0">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-sm uppercase font-bold">Tổng giá trị nhập</p>
                        <p className="text-4xl font-black text-primary">{totalValue.toLocaleString()}đ</p>
                    </div>
                    <DollarSign className="w-12 h-12 text-primary" />
                </div>
            </div>

            {/* Search */}
            <div className="brutal-card !p-4 flex items-center gap-4 hover:translate-x-0 hover:translate-y-0">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Tìm theo tên sản phẩm, nhà cung cấp..."
                    className="flex-1 bg-transparent font-bold outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="p-1 hover:bg-slate-100 rounded">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="brutal-card !p-0 overflow-hidden hover:translate-x-0 hover:translate-y-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b-4 border-black">
                            <tr>
                                <th className="text-left p-4 font-black uppercase text-xs">ID</th>
                                <th className="text-left p-4 font-black uppercase text-xs">Sản phẩm</th>
                                <th className="text-left p-4 font-black uppercase text-xs">Nhà cung cấp</th>
                                <th className="text-left p-4 font-black uppercase text-xs">SL</th>
                                <th className="text-left p-4 font-black uppercase text-xs">Đơn giá</th>
                                <th className="text-left p-4 font-black uppercase text-xs">Tổng</th>
                                <th className="text-left p-4 font-black uppercase text-xs">Ngày tạo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGoods.map((g) => (
                                <tr key={g.goodsId} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="p-4 font-black">#{g.goodsId}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-secondary/10 brutal-border rounded-lg flex items-center justify-center">
                                                <Package className="w-5 h-5 text-secondary" />
                                            </div>
                                            <span className="font-bold">{g.productName}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 font-bold text-sm">{g.supplier || '-'}</td>
                                    <td className="p-4 font-black">{g.quantity}</td>
                                    <td className="p-4 font-bold">{g.price?.toLocaleString()}đ</td>
                                    <td className="p-4 font-black text-primary">{g.total?.toLocaleString()}đ</td>
                                    <td className="p-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(g.createAt).toLocaleDateString('vi-VN')}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 overflow-y-auto">
                    <div className="brutal-card bg-white !p-8 max-w-lg w-full my-8">
                        <h3 className="text-2xl font-black uppercase mb-6">Tạo phiếu nhập hàng</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-black uppercase text-xs mb-2">Tên sản phẩm</label>
                                <input
                                    type="text"
                                    className="brutal-input"
                                    value={formData.productName}
                                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-black uppercase text-xs mb-2">Số lượng</label>
                                    <input
                                        type="number"
                                        className="brutal-input"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                        min="1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block font-black uppercase text-xs mb-2">Đơn giá</label>
                                    <input
                                        type="number"
                                        className="brutal-input"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block font-black uppercase text-xs mb-2">Nhà cung cấp</label>
                                <input
                                    type="text"
                                    className="brutal-input"
                                    value={formData.supplier}
                                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-black uppercase text-xs mb-2">Địa chỉ</label>
                                <input
                                    type="text"
                                    className="brutal-input"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-black uppercase text-xs mb-2">Số điện thoại</label>
                                <input
                                    type="tel"
                                    className="brutal-input"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-black uppercase text-xs mb-2">Ghi chú</label>
                                <textarea
                                    className="brutal-input min-h-[80px]"
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                />
                            </div>
                            <div className="brutal-card bg-slate-50 !p-4">
                                <p className="text-xs text-slate-400 uppercase font-black mb-1">Thành tiền</p>
                                <p className="text-2xl font-black text-primary">{(formData.quantity * formData.price).toLocaleString()}đ</p>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 brutal-btn-secondary py-3">
                                    Hủy
                                </button>
                                <button type="submit" disabled={createMutation.isPending} className="flex-1 brutal-btn-primary py-3">
                                    {createMutation.isPending ? 'Đang tạo...' : 'Tạo phiếu nhập'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminGoods;
