import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/services';
import { toast } from 'react-hot-toast';
import { UserPlus, ArrowRight, Mail, Lock, User, Phone, Star, Zap } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phoneNumber: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp!', {
                style: {
                    borderRadius: '12px',
                    background: '#000',
                    color: '#fff',
                    border: '3px solid #FF5757',
                    fontFamily: 'Lexend Mega, sans-serif',
                }
            });
            return;
        }

        setIsLoading(true);

        try {
            await authApi.register({
                username: formData.username.trim(),
                email: formData.email.trim(),
                password: formData.password,
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                phoneNumber: formData.phoneNumber.trim()
            });

            toast.success('Đăng ký thành công! Bạn có thể đăng nhập ngay.', {
                style: {
                    borderRadius: '12px',
                    background: '#000',
                    color: '#fff',
                    border: '3px solid #4ADE80',
                    fontFamily: 'Lexend Mega, sans-serif',
                },
                duration: 3000
            });
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Đăng ký thất bại!', {
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
            <div className="absolute top-20 left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>

            <div className="max-w-2xl w-full">
                <div className="bg-white brutal-border p-12 rounded-[3rem] shadow-brutal relative z-10">
                    <div className="absolute -top-12 -left-12 w-24 h-24 bg-secondary brutal-border rounded-3xl shadow-brutal flex items-center justify-center rotate-[-15deg]">
                        <UserPlus className="w-12 h-12 text-white" />
                    </div>

                    <div className="absolute -top-6 -right-6 w-16 h-16 bg-primary brutal-border rounded-full shadow-brutal-sm flex items-center justify-center rotate-[10deg]">
                        <Star className="w-8 h-8 fill-current" />
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white brutal-border rounded-lg mb-8 uppercase font-black text-[10px]">
                        <Zap className="w-3 h-3 text-secondary" fill="currentColor" />
                        <span>Gia Nhập Gia Đình</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4 leading-none">
                        TẠO <span className="text-secondary">TÀI KHOẢN</span> <br /> MỚI
                    </h1>
                    <p className="font-bold text-slate-500 mb-10 italic text-lg uppercase tracking-tight">
                        Đăng ký để trở thành thành viên gia đình Paws & Co.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block font-black uppercase text-xs mb-2 tracking-widest text-slate-400">Họ</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    required
                                    className="brutal-input py-4"
                                    placeholder="Nguyễn"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block font-black uppercase text-xs mb-2 tracking-widest text-slate-400">Tên</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    required
                                    className="brutal-input py-4"
                                    placeholder="Văn A"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-black uppercase text-xs mb-2 tracking-widest text-slate-400">Username</label>
                            <div className="relative">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    className="brutal-input pl-14 py-4"
                                    placeholder="username123"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-black uppercase text-xs mb-2 tracking-widest text-slate-400">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="brutal-input pl-14 py-4"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-black uppercase text-xs mb-2 tracking-widest text-slate-400">Số điện thoại</label>
                            <div className="relative">
                                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    required
                                    className="brutal-input pl-14 py-4"
                                    placeholder="0901234567"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block font-black uppercase text-xs mb-2 tracking-widest text-slate-400">Mật khẩu</label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        className="brutal-input pl-14 py-4"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block font-black uppercase text-xs mb-2 tracking-widest text-slate-400">Xác nhận mật khẩu</label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        required
                                        className="brutal-input pl-14 py-4"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={isLoading}
                            className="w-full brutal-btn-secondary py-5 text-xl flex items-center justify-center gap-4 group disabled:opacity-50 bg-secondary text-white hover:bg-red-600"
                        >
                            {isLoading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ NGAY'}
                            {!isLoading && <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t-[4px] border-black text-center">
                        <p className="font-bold text-slate-500 mb-4 italic uppercase tracking-tighter">Đã có tài khoản?</p>
                        <Link to="/login" className="font-black uppercase text-base hover:text-primary flex items-center justify-center gap-2 transition-colors">
                            ĐĂNG NHẬP NGAY <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
