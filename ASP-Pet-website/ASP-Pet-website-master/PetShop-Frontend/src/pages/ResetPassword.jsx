import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Key, Lock, ArrowRight, CheckCircle, Star, Zap, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';

    const [showPasswords, setShowPasswords] = useState({
        new: false,
        confirm: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        token: token,
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleShowPassword = (field) => {
        setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.token.trim()) {
            toast.error('Vui lòng nhập mã token!', {
                style: {
                    borderRadius: '12px',
                    background: '#000',
                    color: '#fff',
                    border: '3px solid #FF5757',
                }
            });
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp!', {
                style: {
                    borderRadius: '12px',
                    background: '#000',
                    color: '#fff',
                    border: '3px solid #FF5757',
                }
            });
            return;
        }

        if (formData.newPassword.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự!', {
                style: {
                    borderRadius: '12px',
                    background: '#000',
                    color: '#fff',
                    border: '3px solid #FF5757',
                }
            });
            return;
        }

        setIsSubmitting(true);

        try {
            await api.post('/Authenticate/reset-password', {
                token: formData.token,
                newPassword: formData.newPassword
            });
            setIsSuccess(true);
            toast.success('Đặt lại mật khẩu thành công!', {
                style: {
                    borderRadius: '12px',
                    background: '#000',
                    color: '#fff',
                    border: '3px solid #4ADE80',
                },
                duration: 3000
            });

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Token không hợp lệ hoặc đã hết hạn!', {
                style: {
                    borderRadius: '12px',
                    background: '#000',
                    color: '#fff',
                    border: '3px solid #FF5757',
                }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen pt-40 pb-20 px-6 flex items-center justify-center bg-background">
                <div className="max-w-lg w-full text-center">
                    <div className="bg-white brutal-border p-16 rounded-[3rem] shadow-brutal">
                        <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-8" />
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">
                            Đặt lại <span className="text-green-500">thành công!</span>
                        </h1>
                        <p className="font-bold text-slate-500 mb-8">
                            Đang chuyển hướng đến trang đăng nhập...
                        </p>
                        <Link to="/login" className="brutal-btn-primary py-4 px-10 inline-flex">
                            Đăng nhập ngay
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-40 pb-20 px-6 flex items-center justify-center relative overflow-hidden bg-background">
            {/* Background Decorations */}
            <div className="absolute top-20 left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>

            <div className="max-w-xl w-full">
                <div className="bg-white brutal-border p-12 md:p-16 rounded-[3rem] shadow-brutal relative z-10">
                    <div className="absolute -top-12 -left-12 w-24 h-24 bg-accent brutal-border rounded-3xl shadow-brutal flex items-center justify-center rotate-[-15deg]">
                        <Key className="w-12 h-12 text-white" />
                    </div>

                    <div className="absolute -top-6 -right-6 w-16 h-16 bg-primary brutal-border rounded-full shadow-brutal-sm flex items-center justify-center rotate-[10deg]">
                        <Star className="w-8 h-8 fill-current" />
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white brutal-border rounded-lg mb-8 uppercase font-black text-[10px]">
                        <Zap className="w-3 h-3 text-accent" fill="currentColor" />
                        <span>Đặt lại mật khẩu</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4 leading-none">
                        Mật khẩu <span className="text-accent">mới</span>
                    </h1>
                    <p className="font-bold text-slate-500 mb-10 italic text-lg uppercase tracking-tight">
                        Nhập token và mật khẩu mới của bạn.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Token */}
                        <div>
                            <label className="block font-black uppercase text-xs mb-2 tracking-widest text-slate-400">Mã Token</label>
                            <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="token"
                                    required
                                    className="brutal-input pl-12 uppercase tracking-wider"
                                    placeholder="XXXXXXXXXX"
                                    value={formData.token}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block font-black uppercase text-xs mb-2 tracking-widest text-slate-400">Mật khẩu mới</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showPasswords.new ? 'text' : 'password'}
                                    name="newPassword"
                                    required
                                    className="brutal-input pl-12 pr-12"
                                    placeholder="••••••••"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShowPassword('new')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black"
                                >
                                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block font-black uppercase text-xs mb-2 tracking-widest text-slate-400">Xác nhận mật khẩu</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    name="confirmPassword"
                                    required
                                    className="brutal-input pl-12 pr-12"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShowPassword('confirm')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black"
                                >
                                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full brutal-btn-accent py-6 text-xl flex items-center justify-center gap-4 group disabled:opacity-50"
                        >
                            {isSubmitting ? 'ĐANG XỬ LÝ...' : 'ĐẶT LẠI MẬT KHẨU'}
                            {!isSubmitting && <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
