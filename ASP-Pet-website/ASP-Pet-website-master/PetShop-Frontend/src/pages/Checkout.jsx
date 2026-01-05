import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { checkoutApi } from '../api/services';
import { toast } from 'react-hot-toast';
import { ShoppingCart, CreditCard, MapPin, Phone, Mail, User, Tag, ArrowLeft, Truck, Package, CheckCircle } from 'lucide-react';

const Checkout = () => {
    const { items, getSubtotal, clearCart, getItemCount } = useCart();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        voucher: '',
        payment: 'COD',
        note: ''
    });

    const [discount, setDiscount] = useState(0);

    // Get user info from localStorage
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setFormData(prev => ({
                    ...prev,
                    name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                    email: user.email || '',
                    phone: user.phoneNumber || ''
                }));
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleApplyVoucher = async () => {
        if (!formData.voucher.trim()) return;

        try {
            const res = await checkoutApi.getVouchers();
            const vouchers = res.data || [];
            const found = vouchers.find(v => v.code?.toLowerCase() === formData.voucher.toLowerCase());

            if (found && found.discountPercent) {
                const discountAmount = Math.floor(getSubtotal() * (found.discountPercent / 100));
                setDiscount(discountAmount);
                toast.success(`Áp dụng thành công! Giảm ${found.discountPercent}%`, {
                    style: {
                        borderRadius: '12px',
                        background: '#000',
                        color: '#fff',
                        border: '3px solid #4ADE80',
                    }
                });
            } else {
                toast.error('Mã giảm giá không hợp lệ!', {
                    style: {
                        borderRadius: '12px',
                        background: '#000',
                        color: '#fff',
                        border: '3px solid #FF5757',
                    }
                });
            }
        } catch (error) {
            toast.error('Không thể áp dụng mã giảm giá!');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (items.length === 0) {
            toast.error('Giỏ hàng trống!');
            return;
        }

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');
        if (!token || !user.email) {
            toast.error('Vui lòng đăng nhập để thanh toán!');
            navigate('/login');
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                User_id: user.email,
                Total: getSubtotal() - discount,
                Address: formData.address,
                Status: 'Đang xử lý',
                Payment: formData.payment,
                Email: formData.email,
                PhoneNumber: formData.phone,
                Name: formData.name,
                Data: items.map(item => ({
                    id: item.id,
                    type: item.type,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    stock: item.maxQuantity || 999,
                    images: item.image ? [item.image] : []
                }))
            };

            const response = await checkoutApi.createOrder(orderData);

            if (response.data?.status === 201 || response.status === 200) {
                setOrderSuccess(true);
                setOrderId(response.data?.id || Date.now());
                clearCart();
                toast.success('Đặt hàng thành công!', {
                    style: {
                        borderRadius: '12px',
                        background: '#000',
                        color: '#fff',
                        border: '3px solid #4ADE80',
                    },
                    duration: 5000
                });
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error(error.response?.data?.message || 'Đặt hàng thất bại! Vui lòng thử lại.', {
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

    // Success screen
    if (orderSuccess) {
        return (
            <div className="pt-40 pb-20 px-6 max-w-4xl mx-auto">
                <div className="bg-white brutal-border rounded-[2rem] p-16 shadow-brutal text-center">
                    <div className="w-24 h-24 bg-green-100 brutal-border rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle className="w-14 h-14 text-green-600" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">
                        Đặt hàng <span className="text-green-500">thành công!</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-bold mb-8">
                        Cảm ơn bạn đã đặt hàng tại Paws & Co. Chúng tôi sẽ liên hệ với bạn sớm!
                    </p>
                    <div className="brutal-card bg-slate-50 !p-6 mb-8 inline-block">
                        <p className="text-sm font-bold text-slate-400 uppercase">Mã đơn hàng</p>
                        <p className="text-2xl font-black">#{orderId}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/" className="brutal-btn-primary py-4 px-10 text-lg">
                            Về trang chủ
                        </Link>
                        <Link to="/shop" className="brutal-btn-secondary py-4 px-10 text-lg">
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Empty cart
    if (items.length === 0) {
        return (
            <div className="pt-40 pb-20 px-6 max-w-4xl mx-auto text-center">
                <ShoppingCart className="w-24 h-24 mx-auto mb-8 text-slate-300" />
                <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">
                    Giỏ hàng <span className="text-secondary">trống</span>
                </h1>
                <p className="font-bold text-slate-500 mb-10 text-xl">
                    Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.
                </p>
                <Link to="/shop" className="brutal-btn-primary py-4 px-10 text-lg inline-flex">
                    <ArrowLeft className="w-5 h-5" /> Quay lại cửa hàng
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-12">
                <Link to="/cart" className="brutal-btn-secondary py-3 px-6">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">
                        Thanh <span className="text-primary">Toán</span>
                    </h1>
                    <p className="font-bold text-slate-500 mt-1">{getItemCount()} sản phẩm</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Form Section */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Customer Info */}
                        <div className="brutal-card !p-8 hover:translate-x-0 hover:translate-y-0">
                            <h2 className="text-xl font-black uppercase flex items-center gap-3 mb-6">
                                <User className="w-6 h-6 text-accent" /> Thông tin khách hàng
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-black uppercase text-xs mb-2 text-slate-400">Họ và tên *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="brutal-input"
                                        placeholder="Nguyễn Văn A"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block font-black uppercase text-xs mb-2 text-slate-400">Số điện thoại *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            className="brutal-input pl-12"
                                            placeholder="0901234567"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block font-black uppercase text-xs mb-2 text-slate-400">Email *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            className="brutal-input pl-12"
                                            placeholder="email@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="brutal-card !p-8 hover:translate-x-0 hover:translate-y-0">
                            <h2 className="text-xl font-black uppercase flex items-center gap-3 mb-6">
                                <MapPin className="w-6 h-6 text-secondary" /> Địa chỉ giao hàng
                            </h2>
                            <div>
                                <label className="block font-black uppercase text-xs mb-2 text-slate-400">Địa chỉ đầy đủ *</label>
                                <textarea
                                    name="address"
                                    required
                                    rows={3}
                                    className="brutal-input resize-none"
                                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="brutal-card !p-8 hover:translate-x-0 hover:translate-y-0">
                            <h2 className="text-xl font-black uppercase flex items-center gap-3 mb-6">
                                <CreditCard className="w-6 h-6 text-primary" /> Phương thức thanh toán
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <label className={`brutal-card !p-6 cursor-pointer flex items-center gap-4 ${formData.payment === 'COD' ? 'bg-primary !translate-x-0 !translate-y-0' : 'bg-slate-50'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="COD"
                                        checked={formData.payment === 'COD'}
                                        onChange={handleChange}
                                        className="w-5 h-5"
                                    />
                                    <div>
                                        <Truck className="w-8 h-8 mb-2" />
                                        <p className="font-black uppercase">COD</p>
                                        <p className="text-xs text-slate-500">Thanh toán khi nhận hàng</p>
                                    </div>
                                </label>
                                <label className={`brutal-card !p-6 cursor-pointer flex items-center gap-4 ${formData.payment === 'Bank' ? 'bg-primary !translate-x-0 !translate-y-0' : 'bg-slate-50'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="Bank"
                                        checked={formData.payment === 'Bank'}
                                        onChange={handleChange}
                                        className="w-5 h-5"
                                    />
                                    <div>
                                        <CreditCard className="w-8 h-8 mb-2" />
                                        <p className="font-black uppercase">Ngân hàng</p>
                                        <p className="text-xs text-slate-500">Thanh toán qua ngân hàng</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="brutal-card bg-black text-white !p-8 sticky top-32 hover:translate-x-0 hover:translate-y-0">
                            <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-3">
                                <Package className="w-6 h-6 text-primary" /> Đơn hàng
                            </h2>

                            {/* Items */}
                            <div className="space-y-4 max-h-60 overflow-y-auto mb-6 pr-2">
                                {items.map((item) => (
                                    <div key={`${item.type}-${item.id}`} className="flex items-center gap-4 border-b border-slate-700 pb-4">
                                        <div className="w-14 h-14 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-500">
                                                    <Package className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate">{item.name}</p>
                                            <p className="text-xs text-slate-400">SL: {item.quantity}</p>
                                        </div>
                                        <p className="font-black text-sm text-primary">
                                            {(item.price * item.quantity).toLocaleString()}đ
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Voucher */}
                            <div className="mb-6">
                                <label className="block font-bold text-xs mb-2 text-slate-400 uppercase">Mã giảm giá</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            type="text"
                                            name="voucher"
                                            className="w-full px-10 py-3 bg-slate-800 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Nhập mã"
                                            value={formData.voucher}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleApplyVoucher}
                                        className="px-4 py-3 bg-primary text-black font-black text-xs rounded-xl hover:bg-yellow-400"
                                    >
                                        ÁP DỤNG
                                    </button>
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 mb-8 text-sm">
                                <div className="flex justify-between font-bold">
                                    <span className="text-slate-400">Tạm tính</span>
                                    <span>{getSubtotal().toLocaleString()}đ</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between font-bold text-green-400">
                                        <span>Giảm giá</span>
                                        <span>-{discount.toLocaleString()}đ</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold">
                                    <span className="text-slate-400">Phí vận chuyển</span>
                                    <span className="text-green-400">Miễn phí</span>
                                </div>
                                <div className="border-t border-slate-700 pt-4 flex justify-between font-black text-xl">
                                    <span>Tổng cộng</span>
                                    <span className="text-primary">{(getSubtotal() - discount).toLocaleString()}đ</span>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full brutal-btn bg-primary text-black hover:bg-yellow-400 py-5 text-lg disabled:opacity-50"
                            >
                                {isSubmitting ? 'ĐANG XỬ LÝ...' : 'ĐẶT HÀNG NGAY'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Checkout;
