import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { PawPrint, LayoutDashboard, Package, ShoppingBag, Users, FileText, Tag, Settings, LogOut, Menu, X, ChevronRight } from 'lucide-react';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role?.includes('Admin');

    useEffect(() => {
        if (!isAdmin) {
            navigate('/login');
        }
    }, [isAdmin, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
        { name: 'Thú cưng', path: '/admin/pets', icon: PawPrint },
        { name: 'Sản phẩm', path: '/admin/products', icon: ShoppingBag },
        { name: 'Đơn hàng', path: '/admin/orders', icon: Package },
        { name: 'Lịch hẹn', path: '/admin/appointments', icon: FileText },
        { name: 'Nhập hàng', path: '/admin/goods', icon: Tag },
        { name: 'Voucher', path: '/admin/vouchers', icon: Tag },
        { name: 'Người dùng', path: '/admin/users', icon: Users },
    ];

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <LayoutDashboard className="w-24 h-24 mx-auto mb-8 text-slate-300" />
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">
                        Không có <span className="text-secondary">quyền truy cập</span>
                    </h1>
                    <Link to="/login" className="brutal-btn-primary py-4 px-10">
                        Đăng nhập với tài khoản Admin
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 flex">
            {/* Sidebar - Desktop */}
            <aside className={`hidden lg:flex flex-col bg-black text-white transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
                {/* Logo */}
                <div className="p-6 border-b border-slate-800">
                    <Link to="/admin" className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary brutal-border rounded-xl flex items-center justify-center flex-shrink-0">
                            <PawPrint className="w-7 h-7" fill="black" />
                        </div>
                        {isSidebarOpen && (
                            <span className="font-black text-xl uppercase tracking-tighter">
                                Admin
                            </span>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.exact}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${isActive
                                    ? 'bg-primary text-black'
                                    : 'hover:bg-slate-800 text-slate-300'
                                }`
                            }
                        >
                            <item.icon className="w-6 h-6 flex-shrink-0" />
                            {isSidebarOpen && <span>{item.name}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* User & Toggle */}
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 mb-4"
                    >
                        <ChevronRight className={`w-5 h-5 transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} />
                        {isSidebarOpen && <span className="text-sm font-bold">Thu gọn</span>}
                    </button>

                    {isSidebarOpen && (
                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-900 rounded-xl mb-4">
                            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center font-black text-white">
                                {user.username?.[0]?.toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm truncate">{user.username}</p>
                                <p className="text-xs text-slate-400">Admin</p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-secondary hover:bg-red-500/10 font-bold transition-all ${isSidebarOpen ? 'w-full' : 'justify-center'}`}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {isSidebarOpen && <span>Đăng xuất</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            {isMobileSidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileSidebarOpen(false)}></div>
                    <aside className="relative w-72 bg-black text-white flex flex-col">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                            <Link to="/admin" className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary brutal-border rounded-xl flex items-center justify-center">
                                    <PawPrint className="w-6 h-6" fill="black" />
                                </div>
                                <span className="font-black text-xl uppercase tracking-tighter">Admin</span>
                            </Link>
                            <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <nav className="flex-1 p-4 space-y-2">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.exact}
                                    onClick={() => setIsMobileSidebarOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${isActive
                                            ? 'bg-primary text-black'
                                            : 'hover:bg-slate-800 text-slate-300'
                                        }`
                                    }
                                >
                                    <item.icon className="w-6 h-6" />
                                    <span>{item.name}</span>
                                </NavLink>
                            ))}
                        </nav>
                        <div className="p-4 border-t border-slate-800">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-secondary hover:bg-red-500/10 font-bold"
                            >
                                <LogOut className="w-5 h-5" />
                                Đăng xuất
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Top Bar */}
                <header className="bg-white border-b-4 border-black px-6 py-4 flex items-center justify-between sticky top-0 z-40">
                    <button
                        onClick={() => setIsMobileSidebarOpen(true)}
                        className="lg:hidden p-2 brutal-border rounded-xl bg-primary"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-4">
                        <Link to="/" className="brutal-btn-secondary py-2 px-4 text-sm">
                            Xem trang chủ
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
