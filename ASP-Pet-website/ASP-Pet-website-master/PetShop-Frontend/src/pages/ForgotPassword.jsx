import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, ArrowLeft, ArrowRight, CheckCircle, Star, Zap } from 'lucide-react';
import api from '../api/axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error('Vui lòng nhập email!', {
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
            await api.post('/Authenticate/forgot-password', { email: email.trim() });
            setIsSuccess(true);
            toast.success('Đã gửi link reset mật khẩu đến email của bạn!', {
                style: {
                    borderRadius: '12px',
                    background: '#000',
                    color: '#fff',
                    border: '3px solid #4ADE80',
                },
                duration: 5000
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Không thể gửi email. Vui lòng thử lại!', {
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
                            Email <span className="text-green-500">đã gửi!</span>
                        </h1>
                        <p className="font-bold text-slate-500 mb-8">
                            Vui lòng kiểm tra hộp thư của bạn và làm theo hướng dẫn để đặt lại mật khẩu.
                        </p>
                        <Link to="/login" className="brutal-btn-primary py-4 px-10 inline-flex">
                            Quay lại đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-40 pb-20 px-6 flex items-center justify-center relative overflow-hidden bg-background">
            {/* Background Decorations */}
            <div className="absolute top-20 left-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>

            <div className="max-w-xl w-full">
                <div className="bg-white brutal-border p-12 md:p-16 rounded-[3rem] shadow-brutal relative z-10">
                    <div className="absolute -top-12 -left-12 w-24 h-24 bg-secondary brutal-border rounded-3xl shadow-brutal flex items-center justify-center rotate-[-15deg]">
                        <Mail className="w-12 h-12 text-white" />
                    </div>

                    <div className="absolute -top-6 -right-6 w-16 h-16 bg-primary brutal-border rounded-full shadow-brutal-sm flex items-center justify-center rotate-[10deg]">
                        <Star className="w-8 h-8 fill-current" />
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white brutal-border rounded-lg mb-8 uppercase font-black text-[10px]">
                        <Zap className="w-3 h-3 text-secondary" fill="currentColor" />
                        <span>Khôi phục tài khoản</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4 leading-none">
                        Quên <span className="text-secondary">mật khẩu?</span>
                    </h1>
                    <p className="font-bold text-slate-500 mb-10 italic text-lg uppercase tracking-tight">
                        Nhập email để nhận link đặt lại mật khẩu.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block font-black uppercase text-xs mb-3 tracking-widest text-slate-400">Email của bạn</label>
                            <div className="relative">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    className="brutal-input pl-16 py-5 text-lg"
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full brutal-btn-secondary py-6 text-xl flex items-center justify-center gap-4 group disabled:opacity-50 bg-secondary text-white hover:bg-red-600"
                        >
                            {isSubmitting ? 'ĐANG GỬI...' : 'GỬI LINK RESET'}
                            {!isSubmitting && <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t-[4px] border-black text-center">
                        <Link to="/login" className="font-black uppercase text-sm hover:text-accent flex items-center justify-center gap-2 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
