import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Scissors, Sparkles, Bath, Heart, Calendar, Clock, User, Phone, CheckCircle, PawPrint } from 'lucide-react';
import api from '../api/axios';

const services = [
    {
        id: 1,
        name: 'Grooming Cơ Bản',
        description: 'Tắm, sấy, cắt móng, vệ sinh tai',
        price: 200000,
        duration: '1 giờ',
        icon: Bath,
        color: 'bg-accent',
    },
    {
        id: 2,
        name: 'Grooming Premium',
        description: 'Tắm spa, cắt tỉa lông, massage, làm móng',
        price: 400000,
        duration: '2 giờ',
        icon: Sparkles,
        color: 'bg-primary',
    },
    {
        id: 3,
        name: 'Cắt Tỉa Tạo Kiểu',
        description: 'Cắt tỉa lông theo yêu cầu, tạo kiểu đẹp',
        price: 350000,
        duration: '1.5 giờ',
        icon: Scissors,
        color: 'bg-secondary',
    },
    {
        id: 4,
        name: 'Chăm Sóc Sức Khỏe',
        description: 'Kiểm tra sức khỏe, vệ sinh răng miệng, xử lý ve bọ',
        price: 300000,
        duration: '1 giờ',
        icon: Heart,
        color: 'bg-green-500',
    },
];

