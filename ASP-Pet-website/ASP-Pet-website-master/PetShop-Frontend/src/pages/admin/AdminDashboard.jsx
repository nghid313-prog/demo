import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { PawPrint, ShoppingBag, Package, Users, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import api from '../../api/axios';

const AdminDashboard = () => {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: async () => {
            const res = await api.get('/Dashboard/get-all');
            return res.data;
        }
    });

    const statCards = [
        {
            title: 'Tổng thú cưng',
            value: stats?.totalPet || 0,
            icon: PawPrint,
            color: 'bg-accent',
            link: '/admin/pets'
        },
        {
            title: 'Tổng sản phẩm',
            value: stats?.totalProduct || 0,
            icon: ShoppingBag,
            color: 'bg-secondary',
            link: '/admin/products'
        },
        {
            title: 'Tổng đơn hàng',
            value: stats?.totalInvoice || 0,
            icon: Package,
            color: 'bg-primary',
            link: '/admin/orders'
        },
        {
            title: 'Tổng người dùng',
            value: stats?.totalUser || 0,
            icon: Users,
            color: 'bg-green-500',
            link: '/admin/users'
        }
    ];

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="brutal-card h-36 animate-pulse bg-slate-100"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                    Bảng <span className="text-primary">điều khiển</span>
                </h1>
                <p className="text-slate-500 font-bold mt-2">Chào mừng quay lại, Admin!</p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card) => (
                    <Link key={card.title} to={card.link} className="brutal-card !p-6 group hover:translate-x-0 hover:translate-y-0">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-14 h-14 ${card.color} brutal-border rounded-xl flex items-center justify-center text-white`}>
                                <card.icon className="w-7 h-7" />
                            </div>
                            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-sm font-bold text-slate-500 uppercase">{card.title}</p>
                        <p className="text-4xl font-black mt-1">{card.value.toLocaleString()}</p>
                    </Link>
                ))}
            </div>

            {/* Revenue Card */}
            <div className="brutal-card bg-black text-white !p-8 hover:translate-x-0 hover:translate-y-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-primary brutal-border rounded-2xl flex items-center justify-center">
                            <DollarSign className="w-10 h-10 text-black" />
                        </div>
                        <div>
                            <p className="text-slate-400 font-bold uppercase text-sm">Tổng doanh thu</p>
                            <p className="text-5xl md:text-6xl font-black italic text-primary mt-1">
                                {(stats?.totalMoney || 0).toLocaleString()}đ
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-xl">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-bold">+12% so với tháng trước</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
                <Link to="/admin/pets" className="brutal-card !p-6 bg-accent/10 hover:bg-accent/20 hover:translate-x-0 hover:translate-y-0 group">
                    <PawPrint className="w-10 h-10 text-accent mb-4" />
                    <h3 className="font-black uppercase text-lg">Thêm thú cưng mới</h3>
                    <p className="text-slate-500 text-sm mt-1">Quản lý danh sách thú cưng</p>
                    <ArrowRight className="w-5 h-5 text-accent mt-4 group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link to="/admin/products" className="brutal-card !p-6 bg-secondary/10 hover:bg-secondary/20 hover:translate-x-0 hover:translate-y-0 group">
                    <ShoppingBag className="w-10 h-10 text-secondary mb-4" />
                    <h3 className="font-black uppercase text-lg">Thêm sản phẩm mới</h3>
                    <p className="text-slate-500 text-sm mt-1">Quản lý kho sản phẩm</p>
                    <ArrowRight className="w-5 h-5 text-secondary mt-4 group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link to="/admin/orders" className="brutal-card !p-6 bg-primary/10 hover:bg-primary/20 hover:translate-x-0 hover:translate-y-0 group">
                    <Package className="w-10 h-10 text-black mb-4" />
                    <h3 className="font-black uppercase text-lg">Xem đơn hàng</h3>
                    <p className="text-slate-500 text-sm mt-1">Xử lý đơn hàng mới</p>
                    <ArrowRight className="w-5 h-5 text-black mt-4 group-hover:translate-x-2 transition-transform" />
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
