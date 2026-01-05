import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { PawPrint, ShoppingCart, User, Menu, X, LogOut, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { getItemCount } = useCart();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        const checkUser = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    localStorage.removeItem('user');
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        checkUser();
        window.addEventListener('user-login', checkUser);
        window.addEventListener('storage', checkUser);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('user-login', checkUser);
            window.removeEventListener('storage', checkUser);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    const navLinks = [
        { name: 'Trang Chủ', path: '/' },
        { name: 'Thú Cưng', path: '/pets' },
        { name: 'Cửa Hàng', path: '/shop' },
        { name: 'Dịch Vụ', path: '/services' },
    ];

    const cartCount = getItemCount();

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-6'}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className={`bg-white brutal-border rounded-2xl shadow-brutal flex justify-between items-center px-8 py-3 transition-all ${isScrolled ? 'shadow-brutal-sm scale-95 md:scale-100' : ''}`}>
                    <NavLink to="/" className="flex items-center gap-2 font-black text-2xl uppercase tracking-tighter">
                        <div className="w-10 h-10 bg-primary brutal-border rounded-xl flex items-center justify-center rotate-[-6deg]">
                            <PawPrint className="w-6 h-6" fill="black" />
                        </div>
                        <span className="hidden sm:inline">Paws <span className="text-secondary">&</span> Co.</span>
                    </NavLink>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8 font-black uppercase text-xs">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) =>
                                    `transition-colors hover:text-secondary ${isActive ? 'text-secondary bg-primary/20 px-2 py-1 rounded-lg' : 'text-black'}`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <NavLink to="/cart" className="relative p-3 bg-black text-white rounded-xl hover:bg-primary hover:text-black border-2 border-black transition-all group shadow-brutal-sm active:translate-x-1 active:translate-y-1 active:shadow-none">
                            <ShoppingCart className="w-5 h-5" />
                            <span className={`absolute -top-2 -right-2 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-black group-hover:bg-white group-hover:text-black ${cartCount > 0 ? 'bg-primary text-black' : 'bg-secondary'}`}>
                                {cartCount > 99 ? '99+' : cartCount}
                            </span>
                        </NavLink>

                        {user ? (
                            <div className="flex items-center gap-3">
                                {user.role?.includes('Admin') && (
                                    <Link to="/admin" className="brutal-btn-secondary py-2 px-4 text-xs font-black">
                                        ADMIN
                                    </Link>
                                )}
                                <Link to="/profile" className="w-10 h-10 bg-accent brutal-border rounded-full flex items-center justify-center font-black text-white shadow-brutal-sm hover:scale-110 transition-all">
                                    {user.username?.[0]?.toUpperCase()}
                                </Link>
                                <button onClick={handleLogout} className="p-3 bg-red-100 brutal-border rounded-xl hover:bg-black hover:text-white transition-all shadow-brutal-sm active:translate-x-1 active:translate-y-1 active:shadow-none">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <NavLink to="/login" className="brutal-btn-primary py-2 px-6 text-xs">
                                Đăng Nhập
                            </NavLink>
                        )}
                    </div>

                    {/* Mobile Button */}
                    <button className="md:hidden p-2 brutal-border rounded-xl bg-primary shadow-brutal-sm active:shadow-none active:translate-x-1 active:translate-y-1" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-6 right-6 mt-4">
                    <div className="bg-white brutal-border rounded-2xl p-6 flex flex-col gap-4 shadow-brutal">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className="font-black uppercase text-lg border-b-4 border-slate-100 pb-2 active:text-secondary"
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        <div className="flex flex-col gap-3 pt-4">
                            <NavLink to="/cart" onClick={() => setIsOpen(false)} className="flex items-center gap-3 font-black uppercase brutal-btn bg-black text-white py-3">
                                <ShoppingCart className="w-5 h-5" />
                                Giỏ hàng ({cartCount})
                            </NavLink>
                            {user ? (
                                <>
                                    {user.role?.includes('Admin') && (
                                        <Link to="/admin" onClick={() => setIsOpen(false)} className="brutal-btn bg-secondary py-3 px-4 font-black uppercase text-white flex items-center justify-center gap-2">
                                            <Package className="w-5 h-5" /> Trang quản trị
                                        </Link>
                                    )}
                                    <div className="flex items-center gap-2 w-full">
                                        <Link to="/profile" onClick={() => setIsOpen(false)} className="brutal-btn bg-primary py-3 px-4 flex-1 font-black uppercase flex items-center justify-center gap-2">
                                            <User className="w-4 h-4" /> Tài khoản
                                        </Link>
                                        <button onClick={() => { handleLogout(); setIsOpen(false); }} className="brutal-btn bg-red-100 py-3 px-4 text-secondary hover:bg-secondary hover:text-white flex items-center justify-center border-2 border-black">
                                            <LogOut className="w-4 h-4" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <NavLink to="/login" onClick={() => setIsOpen(false)} className="brutal-btn-primary py-3 px-8 w-full text-center">
                                    Đăng nhập
                                </NavLink>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
