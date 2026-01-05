import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ShoppingBag, Plus, Edit2, Trash2, Search, X, AlertTriangle, Package, Upload } from 'lucide-react';
import api from '../../api/axios';

const AdminProducts = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        itemName: '',
        price: 0,
        quantity: 0,
        description: '',
        category: 'Thức ăn'
    });
    const [editingProduct, setEditingProduct] = useState(null);

    const { data: products, isLoading } = useQuery({
        queryKey: ['adminProducts'],
        queryFn: () => api.get('/DogProductItem/get-all-dog-product-admin').then(res => res.data),
    });

    const createMutation = useMutation({
        mutationFn: (data) => api.post('/DogProductItem/add-dog-product-item', data),
        onSuccess: () => {
            toast.success('Thêm sản phẩm thành công!', {
                style: { borderRadius: '12px', background: '#000', color: '#fff', border: '3px solid #4ADE80' }
            });
            queryClient.invalidateQueries(['adminProducts']);
            closeModal();
        },
        onError: () => {
            toast.error('Thêm sản phẩm thất bại!', {
                style: { borderRadius: '12px', background: '#000', color: '#fff', border: '3px solid #FF5757' }
            });
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => api.put(`/DogProductItem/update-dog-product-item/${id}`, data),
        onSuccess: () => {
            toast.success('Cập nhật sản phẩm thành công!', {
                style: { borderRadius: '12px', background: '#000', color: '#fff', border: '3px solid #4ADE80' }
            });
            queryClient.invalidateQueries(['adminProducts']);
            closeModal();
        },
        onError: () => {
            toast.error('Cập nhật thất bại!', {
                style: { borderRadius: '12px', background: '#000', color: '#fff', border: '3px solid #FF5757' }
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/DogProductItem/delete-dog-product-item/${id}`),
        onSuccess: () => {
            toast.success('Xóa sản phẩm thành công!', {
                style: { borderRadius: '12px', background: '#000', color: '#fff', border: '3px solid #4ADE80' }
            });
            queryClient.invalidateQueries(['adminProducts']);
            setDeleteId(null);
        },
        onError: () => {
            toast.error('Xóa thất bại!', {
                style: { borderRadius: '12px', background: '#000', color: '#fff', border: '3px solid #FF5757' }
            });
        }
    });

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setImageFile(null);
        setImagePreview(null);
        setFormData({ itemName: '', price: 0, quantity: 0, description: '', category: 'Thức ăn' });
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            itemName: product.itemName || '',
            price: product.price || 0,
            quantity: product.quantity || 0,
            description: product.description || '',
            category: product.category || 'Thức ăn'
        });
        if (product.images?.[0]) {
            setImagePreview(product.images[0]);
        }
        setIsModalOpen(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File quá lớn! Giới hạn 5MB', {
                    style: { borderRadius: '12px', background: '#000', color: '#fff', border: '3px solid #FF5757' }
                });
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadImage = async (file) => {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        const response = await api.post('/Upload/image', formDataUpload, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            let imageUrl = null;
            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            }

            const payload = {
                ItemName: formData.itemName,
                Price: formData.price,
                Quantity: formData.quantity,
                Category: formData.category,
                Description: formData.description || '',
                Images: imageUrl ? [`http://localhost:5114${imageUrl}`] : (editingProduct?.images || []),
                IsInStock: true,
                IsDeleted: false
            };

            if (editingProduct) {
                updateMutation.mutate({ id: editingProduct.dogProductItemId, data: payload });
            } else {
                createMutation.mutate(payload);
            }
        } catch (error) {
            toast.error('Upload ảnh thất bại!', {
                style: { borderRadius: '12px', background: '#000', color: '#fff', border: '3px solid #FF5757' }
            });
        } finally {
            setIsUploading(false);
        }
    };

    const filteredProducts = products?.filter(p =>
        p.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="brutal-card h-20 animate-pulse bg-slate-100"></div>
                <div className="brutal-card h-96 animate-pulse bg-slate-100"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter">
                        Quản lý <span className="text-secondary">sản phẩm</span>
                    </h1>
                    <p className="text-slate-500 font-bold mt-1">{filteredProducts.length} sản phẩm</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="brutal-btn-primary py-3 px-6">
                    <Plus className="w-5 h-5" /> Thêm sản phẩm
                </button>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className="brutal-card bg-slate-50 !p-12 text-center hover:translate-x-0 hover:translate-y-0">
                    <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-slate-300" />
                    <h2 className="text-2xl font-black uppercase mb-4">Chưa có sản phẩm nào</h2>
                    <p className="text-slate-500 mb-6">Thêm sản phẩm đầu tiên cho cửa hàng của bạn.</p>
                    <button onClick={() => setIsModalOpen(true)} className="brutal-btn-primary py-3 px-6">
                        <Plus className="w-5 h-5" /> Thêm sản phẩm
                    </button>
                </div>
            )}

            {/* Search + Table (only show if products exist) */}
            {filteredProducts.length > 0 && (
                <>
                    <div className="brutal-card !p-4 flex items-center gap-4 hover:translate-x-0 hover:translate-y-0">
                        <Search className="w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
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

                    <div className="brutal-card !p-0 overflow-hidden hover:translate-x-0 hover:translate-y-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b-4 border-black">
                                    <tr>
                                        <th className="text-left p-4 font-black uppercase text-xs">Sản phẩm</th>
                                        <th className="text-left p-4 font-black uppercase text-xs">Danh mục</th>
                                        <th className="text-left p-4 font-black uppercase text-xs">Giá</th>
                                        <th className="text-left p-4 font-black uppercase text-xs">Tồn kho</th>
                                        <th className="text-right p-4 font-black uppercase text-xs">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product) => (
                                        <tr key={product.dogProductItemId} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-slate-100 brutal-border rounded-xl overflow-hidden flex-shrink-0">
                                                        {product.images?.[0] ? (
                                                            <img src={product.images[0]} alt={product.itemName} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <ShoppingBag className="w-6 h-6 text-slate-300" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="font-black">{product.itemName}</p>
                                                </div>
                                            </td>
                                            <td className="p-4 font-bold text-sm">{product.category || '-'}</td>
                                            <td className="p-4 font-black text-primary">{product.price?.toLocaleString()}đ</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <Package className="w-4 h-4 text-slate-400" />
                                                    <span className={`font-bold ${product.quantity <= 5 ? 'text-red-600' : ''}`}>
                                                        {product.quantity}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="p-2 brutal-border rounded-lg bg-primary/10 hover:bg-primary/20"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteId(product.dogProductItemId)}
                                                        className="p-2 brutal-border rounded-lg bg-red-100 hover:bg-red-200 text-red-600"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
                    <div className="brutal-card bg-white !p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-black uppercase">Thêm sản phẩm mới</h3>
                            <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-black uppercase text-xs mb-2">Tên sản phẩm</label>
                                <input
                                    type="text"
                                    className="brutal-input"
                                    value={formData.itemName}
                                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-black uppercase text-xs mb-2">Giá (VNĐ)</label>
                                    <input
                                        type="number"
                                        className="brutal-input"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                                        min="0"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block font-black uppercase text-xs mb-2">Số lượng</label>
                                    <input
                                        type="number"
                                        className="brutal-input"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block font-black uppercase text-xs mb-2">Danh mục</label>
                                <select
                                    className="brutal-input"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="Thức ăn">Thức ăn</option>
                                    <option value="Phụ kiện">Phụ kiện</option>
                                    <option value="Đồ chơi">Đồ chơi</option>
                                    <option value="Vệ sinh">Vệ sinh</option>
                                    <option value="Y tế">Y tế</option>
                                </select>
                            </div>
                            <div>
                                <label className="block font-black uppercase text-xs mb-2">Mô tả</label>
                                <textarea
                                    className="brutal-input min-h-[100px]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            {/* Image Upload */}
                            <div>
                                <label className="block font-black uppercase text-xs mb-2">Hình ảnh</label>
                                <div className="border-3 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-primary transition-colors">
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded-lg brutal-border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => { setImageFile(null); setImagePreview(null); }}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer block">
                                            <div className="flex flex-col items-center gap-2 py-4">
                                                <Upload className="w-10 h-10 text-slate-400" />
                                                <span className="text-slate-500 font-bold">Click để chọn ảnh</span>
                                                <span className="text-slate-400 text-xs">JPG, PNG, GIF, WEBP (Max 5MB)</span>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button type="button" onClick={closeModal} className="flex-1 brutal-btn-secondary py-3">
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending || isUploading}
                                    className="flex-1 brutal-btn-primary py-3"
                                >
                                    {isUploading ? 'Đang upload ảnh...' : createMutation.isPending ? 'Đang tạo...' : 'Tạo sản phẩm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
                    <div className="brutal-card bg-white !p-8 max-w-md w-full">
                        <div className="w-16 h-16 bg-red-100 brutal-border rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-2xl font-black uppercase text-center mb-4">Xác nhận xóa?</h3>
                        <p className="text-slate-500 text-center mb-8">Hành động này không thể hoàn tác.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setDeleteId(null)} className="flex-1 brutal-btn-secondary py-3">Hủy</button>
                            <button
                                onClick={() => deleteMutation.mutate(deleteId)}
                                disabled={deleteMutation.isPending}
                                className="flex-1 brutal-btn bg-red-500 text-white py-3 hover:bg-red-600"
                            >
                                {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
