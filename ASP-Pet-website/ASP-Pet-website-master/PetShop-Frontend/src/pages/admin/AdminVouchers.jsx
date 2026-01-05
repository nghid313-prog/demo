import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Tag, Plus, Edit2, Trash2, Search, X, AlertTriangle, Calendar, Percent, Copy } from 'lucide-react';
import api from '../../api/axios';

const AdminVouchers = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState(null);
    const [formData, setFormData] = useState({
        Code: '',
        Discount_type: 'percent',
        Discount_value: 10,
        Start_date: '',
        End_date: '',
        Max_usage: 100,
        IsDeleted: false
    });

    const { data: vouchers, isLoading } = useQuery({
        queryKey: ['adminVouchers'],
        queryFn: () => api.get('/Voucher/all').then(res => res.data),
    });

    const createMutation = useMutation({
        mutationFn: (data) => api.post('/Voucher/create', data),
        onSuccess: () => {
            toast.success('Tạo voucher thành công!', {
                style: { borderRadius: '12px', background: '#000', color: '#fff', border: '3px solid #4ADE80' }
            });
            queryClient.invalidateQueries(['adminVouchers']);
            closeModal();
        },
        onError: () => {
            toast.error('Tạo voucher thất bại!', {
                style: { borderRadius: '12px', background: '#000', color: '#fff', border: '3px solid #FF5757' }
            });
        }
    });

    const editMutation = useMutation({
        mutationFn: ({ id, data }) => api.post(`/Voucher/edit/${id}`, data),
        onSuccess: () => {
            toast.success('Cập nhật voucher thành công!', {
                style: { borderRadius: '12px', background: '#000', color: '#fff', border: '3px solid #4ADE80' }
            });
            queryClient.invalidateQueries(['adminVouchers']);
            closeModal();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/Voucher/delete/${id}`),
        onSuccess: () => {
            toast.success('Xóa voucher thành công!', {
                style: { borderRadius: '12px', background: '#000', color: '#fff', border: '3px solid #4ADE80' }
            });
            queryClient.invalidateQueries(['adminVouchers']);
            setDeleteId(null);
        },
    });

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingVoucher(null);
        setFormData({ Code: '', Discount_type: 'percent', Discount_value: 10, Start_date: '', End_date: '', Max_usage: 100, IsDeleted: false });
    };

    const openCreateModal = () => {
        setEditingVoucher(null);
        setFormData({ Code: '', Discount_type: 'percent', Discount_value: 10, Start_date: '', End_date: '', Max_usage: 100, IsDeleted: false });
        setIsModalOpen(true);
    };

    const openEditModal = (voucher) => {
        setEditingVoucher(voucher);
        setFormData({
            Code: voucher.code || '',
            Discount_type: voucher.discount_type || 'percent',
            Discount_value: voucher.discount_value || 10,
            Start_date: voucher.start_date?.split('T')[0] || '',
            End_date: voucher.end_date?.split('T')[0] || '',
            Max_usage: voucher.max_usage || 100,
            IsDeleted: voucher.isDeleted || false
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingVoucher) {
            editMutation.mutate({ id: editingVoucher.voucher_id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        toast.success('Đã copy mã voucher!', {
            style: { borderRadius: '12px', background: '#000', color: '#fff', border: '3px solid #FFDE59' }
        });
    };

    const filteredVouchers = vouchers?.filter(v =>
        v.code?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

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
                        Quản lý <span className="text-primary">Voucher</span>
                    </h1>
                    <p className="text-slate-500 font-bold mt-1">{filteredVouchers.length} voucher</p>
                </div>
                <button onClick={openCreateModal} className="brutal-btn-primary py-3 px-6">
                    <Plus className="w-5 h-5" /> Thêm voucher
                </button>
            </div>

            {/* Search */}
            <div className="brutal-card !p-4 flex items-center gap-4 hover:translate-x-0 hover:translate-y-0">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Tìm theo mã voucher..."
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

            {/* Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVouchers.map((voucher) => (
                    <div key={voucher.voucher_id} className="brutal-card !p-6 hover:translate-x-0 hover:translate-y-0">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-12 h-12 bg-primary brutal-border rounded-xl flex items-center justify-center">
                                    <Tag className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-black text-lg">{voucher.code}</p>
                                    <p className="text-xs text-slate-500">ID: {voucher.voucher_id}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => copyCode(voucher.code)}
                                className="p-2 hover:bg-slate-100 rounded-lg"
                            >
                                <Copy className="w-4 h-4 text-slate-400" />
                            </button>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500 flex items-center gap-1">
                                    <Percent className="w-4 h-4" /> Giảm giá
                                </span>
                                <span className="font-black text-secondary">
                                    {voucher.discount_type === 'percent' ? `${voucher.discount_value}%` : `${voucher.discount_value?.toLocaleString()}đ`}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500 flex items-center gap-1">
                                    <Calendar className="w-4 h-4" /> Hết hạn
                                </span>
                                <span className="font-bold text-sm">
                                    {voucher.end_date ? new Date(voucher.end_date).toLocaleDateString('vi-VN') : '-'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Đã dùng / Tổng</span>
                                <span className="font-bold">{voucher.current_usage || 0} / {voucher.max_usage}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => openEditModal(voucher)}
                                className="flex-1 brutal-btn-secondary py-2 text-sm"
                            >
                                <Edit2 className="w-4 h-4" /> Sửa
                            </button>
                            <button
                                onClick={() => setDeleteId(voucher.voucher_id)}
                                className="brutal-btn bg-red-100 text-red-600 py-2 px-4 text-sm hover:bg-red-200"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
                    <div className="brutal-card bg-white !p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-black uppercase mb-6">
                            {editingVoucher ? 'Sửa voucher' : 'Thêm voucher mới'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-black uppercase text-xs mb-2">Mã voucher</label>
                                <input
                                    type="text"
                                    className="brutal-input"
                                    value={formData.Code}
                                    onChange={(e) => setFormData({ ...formData, Code: e.target.value.toUpperCase() })}
                                    placeholder="VD: SALE50"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-black uppercase text-xs mb-2">Loại giảm giá</label>
                                    <select
                                        className="brutal-input"
                                        value={formData.Discount_type}
                                        onChange={(e) => setFormData({ ...formData, Discount_type: e.target.value })}
                                        required
                                    >
                                        <option value="percent">Phần trăm (%)</option>
                                        <option value="fixed">Cố định (VNĐ)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-black uppercase text-xs mb-2">Giá trị</label>
                                    <input
                                        type="number"
                                        className="brutal-input"
                                        value={formData.Discount_value}
                                        onChange={(e) => setFormData({ ...formData, Discount_value: parseInt(e.target.value) })}
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-black uppercase text-xs mb-2">Ngày bắt đầu</label>
                                    <input
                                        type="date"
                                        className="brutal-input"
                                        value={formData.Start_date}
                                        onChange={(e) => setFormData({ ...formData, Start_date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block font-black uppercase text-xs mb-2">Ngày kết thúc</label>
                                    <input
                                        type="date"
                                        className="brutal-input"
                                        value={formData.End_date}
                                        onChange={(e) => setFormData({ ...formData, End_date: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block font-black uppercase text-xs mb-2">Số lượng sử dụng tối đa</label>
                                <input
                                    type="number"
                                    className="brutal-input"
                                    value={formData.Max_usage}
                                    onChange={(e) => setFormData({ ...formData, Max_usage: parseInt(e.target.value) })}
                                    min="1"
                                    required
                                />
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button type="button" onClick={closeModal} className="flex-1 brutal-btn-secondary py-3">
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending || editMutation.isPending}
                                    className="flex-1 brutal-btn-primary py-3"
                                >
                                    {createMutation.isPending || editMutation.isPending ? 'Đang lưu...' : 'Lưu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
                    <div className="brutal-card bg-white !p-8 max-w-md w-full">
                        <div className="w-16 h-16 bg-red-100 brutal-border rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-2xl font-black uppercase text-center mb-4">Xác nhận xóa?</h3>
                        <p className="text-slate-500 text-center mb-8">Hành động này không thể hoàn tác.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setDeleteId(null)} className="flex-1 brutal-btn-secondary py-3">Hủy</button>
                            <button
                                onClick={() => deleteMutation.mutate(deleteId)}
                                disabled={deleteMutation.isPending}
                                className="flex-1 brutal-btn bg-red-500 text-white py-3 hover:bg-red-600"
                            >
                                {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVouchers;
