import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Package, Search, X, Eye, Clock, CheckCircle, Truck, XCircle, Calendar } from 'lucide-react';
import api from '../../api/axios';

const AdminOrders = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    const { data: orders, isLoading } = useQuery({
        queryKey: ['adminOrders'],
        queryFn: () => api.get('/Checkout/get-all').then(res => res.data),
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, order, status }) => api.put(`/Checkout/update/${id}`, {
            Status: status,
            Address: order.address || '',
            Payment: order.payment || '',
            Email: order.email || '',
            PhoneNumber: order.phoneNumber || '',
            Name: order.name || ''
        }),
        onSuccess: () => {
            toast.success('Cập nhật trạng thái thành công!', {
                style: { borderRadius: '12px', background: '#000', color: '#fff', border: '3px solid #4ADE80' }
            });
            queryClient.invalidateQueries(['adminOrders']);
            setSelectedOrder(null);
        },
        onError: () => {
            toast.error('Cập nhật thất bại!', {
                style: { borderRadius: '12px', background: '#000', color: '#fff', border: '3px solid #FF5757' }
            });
        }
    });

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'đã giao':
            case 'hoàn thành':
                return <CheckCircle className="w-4 h-4" />;
            case 'đang giao':
                return <Truck className="w-4 h-4" />;
            case 'đã hủy':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'đã giao':
            case 'hoàn thành':
                return 'bg-green-100 text-green-700';
            case 'đang giao':
                return 'bg-blue-100 text-blue-700';
            case 'đã hủy':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-yellow-100 text-yellow-700';
        }
    };

    const statusOptions = ['Đang xử lý', 'Đang giao', 'Đã giao', 'Hoàn thành', 'Đã hủy'];

    const filteredOrders = orders?.filter(o =>
        o.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.id?.toString().includes(searchTerm)
    ) || [];

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="brutal-card h-20 animate-pulse bg-slate-100"></div>
                <div className="brutal-card h-96 animate-pulse bg-slate-100"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter">
                    Quản lý <span className="text-primary">đơn hàng</span>
                </h1>
                <p className="text-slate-500 font-bold mt-1">{filteredOrders.length} đơn hàng</p>
            </div>

            {filteredOrders.length === 0 && (
                <div className="brutal-card bg-slate-50 !p-12 text-center hover:translate-x-0 hover:translate-y-0">
                    <Package className="w-24 h-24 mx-auto mb-6 text-slate-300" />
                    <h2 className="text-2xl font-black uppercase mb-4">Chưa có đơn hàng nào</h2>
                    <p className="text-slate-500">Đơn hàng sẽ xuất hiện ở đây khi khách hàng đặt hàng.</p>
                </div>
            )}

            {/* Search */}
            <div className="brutal-card !p-4 flex items-center gap-4 hover:translate-x-0 hover:translate-y-0">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Tìm theo ID, tên hoặc email..."
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
                                <th className="text-left p-4 font-black uppercase text-xs">Khách hàng</th>
                                <th className="text-left p-4 font-black uppercase text-xs">Ngày</th>
                                <th className="text-left p-4 font-black uppercase text-xs">Tổng tiền</th>
                                <th className="text-left p-4 font-black uppercase text-xs">Trạng thái</th>
                                <th className="text-right p-4 font-black uppercase text-xs">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="p-4 font-black">#{order.id}</td>
                                    <td className="p-4">
                                        <p className="font-bold">{order.name}</p>
                                        <p className="text-xs text-slate-500">{order.email}</p>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(order.createAt).toLocaleDateString('vi-VN')}
                                        </div>
                                    </td>
                                    <td className="p-4 font-black text-primary">{order.total?.toLocaleString()}đ</td>
                                    <td className="p-4">
                                        <span className={`brutal-badge ${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setNewStatus(order.status);
                                                }}
                                                className="p-2 brutal-border rounded-lg bg-accent/10 hover:bg-accent/20 text-accent"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 overflow-y-auto">
                    <div className="brutal-card bg-white !p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-black uppercase">Đơn hàng #{selectedOrder.id}</h3>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Customer Info */}
                            <div className="brutal-card bg-slate-50 !p-4">
                                <p className="font-black uppercase text-xs text-slate-400 mb-2">Khách hàng</p>
                                <p className="font-bold">{selectedOrder.name}</p>
                                <p className="text-sm text-slate-500">{selectedOrder.email}</p>
                                <p className="text-sm text-slate-500">{selectedOrder.phoneNumber}</p>
                                <p className="text-sm text-slate-500 mt-2">{selectedOrder.address}</p>
                            </div>

                            {/* Status Update */}
                            <div>
                                <p className="font-black uppercase text-xs text-slate-400 mb-2">Cập nhật trạng thái</p>
                                <div className="flex gap-2 flex-wrap">
                                    {statusOptions.map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => setNewStatus(status)}
                                            className={`px-4 py-2 brutal-border rounded-lg font-bold text-sm transition-all ${newStatus === status
                                                ? 'bg-primary'
                                                : 'bg-white hover:bg-slate-50'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Order Info */}
                            <div className="brutal-card bg-black text-white !p-4">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Tổng tiền</span>
                                    <span className="font-black text-xl text-primary">{selectedOrder.total?.toLocaleString()}đ</span>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span className="text-slate-400">Thanh toán</span>
                                    <span className="font-bold">{selectedOrder.payment}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="flex-1 brutal-btn-secondary py-3"
                                >
                                    Đóng
                                </button>
                                <button
                                    onClick={() => updateStatusMutation.mutate({ id: selectedOrder.id, order: selectedOrder, status: newStatus })}
                                    disabled={updateStatusMutation.isPending || newStatus === selectedOrder.status}
                                    className="flex-1 brutal-btn-primary py-3 disabled:opacity-50"
                                >
                                    {updateStatusMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
