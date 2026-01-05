import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, User, Phone, Search, X, Eye, CheckCircle, XCircle, AlertCircle, PawPrint } from 'lucide-react';
import api from '../../api/axios';

const AdminAppointments = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    const { data: appointments, isLoading } = useQuery({
        queryKey: ['adminAppointments'],
        queryFn: () => api.get('/Appointment/get-all').then(res => res.data),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, status }) => api.put(`/Appointment/updateStatus/${id}`, {
            Result: '',
            Status: status
        }),
        onSuccess: () => {
            toast.success('Cập nhật trạng thái thành công!', {
                style: { borderRadius: '12px', background: '#000', color: '#fff', border: '3px solid #4ADE80' }
            });
            queryClient.invalidateQueries(['adminAppointments']);
            setSelectedAppointment(null);
        },
    });

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'đã xác nhận':
            case 'đã hoàn thành':
                return <CheckCircle className="w-4 h-4" />;
            case 'đã hủy':
                return <XCircle className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'đã xác nhận': return 'bg-green-100 text-green-700';
            case 'đã hoàn thành': return 'bg-accent/10 text-accent';
            case 'đã hủy': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    const statusOptions = ['Chờ xác nhận', 'Đã xác nhận', 'Đã hoàn thành', 'Đã hủy'];

    const filteredAppointments = appointments?.filter(a =>
        a.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.phone_number?.includes(searchTerm)
    ) || [];

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="skeleton h-20"></div>
                <div className="skeleton h-96"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter">
                    Quản lý <span className="text-accent">lịch hẹn</span>
                </h1>
                <p className="text-slate-500 font-bold mt-1">{filteredAppointments.length} lịch hẹn</p>
            </div>

            {filteredAppointments.length === 0 && (
                <div className="brutal-card bg-slate-50 !p-12 text-center hover:translate-x-0 hover:translate-y-0">
                    <Calendar className="w-24 h-24 mx-auto mb-6 text-slate-300" />
                    <h2 className="text-2xl font-black uppercase mb-4">Chưa có lịch hẹn nào</h2>
                    <p className="text-slate-500">Lịch hẹn sẽ xuất hiện ở đây khi khách hàng đặt lịch.</p>
                </div>
            )}

            {/* Search */}
            <div className="brutal-card !p-4 flex items-center gap-4 hover:translate-x-0 hover:translate-y-0">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Tìm theo tên thú cưng, chủ, SĐT..."
                    className="flex-1 bg-transparent font-bold outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="p-1 hover:bg-slate-100 rounded">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="brutal-card !p-0 overflow-hidden hover:translate-x-0 hover:translate-y-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b-4 border-black">
                            <tr>
                                <th className="text-left p-4 font-black uppercase text-xs">ID</th>
                                <th className="text-left p-4 font-black uppercase text-xs">Thú cưng</th>
                                <th className="text-left p-4 font-black uppercase text-xs">Dịch vụ</th>
                                <th className="text-left p-4 font-black uppercase text-xs">Ngày giờ</th>
                                <th className="text-left p-4 font-black uppercase text-xs">Liên hệ</th>
                                <th className="text-left p-4 font-black uppercase text-xs">Trạng thái</th>
                                <th className="text-right p-4 font-black uppercase text-xs">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.map((apt) => (
                                <tr key={apt.appointment_id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="p-4 font-black">#{apt.appointment_id}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-accent" />
                                            <span className="font-bold">{apt.user_name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 font-bold text-sm">{apt.service || '-'}</td>
                                    <td className="p-4">
                                        <div className="text-sm">
                                            <div className="flex items-center gap-1 font-bold">
                                                <Calendar className="w-3 h-3" />
                                                {apt.date}
                                            </div>
                                            <div className="flex items-center gap-1 text-slate-500">
                                                <Clock className="w-3 h-3" />
                                                {apt.hour}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm">
                                            <div className="flex items-center gap-1 font-bold">
                                                <User className="w-3 h-3" /> {apt.user_name}
                                            </div>
                                            <div className="flex items-center gap-1 text-slate-500">
                                                <Phone className="w-3 h-3" /> {apt.phone_number}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`brutal-badge ${getStatusColor(apt.status)} flex items-center gap-1 w-fit`}>
                                            {getStatusIcon(apt.status)} {apt.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => {
                                                setSelectedAppointment(apt);
                                                setNewStatus(apt.status);
                                            }}
                                            className="p-2 brutal-border rounded-lg bg-accent/10 hover:bg-accent/20 text-accent"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedAppointment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
                    <div className="brutal-card bg-white !p-8 max-w-lg w-full">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-black uppercase">Lịch hẹn #{selectedAppointment.appointment_id}</h3>
                            <button onClick={() => setSelectedAppointment(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="brutal-card bg-slate-50 !p-4">
                                <p className="text-xs text-slate-400 uppercase font-black mb-1">Dịch vụ</p>
                                <p className="font-bold text-lg">{selectedAppointment.service}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="brutal-card bg-slate-50 !p-4">
                                    <p className="text-xs text-slate-400 uppercase font-black mb-1">Khách hàng</p>
                                    <p className="font-bold">{selectedAppointment.user_name}</p>
                                </div>
                                <div className="brutal-card bg-slate-50 !p-4">
                                    <p className="text-xs text-slate-400 uppercase font-black mb-1">SĐT</p>
                                    <p className="font-bold">{selectedAppointment.phone_number}</p>
                                </div>
                            </div>
                            {selectedAppointment.description && (
                                <div className="brutal-card bg-slate-50 !p-4">
                                    <p className="text-xs text-slate-400 uppercase font-black mb-1">Chi tiết</p>
                                    <p className="text-sm">{selectedAppointment.description}</p>
                                </div>
                            )}
                        </div>

                        <div className="mb-6">
                            <p className="font-black uppercase text-xs mb-3">Cập nhật trạng thái</p>
                            <div className="flex gap-2 flex-wrap">
                                {statusOptions.map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setNewStatus(status)}
                                        className={`px-4 py-2 brutal-border rounded-lg font-bold text-sm transition-all ${newStatus === status ? 'bg-primary' : 'bg-white hover:bg-slate-50'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setSelectedAppointment(null)} className="flex-1 brutal-btn-secondary py-3">
                                Đóng
                            </button>
                            <button
                                onClick={() => updateMutation.mutate({ id: selectedAppointment.appointment_id, status: newStatus })}
                                disabled={updateMutation.isPending || newStatus === selectedAppointment.status}
                                className="flex-1 brutal-btn-primary py-3 disabled:opacity-50"
                            >
                                {updateMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAppointments;
