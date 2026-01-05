import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Search, X, Mail, Phone, Shield, User, Calendar } from 'lucide-react';
import api from '../../api/axios';

const AdminUsers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    // Using /Authenticate/get-all endpoint
    const { data: users, isLoading, error } = useQuery({
        queryKey: ['adminUsers'],
        queryFn: async () => {
            const res = await api.get('/Authenticate/get-all');
            return res.data;
        },
    });

    const filteredUsers = users?.filter(u =>
        u.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="skeleton h-20"></div>
                <div className="skeleton h-96"></div>
            </div>
        );
    }

    if (error || !users?.length) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter">
                        Quản lý <span className="text-green-500">người dùng</span>
                    </h1>
                </div>
                <div className="brutal-card bg-slate-50 !p-12 text-center hover:translate-x-0 hover:translate-y-0">
                    <Users className="w-24 h-24 mx-auto mb-6 text-slate-300" />
                    <h2 className="text-2xl font-black uppercase mb-4">Chưa có dữ liệu</h2>
                    <p className="text-slate-500 max-w-md mx-auto">
                        Backend cần endpoint <code className="bg-slate-200 px-2 py-1 rounded font-mono text-sm">/api/Authenticate/list</code> để lấy danh sách người dùng.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter">
                    Quản lý <span className="text-green-500">người dùng</span>
                </h1>
                <p className="text-slate-500 font-bold mt-1">{filteredUsers.length} người dùng</p>
            </div>

            {/* Search */}
            <div className="brutal-card !p-4 flex items-center gap-4 hover:translate-x-0 hover:translate-y-0">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Tìm theo tên, email..."
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
                                <th className="text-left p-4 font-black uppercase text-xs">Người dùng</th>
                                <th className="text-left p-4 font-black uppercase text-xs">Email</th>
                                <th className="text-left p-4 font-black uppercase text-xs">Số điện thoại</th>
                                <th className="text-left p-4 font-black uppercase text-xs">Vai trò</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, idx) => (
                                <tr
                                    key={user.id || idx}
                                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                                    onClick={() => setSelectedUser(user)}
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-accent brutal-border rounded-full flex items-center justify-center text-white font-black">
                                                {user.userName?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-black">{user.name || user.userName}</p>
                                                <p className="text-xs text-slate-500">@{user.userName}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="w-4 h-4 text-slate-400" />
                                            {user.phoneNumber || '-'}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`brutal-badge ${user.role?.includes('Admin') ? 'bg-secondary text-white' : 'bg-slate-100'}`}>
                                            <Shield className="w-3 h-3 inline mr-1" />
                                            {user.role || 'User'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
                    <div className="brutal-card bg-white !p-8 max-w-md w-full">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-black uppercase">Chi tiết người dùng</h3>
                            <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="text-center mb-6">
                            <div className="w-20 h-20 bg-accent brutal-border rounded-full flex items-center justify-center text-white font-black text-3xl mx-auto mb-4">
                                {selectedUser.userName?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <h4 className="text-xl font-black">{selectedUser.name || selectedUser.userName}</h4>
                            <p className="text-slate-500">@{selectedUser.userName}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="brutal-card bg-slate-50 !p-4 flex items-center gap-4">
                                <Mail className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-black">Email</p>
                                    <p className="font-bold">{selectedUser.email}</p>
                                </div>
                            </div>
                            <div className="brutal-card bg-slate-50 !p-4 flex items-center gap-4">
                                <Phone className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-black">Số điện thoại</p>
                                    <p className="font-bold">{selectedUser.phoneNumber || '-'}</p>
                                </div>
                            </div>
                            <div className="brutal-card bg-slate-50 !p-4 flex items-center gap-4">
                                <Shield className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-black">Vai trò</p>
                                    <p className="font-bold">{selectedUser.role || 'User'}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedUser(null)}
                            className="w-full brutal-btn-primary py-3 mt-6"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
