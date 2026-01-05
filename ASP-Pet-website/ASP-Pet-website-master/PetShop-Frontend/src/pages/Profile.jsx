import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { authApi } from '../api/services';
import { toast } from 'react-hot-toast';
import { User, Mail, Phone, Edit3, Save, X, Package, Settings, LogOut, Key, Camera, Clock, CheckCircle, Truck, XCircle, Calendar, ArrowRight, ShoppingBag } from 'lucide-react';
import api from '../api/axios';

const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        avatarUrl: ''
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token && !!user.email;

    // Get user info
    const { data: userInfo, isLoading, refetch } = useQuery({
        queryKey: ['userInfo'],
        queryFn: () => authApi.getInfo().then(res => res.data),
        enabled: isLoggedIn,
    });

    // Get orders
    const { data: orders, isLoading: ordersLoading } = useQuery({
        queryKey: ['orders', user.email],
        queryFn: () => api.get(`/Checkout/list/${user.email}`).then(res => res.data),
        enabled: isLoggedIn && activeTab === 'orders',
    });

    useEffect(() => {
        if (userInfo) {
            setFormData({
                firstName: userInfo.firstName || '',
                lastName: userInfo.lastName || '',
                phoneNumber: userInfo.phoneNumber || '',
                avatarUrl: userInfo.avatarUrl || ''
            });
        }
    }, [userInfo]);

    const updateMutation = useMutation({
        mutationFn: (data) => api.post('/Authenticate/edit-info', data),
        onSuccess: () => {
            toast.success('Cập nhật thông tin thành công!', {
                style: { borderRadius: '12px', background: '#000', color: '#fff', border: '3px solid #4ADE80' }
            });
            setIsEditing(false);
            refetch();
            const updatedUser = { ...user, ...formData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Cập nhật thất bại!', {
                style: { borderRadius: '12px', background: '#000', color: '#fff', border: '3px solid #FF5757' }
            });
        }
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            Id: userInfo?.id || '',
            FirstName: formData.firstName,
            LastName: formData.lastName,
            PhoneNumber: formData.phoneNumber,
            AvatarUrl: formData.avatarUrl || ''
        };
        updateMutation.mutate(payload);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'đã giao':
            case 'hoàn thành':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'đang giao':
                return <Truck className="w-4 h-4 text-accent" />;
            case 'đã hủy':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <Clock className="w-4 h-4 text-yellow-500" />;
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

    if (!isLoggedIn) {
        return (
            <div className="pt-40 pb-20 px-6 max-w-4xl mx-auto text-center">
                <User className="w-24 h-24 mx-auto mb-8 text-slate-300" />
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
                <div className="brutal-card h-64 animate-pulse bg-slate-100"></div>
            </div>
        );
    }

    return (
        <div className="pt-40 pb-20 px-6 max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-12">
                Tài khoản <span className="text-primary">của tôi</span>
            </h1>

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="brutal-card !p-6 hover:translate-x-0 hover:translate-y-0">
                        {/* Avatar */}
                        <div className="text-center mb-6">
                            <div className="relative inline-block">
                                <div className="w-24 h-24 bg-accent brutal-border rounded-full flex items-center justify-center text-white text-3xl font-black mx-auto">
                                    {userInfo?.avatarUrl ? (
                                        <img src={userInfo.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        userInfo?.username?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'U'
                                    )}
                                </div>
                            </div>
                            <h3 className="font-black text-lg mt-4">{userInfo?.firstName || user.firstName} {userInfo?.lastName || user.lastName}</h3>
                            <p className="text-slate-500 text-sm">@{userInfo?.username || user.username}</p>
                        </div>

                        {/* Menu */}
                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full flex items-center gap-3 p-3 brutal-border rounded-xl font-bold text-left ${activeTab === 'profile' ? 'bg-primary' : 'hover:bg-slate-50'}`}
                            >
                                <User className="w-5 h-5" /> Thông tin
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`w-full flex items-center gap-3 p-3 brutal-border rounded-xl font-bold text-left ${activeTab === 'orders' ? 'bg-primary' : 'hover:bg-slate-50'}`}
                            >
                                <Package className="w-5 h-5" /> Đơn hàng
                            </button>
                            <Link to="/change-password" className="flex items-center gap-3 p-3 brutal-border rounded-xl hover:bg-slate-50 font-bold">
                                <Key className="w-5 h-5" /> Đổi mật khẩu
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 p-3 brutal-border rounded-xl text-secondary hover:bg-red-50 font-bold"
                            >
                                <LogOut className="w-5 h-5" /> Đăng xuất
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <form onSubmit={handleSubmit}>
                            <div className="brutal-card !p-8 hover:translate-x-0 hover:translate-y-0">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-black uppercase flex items-center gap-3">
                                        <Settings className="w-6 h-6 text-accent" /> Thông tin cá nhân
                                    </h2>
                                    {!isEditing ? (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="brutal-btn-secondary py-2 px-6 text-sm"
                                        >
                                            <Edit3 className="w-4 h-4" /> Chỉnh sửa
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="brutal-btn-secondary py-2 px-4 text-sm"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={updateMutation.isPending}
                                                className="brutal-btn-primary py-2 px-6 text-sm"
                                            >
                                                <Save className="w-4 h-4" /> Lưu
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block font-black uppercase text-xs mb-2 text-slate-400">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="email"
                                                disabled
                                                className="brutal-input pl-12 bg-slate-50 cursor-not-allowed"
                                                value={userInfo?.email || user.email || ''}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-black uppercase text-xs mb-2 text-slate-400">Username</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="text"
                                                disabled
                                                className="brutal-input pl-12 bg-slate-50 cursor-not-allowed"
                                                value={userInfo?.username || user.username || ''}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block font-black uppercase text-xs mb-2 text-slate-400">Họ</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                disabled={!isEditing}
                                                className={`brutal-input ${!isEditing ? 'bg-slate-50' : ''}`}
                                                value={formData.firstName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-black uppercase text-xs mb-2 text-slate-400">Tên</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                disabled={!isEditing}
                                                className={`brutal-input ${!isEditing ? 'bg-slate-50' : ''}`}
                                                value={formData.lastName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-black uppercase text-xs mb-2 text-slate-400">Số điện thoại</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="tel"
                                                name="phoneNumber"
                                                disabled={!isEditing}
                                                className={`brutal-input pl-12 ${!isEditing ? 'bg-slate-50' : ''}`}
                                                value={formData.phoneNumber}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div className="brutal-card !p-8 hover:translate-x-0 hover:translate-y-0">
                            <h2 className="text-xl font-black uppercase flex items-center gap-3 mb-8">
                                <Package className="w-6 h-6 text-accent" /> Đơn hàng của tôi
                            </h2>

                            {ordersLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="brutal-card h-24 animate-pulse bg-slate-100"></div>
                                    ))}
                                </div>
                            ) : !orders || orders.length === 0 ? (
                                <div className="text-center py-12">
                                    <ShoppingBag className="w-20 h-20 mx-auto mb-6 text-slate-300" />
                                    <h3 className="text-2xl font-black uppercase mb-3">Chưa có đơn hàng</h3>
                                    <p className="text-slate-500 mb-6">Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!</p>
                                    <Link to="/shop" className="brutal-btn-primary py-3 px-8">
                                        <ShoppingBag className="w-5 h-5" /> Mua sắm ngay
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div key={order.id} className="brutal-card !p-5 bg-slate-50 hover:translate-x-0 hover:translate-y-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white brutal-border rounded-xl flex items-center justify-center">
                                                        <Package className="w-6 h-6 text-accent" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black">Đơn hàng #{order.id}</p>
                                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(order.createAt).toLocaleDateString('vi-VN')}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <span className={`brutal-badge ${getStatusColor(order.status)} flex items-center gap-1`}>
                                                        {getStatusIcon(order.status)} {order.status}
                                                    </span>
                                                    <span className="font-black text-lg text-primary">
                                                        {order.total?.toLocaleString()}đ
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-4 border-t-2 border-slate-200 flex justify-between items-center">
                                                <span className="text-sm text-slate-500">
                                                    <span className="font-bold">Thanh toán:</span> {order.payment}
                                                </span>
                                                <Link
                                                    to={`/orders/${order.id}`}
                                                    className="brutal-btn-secondary py-2 px-4 text-sm"
                                                >
                                                    Chi tiết <ArrowRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
