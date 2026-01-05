import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, ArrowLeft, MapPin, Phone, Mail, User, CreditCard, Calendar, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import api from '../api/axios';

const OrderDetail = () => {
    const { id } = useParams();

    const { data: order, isLoading, error } = useQuery({
        queryKey: ['order', id],
        queryFn: () => api.get(`/Checkout/detail/${id}`).then(res => res.data),
        enabled: !!id,
    });

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'đã giao':
            case 'hoàn thành':
                return <CheckCircle className="w-6 h-6" />;
            case 'đang giao':
                return <Truck className="w-6 h-6" />;
            case 'đã hủy':
                return <XCircle className="w-6 h-6" />;
            default:
                return <Clock className="w-6 h-6" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'đã giao':
            case 'hoàn thành':
                return 'bg-green-500';
            case 'đang giao':
                return 'bg-accent';
            case 'đã hủy':
                return 'bg-red-500';
            default:
                return 'bg-yellow-500';
        }
    };

    if (isLoading) {
        return (
            <div className="pt-40 pb-20 px-6 max-w-5xl mx-auto">
                <div className="brutal-card h-64 animate-pulse bg-slate-100"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="pt-40 pb-20 px-6 max-w-4xl mx-auto text-center">
                <Package className="w-24 h-24 mx-auto mb-8 text-slate-300" />
                <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">
                    Không tìm thấy <span className="text-secondary">đơn hàng</span>
                </h1>
                <Link to="/orders" className="brutal-btn-primary py-4 px-10 text-lg inline-flex">
                    <ArrowLeft className="w-5 h-5" /> Quay lại
                </Link>
            </div>
        );
    }

    // Parse order items from Data field
    let orderItems = [];
    try {
        orderItems = JSON.parse(order.data || '[]');
    } catch (e) {
        console.error('Error parsing order data:', e);
    }

    return (
        <div className="pt-40 pb-20 px-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-12">
                <Link to="/orders" className="brutal-btn-secondary py-3 px-6">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                        Đơn hàng <span className="text-primary">#{order.id}</span>
                    </h1>
                    <div className="flex items-center gap-2 text-slate-500 mt-1">
                        <Calendar className="w-4 h-4" />
                        <span className="font-bold">{new Date(order.createAt).toLocaleDateString('vi-VN', {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        })}</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Order Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status */}
                    <div className={`brutal-card !p-6 ${getStatusColor(order.status)} text-white hover:translate-x-0 hover:translate-y-0`}>
                        <div className="flex items-center gap-4">
                            {getStatusIcon(order.status)}
                            <div>
                                <p className="font-black uppercase text-xl">{order.status}</p>
                                <p className="text-sm opacity-80">Cập nhật lần cuối: {new Date(order.updatedAt).toLocaleString('vi-VN')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="brutal-card !p-6 hover:translate-x-0 hover:translate-y-0">
                        <h3 className="font-black uppercase text-lg mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-accent" /> Thông tin khách hàng
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-3">
                                <User className="w-4 h-4 text-slate-400" />
                                <span className="font-bold">{order.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-slate-400" />
                                <span className="font-bold">{order.phoneNumber}</span>
                            </div>
                            <div className="flex items-center gap-3 sm:col-span-2">
                                <Mail className="w-4 h-4 text-slate-400" />
                                <span className="font-bold">{order.email}</span>
                            </div>
                            <div className="flex items-start gap-3 sm:col-span-2">
                                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                                <span className="font-bold">{order.address}</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="brutal-card !p-6 hover:translate-x-0 hover:translate-y-0">
                        <h3 className="font-black uppercase text-lg mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-secondary" /> Sản phẩm
                        </h3>
                        <div className="space-y-4">
                            {orderItems.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 brutal-border rounded-lg flex items-center justify-center">
                                            <Package className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="font-bold">{item.name}</p>
                                            <p className="text-sm text-slate-500">
                                                {item.type === 'animal' ? 'Thú cưng' : 'Sản phẩm'} × {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-black text-primary">
                                        {((item.price || 0) * item.quantity).toLocaleString()}đ
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="brutal-card bg-black text-white !p-6 sticky top-32 hover:translate-x-0 hover:translate-y-0">
                        <h3 className="font-black uppercase text-lg mb-6">Tổng kết</h3>

                        <div className="space-y-4 mb-6 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Phương thức</span>
                                <span className="font-bold flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" /> {order.payment}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Phí vận chuyển</span>
                                <span className="font-bold text-green-400">Miễn phí</span>
                            </div>
                            <div className="border-t border-slate-700 pt-4 flex justify-between font-black text-2xl">
                                <span>Tổng cộng</span>
                                <span className="text-primary">{order.total?.toLocaleString()}đ</span>
                            </div>
                        </div>

                        <Link to="/shop" className="w-full brutal-btn bg-primary text-black hover:bg-yellow-400 py-4">
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
