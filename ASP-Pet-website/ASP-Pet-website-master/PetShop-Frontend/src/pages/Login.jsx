import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/services';
import { toast } from 'react-hot-toast';
import { LogIn, UserPlus, ArrowRight, Lock, User, Star, Zap } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const cleanEmail = formData.email.trim();
        const cleanPassword = formData.password.trim();

        // Clear tokens before login attempt to ensure no invalid headers are sent
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        try {
            console.log('Đang thử đăng nhập với:', cleanEmail);
            const { data } = await authApi.login({ email: cleanEmail, password: cleanPassword });
            console.log('Đăng nhập thành công, nhận được data:', data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                username: data.username,
                email: data.email,
                role: data.role,
                firstName: data.firstName,
                lastName: data.lastName
            }));
            window.dispatchEvent(new Event('user-login'));
            toast.success('Đăng nhập thành công!', {
                style: {
                    borderRadius: '12px',
                    background: '#000',
                    color: '#fff',
                    border: '3px solid #4ADE80',
                    fontFamily: 'Lexend Mega, sans-serif',
                }
            });
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Đăng nhập thất bại!', {
                style: {
                    borderRadius: '12px',
                    background: '#000',
                    color: '#fff',
                    border: '3px solid #FF5757',
                    fontFamily: 'Lexend Mega, sans-serif',
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-40 pb-20 px-6 flex items-center justify-center relative overflow-hidden bg-background">
            {/* Background Decorations */}
            <div className="absolute top-20 left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>

            <div className="max-w-xl w-full">
                <div className="bg-white brutal-border p-12 md:p-16 rounded-[3rem] shadow-brutal relative z-10">
                    <div className="absolute -top-12 -left-12 w-24 h-24 bg-primary brutal-border rounded-3xl shadow-brutal flex items-center justify-center rotate-[-15deg]">
                        <LogIn className="w-12 h-12" />
                    </div>

                    <div className="absolute -top-6 -right-6 w-16 h-16 bg-accent brutal-border rounded-full shadow-brutal-sm flex items-center justify-center rotate-[10deg]">
                        <Star className="w-8 h-8 text-white fill-current" />
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white brutal-border rounded-lg mb-8 uppercase font-black text-[10px]">
                        <Zap className="w-3 h-3 text-primary" fill="currentColor" />
                        <span>Security Checkpoint</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4 leading-none">CHÀO <span className="text-primary">MỪNG</span> <br /> TRỞ LẠI</h1>
                    <p className="font-bold text-slate-500 mb-12 italic text-lg uppercase tracking-tight">Vui lòng đăng nhập để bắt đầu hành trình cùng bé cưng.</p>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block font-black uppercase text-xs mb-3 tracking-widest text-slate-400">Username / Email</label>
                            <div className="relative">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    className="brutal-input pl-16 pr-6 py-5"
                                    placeholder="admin@pawsnco.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-black uppercase text-xs mb-3 tracking-widest text-slate-400">Mật khẩu bảo mật</label>
                            <div className="relative">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    className="brutal-input pl-16 pr-6 py-5"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            disabled={isLoading}
                            className="w-full brutal-btn-primary py-6 text-2xl flex items-center justify-center gap-4 group disabled:opacity-50"
                        >
                            {isLoading ? 'ĐANG XÁC MINH...' : 'ĐĂNG NHẬP NGAY'}
                            {!isLoading && <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-12 pt-10 border-t-[4px] border-black text-center relative">
                        <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 bg-white px-4 font-black uppercase text-xs">Xử lý xong?</div>
                        <p className="font-bold text-slate-500 mb-6 italic uppercase tracking-tighter">Chưa là thành viên gia đình Paws & Co.?</p>
                        <Link to="/register" className="font-black uppercase text-base hover:text-secondary flex items-center justify-center gap-3 transition-colors group">
                            <span className="group-hover:underline decoration-secondary decoration-4 underline-offset-4"><UserPlus className="w-5 h-5 inline mr-2" /> TẠO TÀI KHOẢN MỚI</span>
                        </Link>
                    </div>
                </div>

                {/* Visual anchor */}
                <div className="mt-10 flex justify-center gap-8 opacity-20 filter grayscale contrast-200">
                    <Star className="w-10 h-10" />
                    <Star className="w-10 h-10" />
                    <Star className="w-10 h-10" />
                </div>
            </div>
        </div>
    );
};

export default Login;
