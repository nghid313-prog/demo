import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Key, ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import api from '../api/axios';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleShowPassword = (field) => {
        setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
            toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!', {
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
            await api.post('/Authenticate/change-password', {
                CurrentPassword: formData.currentPassword,
                NewPassword: formData.newPassword,
                ConfirmNewPassword: formData.confirmPassword
            });

            toast.success('Đổi mật khẩu thành công!', {
                style: {
                    borderRadius: '12px',
                    background: '#000',
                    color: '#fff',
                    border: '3px solid #4ADE80',
                },
                duration: 3000
            });

            navigate('/profile');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại!', {
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

    const token = localStorage.getItem('token');
    const isLoggedIn = !!token && !!user.email;

    if (!isLoggedIn) {
        return (
            <div className="pt-40 pb-20 px-6 max-w-4xl mx-auto text-center">
                <Key className="w-24 h-24 mx-auto mb-8 text-slate-300" />
                <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">
                    Vui lòng <span className="text-accent">đăng nhập</span>
                </h1>
                <Link to="/login" className="brutal-btn-primary py-4 px-10 text-lg inline-flex">
                    Đăng nhập ngay
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-40 pb-20 px-6 max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-12">
                <Link to="/profile" className="brutal-btn-secondary py-3 px-6">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                        Đổi <span className="text-primary">mật khẩu</span>
                    </h1>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="brutal-card !p-8 hover:translate-x-0 hover:translate-y-0">
                    <div className="space-y-6">
                        {/* Current Password */}
                        <div>
                            <label className="block font-black uppercase text-xs mb-2 text-slate-400">Mật khẩu hiện tại</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showPasswords.current ? 'text' : 'password'}
                                    name="currentPassword"
                                    required
                                    className="brutal-input pl-12 pr-12"
                                    placeholder="••••••••"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShowPassword('current')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black"
                                >
                                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block font-black uppercase text-xs mb-2 text-slate-400">Mật khẩu mới</label>
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
                            <label className="block font-black uppercase text-xs mb-2 text-slate-400">Xác nhận mật khẩu mới</label>
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

                        {/* Password Requirements */}
                        <div className="brutal-card bg-slate-50 !p-4 text-sm">
                            <p className="font-black uppercase text-xs text-slate-400 mb-2">Yêu cầu mật khẩu:</p>
                            <ul className="space-y-1 text-slate-600">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className={`w-4 h-4 ${formData.newPassword.length >= 6 ? 'text-green-500' : 'text-slate-300'}`} />
                                    Ít nhất 6 ký tự
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className={`w-4 h-4 ${formData.newPassword === formData.confirmPassword && formData.confirmPassword ? 'text-green-500' : 'text-slate-300'}`} />
                                    Mật khẩu xác nhận khớp
                                </li>
                            </ul>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full brutal-btn-primary py-5 text-lg disabled:opacity-50"
                        >
                            {isSubmitting ? 'ĐANG XỬ LÝ...' : 'ĐỔI MẬT KHẨU'}
                        </button>
                    </div>
                </div>
            </form>

            <div className="mt-6 text-center">
                <Link to="/forgot-password" className="font-bold text-sm text-slate-500 hover:text-accent underline underline-offset-4">
                    Quên mật khẩu hiện tại?
                </Link>
            </div>
        </div>
    );
};

export default ChangePassword;