const Services = () => {
    const queryClient = useQueryClient();
    const [selectedService, setSelectedService] = useState(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [formData, setFormData] = useState({
        petName: '',
        petType: 'dog',
        ownerName: '',
        phone: '',
        date: '',
        time: '09:00',
        note: '',
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isLoggedIn = !!localStorage.getItem('token');

    const { data: myAppointments } = useQuery({
        queryKey: ['myAppointments', user.email],
        queryFn: () => api.get(`/Appointment/all/${user.email}`).then(res => res.data),
        enabled: isLoggedIn && !!user.email,
    });

    const bookMutation = useMutation({
        mutationFn: (data) => api.post('/Appointment/create', data),
        onSuccess: () => {
            toast.success('Đặt lịch thành công! Chúng tôi sẽ liên hệ xác nhận.', {
                style: { borderRadius: '12px', background: '#000', color: '#fff', border: '3px solid #4ADE80' }
            });
            queryClient.invalidateQueries(['myAppointments']);
            setIsBookingOpen(false);
            setSelectedService(null);
            setFormData({ petName: '', petType: 'dog', ownerName: '', phone: '', date: '', time: '09:00', note: '' });
        },
        onError: (error) => {
            const errorMsg = error.response?.data?.message || 'Đặt lịch thất bại! Vui lòng thử lại.';
            toast.error(errorMsg, {
                style: { borderRadius: '12px', background: '#000', color: '#fff', border: '3px solid #FF5757' }
            });
        }
    });

    const handleBook = (service) => {
        if (!isLoggedIn) {
            toast.error('Vui lòng đăng nhập để đặt lịch!', {
                style: { borderRadius: '12px', background: '#000', color: '#fff', border: '3px solid #FF5757' }
            });
            return;
        }
        setSelectedService(service);
        setIsBookingOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const appointmentData = {
            Dog_item_id: 0, // Not tracking specific dog item
            User_id: user.email || '', // Use email since Login doesn't save id
            Date: formData.date,
            Hour: formData.time,
            Description: `${formData.petName} (${formData.petType}) - ${formData.note || 'Không có ghi chú'}`,
            Phone_number: formData.phone,
            User_name: formData.ownerName,
            Service: selectedService.name,
            Result: '',
            Status: 'Chờ xác nhận'
        };
        bookMutation.mutate(appointmentData);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'đã xác nhận': return 'bg-green-100 text-green-700';
            case 'đã hoàn thành': return 'bg-accent/10 text-accent';
            case 'đã hủy': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    return (
        <div className="pt-40 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Hero */}
                <div className="text-center mb-16">
                    <div className="brutal-badge bg-primary inline-flex items-center gap-2 mb-6">
                        <Sparkles className="w-4 h-4" /> Dịch vụ cao cấp
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-6">
                        SPA & <span className="text-accent">Grooming</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                        Chăm sóc thú cưng của bạn với dịch vụ chuyên nghiệp, tận tâm từ đội ngũ giàu kinh nghiệm
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {services.map((service) => (
                        <div key={service.id} className="brutal-card !p-6 flex flex-col">
                            <div className={`w-16 h-16 ${service.color} brutal-border rounded-2xl flex items-center justify-center mb-6 text-white`}>
                                <service.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black uppercase mb-2">{service.name}</h3>
                            <p className="text-slate-500 text-sm mb-4 flex-1">{service.description}</p>
                            <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                                <Clock className="w-4 h-4" /> {service.duration}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-black text-primary">{service.price.toLocaleString()}đ</span>
                            </div>
                            <button
                                onClick={() => handleBook(service)}
                                className="w-full brutal-btn-primary py-3 mt-4"
                            >
                                <Calendar className="w-5 h-5" /> Đặt lịch
                            </button>
                        </div>
                    ))}
                </div>

                {/* My Appointments */}
                {isLoggedIn && myAppointments?.length > 0 && (
                    <div className="mb-20">
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8">
                            Lịch hẹn <span className="text-accent">của tôi</span>
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myAppointments.map((apt) => (
                                <div key={apt.appointment_id} className="brutal-card !p-6 hover:translate-x-0 hover:translate-y-0">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`brutal-badge ${getStatusColor(apt.status)}`}>
                                            {apt.status}
                                        </span>
                                        <span className="text-sm text-slate-400">#{apt.appointment_id}</span>
                                    </div>
                                    <h4 className="font-black text-lg mb-2">{apt.service}</h4>
                                    <div className="space-y-2 text-sm text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4" /> {apt.user_name}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {apt.date}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" /> {apt.hour}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Features */}
                <div className="brutal-card bg-black text-white !p-12 hover:translate-x-0 hover:translate-y-0">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary brutal-border rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-black" />
                            </div>
                            <h4 className="font-black uppercase mb-2">Chất lượng cao</h4>
                            <p className="text-slate-400 text-sm">Sử dụng sản phẩm cao cấp, nhập khẩu</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-accent brutal-border rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="font-black uppercase mb-2">Đội ngũ chuyên nghiệp</h4>
                            <p className="text-slate-400 text-sm">Nhân viên được đào tạo bài bản</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-secondary brutal-border rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="font-black uppercase mb-2">Yêu thương thú cưng</h4>
                            <p className="text-slate-400 text-sm">Chăm sóc như chính thú cưng của mình</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {isBookingOpen && selectedService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 overflow-y-auto">
                    <div className="brutal-card bg-white !p-8 max-w-lg w-full my-8">
                        <h3 className="text-2xl font-black uppercase mb-2">Đặt lịch hẹn</h3>
                        <p className="text-slate-500 mb-6">{selectedService.name} - {selectedService.price.toLocaleString()}đ</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-black uppercase text-xs mb-2">Tên thú cưng</label>
                                    <input
                                        type="text"
                                        className="brutal-input"
                                        value={formData.petName}
                                        onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block font-black uppercase text-xs mb-2">Loại</label>
                                    <select
                                        className="brutal-input"
                                        value={formData.petType}
                                        onChange={(e) => setFormData({ ...formData, petType: e.target.value })}
                                    >
                                        <option value="dog">Chó</option>
                                        <option value="cat">Mèo</option>
                                        <option value="other">Khác</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block font-black uppercase text-xs mb-2">Tên chủ</label>
                                <input
                                    type="text"
                                    className="brutal-input"
                                    value={formData.ownerName}
                                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-black uppercase text-xs mb-2">Số điện thoại</label>
                                <input
                                    type="tel"
                                    className="brutal-input"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-black uppercase text-xs mb-2">Ngày</label>
                                    <input
                                        type="date"
                                        className="brutal-input"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block font-black uppercase text-xs mb-2">Giờ</label>
                                    <select
                                        className="brutal-input"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    >
                                        {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block font-black uppercase text-xs mb-2">Ghi chú (tùy chọn)</label>
                                <textarea
                                    className="brutal-input min-h-[80px]"
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                    placeholder="Lưu ý đặc biệt về thú cưng..."
                                />
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => { setIsBookingOpen(false); setSelectedService(null); }}
                                    className="flex-1 brutal-btn-secondary py-3"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={bookMutation.isPending}
                                    className="flex-1 brutal-btn-primary py-3"
                                >
                                    {bookMutation.isPending ? 'Đang đặt...' : 'Xác nhận đặt lịch'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Services;
