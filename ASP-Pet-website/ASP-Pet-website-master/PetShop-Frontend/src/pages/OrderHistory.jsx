import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Truck, ArrowRight, ShoppingBag, Calendar } from 'lucide-react';
import api from '../api/axios';

const OrderHistory = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    const { data: orders, isLoading, error } = useQuery({
        queryKey: ['orders', user.email],
        queryFn: () => api.get(`/Checkout/list/${user.email}`).then(res => res.data),
        enabled: !!token && !!user.email,
    });

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'đã giao':
            case 'hoàn thành':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'đang giao':
                return <Truck className="w-5 h-5 text-accent" />;
            case 'đã hủy':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Clock className="w-5 h-5 text-yellow-500" />;
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

    if (!token || !user.email) {
        return (
            <div className="pt-40 pb-20 px-6 max-w-4xl mx-auto text-center">
                <Package className="w-24 h-24 mx-auto mb-8 text-slate-300" />
                <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">
                    Vui lòng <span className="text-accent">đăng nhập</span>
                </h1>
                <Link to="/login" className="brutal-btn-primary py-4 px-10 text-lg inline-flex">
                    Đăng nhập ngay
                </Link>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="pt-40 pb-20 px-6 max-w-5xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-12">
                    Lịch sử <span className="text-primary">đơn hàng</span>
                </h1>
                <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="brutal-card h-32 animate-pulse bg-slate-100"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error || !orders || orders.length === 0) {
        return (
            <div className="pt-40 pb-20 px-6 max-w-4xl mx-auto text-center">
                <ShoppingBag className="w-24 h-24 mx-auto mb-8 text-slate-300" />
                <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">
                    Chưa có <span className="text-secondary">đơn hàng</span>
                </h1>
                <p className="font-bold text-slate-500 mb-10 text-xl">
                    Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!
                </p>
                <Link to="/shop" className="brutal-btn-primary py-4 px-10 text-lg inline-flex">
                    <ShoppingBag className="w-5 h-5" /> Mua sắm ngay
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-40 pb-20 px-6 max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-12">
                Lịch sử <span className="text-primary">đơn hàng</span>
            </h1>

            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order.id} className="brutal-card !p-6 hover:translate-x-0 hover:translate-y-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-slate-100 brutal-border rounded-xl flex items-center justify-center">
                                    <Package className="w-7 h-7 text-accent" />
                                </div>
                                <div>
                                    <p className="font-black text-lg">Đơn hàng #{order.id}</p>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(order.createAt).toLocaleDateString('vi-VN')}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className={`brutal-badge ${getStatusColor(order.status)} flex items-center gap-2`}>
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                </div>
                                <p className="font-black text-xl text-primary">
                                    {order.total?.toLocaleString()}đ
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t-2 border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="text-sm text-slate-500">
                                <span className="font-bold">Thanh toán:</span> {order.payment}
                            </div>
                            <Link
                                to={`/orders/${order.id}`}
                                className="brutal-btn-secondary py-2 px-6 text-sm"
                            >
                                Xem chi tiết <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory;
