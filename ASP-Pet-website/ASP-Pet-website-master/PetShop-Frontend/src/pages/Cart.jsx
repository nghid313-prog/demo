import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag, PawPrint } from 'lucide-react';

const Cart = () => {
    const { items, removeFromCart, updateQuantity, getSubtotal, clearCart, getItemCount } = useCart();

    if (items.length === 0) {
        return (
            <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
                <div className="text-center py-32 bg-white brutal-border rounded-[2rem] shadow-brutal">
                    <ShoppingCart className="w-24 h-24 mx-auto mb-8 text-slate-300" />
                    <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">
                        Giỏ hàng <span className="text-secondary">trống</span>
                    </h1>
                    <p className="font-bold text-slate-500 mb-10 text-xl">
                        Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/pets" className="brutal-btn-primary py-4 px-8 text-lg">
                            <PawPrint className="w-5 h-5" /> Xem thú cưng
                        </Link>
                        <Link to="/shop" className="brutal-btn-secondary py-4 px-8 text-lg">
                            <ShoppingBag className="w-5 h-5" /> Xem sản phẩm
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
                        Giỏ <span className="text-primary">Hàng</span>
                    </h1>
                    <p className="font-bold text-slate-500 text-lg mt-2">
                        {getItemCount()} sản phẩm trong giỏ
                    </p>
                </div>
                <button
                    onClick={clearCart}
                    className="brutal-btn-secondary py-3 px-6 text-sm text-secondary hover:bg-secondary hover:text-white"
                >
                    <Trash2 className="w-4 h-4" /> Xóa tất cả
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    {items.map((item) => (
                        <div key={`${item.type}-${item.id}`} className="brutal-card !p-6 flex flex-col sm:flex-row gap-6 hover:translate-x-0 hover:translate-y-0">
                            {/* Image */}
                            <div className="w-full sm:w-32 h-32 bg-slate-50 brutal-border rounded-xl overflow-hidden flex-shrink-0">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : item.type === 'animal' ? (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <PawPrint className="w-12 h-12 text-slate-300" />
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ShoppingBag className="w-12 h-12 text-slate-300" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`brutal-badge text-[10px] ${item.type === 'animal' ? 'bg-accent text-white' : 'bg-secondary text-white'}`}>
                                            {item.type === 'animal' ? 'Thú cưng' : 'Sản phẩm'}
                                        </span>
                                        <span className="text-xs font-bold text-slate-400">{item.category}</span>
                                    </div>
                                    <h3 className="font-black uppercase text-xl mb-1">{item.name}</h3>
                                    <p className="text-2xl font-black italic text-primary">
                                        {item.price.toLocaleString()}đ
                                    </p>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    {/* Quantity Controls */}
                                    {item.type === 'product' ? (
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                                                className="w-10 h-10 brutal-border bg-white rounded-lg font-black text-lg hover:bg-slate-100 flex items-center justify-center"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="text-xl font-black w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                                                disabled={item.quantity >= item.maxQuantity}
                                                className="w-10 h-10 brutal-border bg-white rounded-lg font-black text-lg hover:bg-slate-100 flex items-center justify-center disabled:opacity-50"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-sm font-bold text-slate-400">Số lượng: 1</span>
                                    )}

                                    {/* Subtotal & Remove */}
                                    <div className="flex items-center gap-4">
                                        <span className="font-black text-lg">
                                            {(item.price * item.quantity).toLocaleString()}đ
                                        </span>
                                        <button
                                            onClick={() => removeFromCart(item.id, item.type)}
                                            className="p-2 brutal-border rounded-lg bg-red-50 hover:bg-secondary hover:text-white transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="brutal-card bg-black text-white !p-8 sticky top-32 hover:translate-x-0 hover:translate-y-0">
                        <h2 className="text-2xl font-black uppercase mb-8">Tổng đơn hàng</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between font-bold">
                                <span className="text-slate-400">Tạm tính</span>
                                <span>{getSubtotal().toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span className="text-slate-400">Phí vận chuyển</span>
                                <span className="text-primary">Miễn phí</span>
                            </div>
                            <div className="border-t border-slate-700 pt-4 flex justify-between font-black text-xl">
                                <span>Tổng cộng</span>
                                <span className="text-primary">{getSubtotal().toLocaleString()}đ</span>
                            </div>
                        </div>

                        <Link
                            to="/checkout"
                            className="w-full brutal-btn bg-primary text-black hover:bg-yellow-400 py-5 text-xl"
                        >
                            THANH TOÁN <ArrowRight className="w-6 h-6" />
                        </Link>

                        <div className="mt-6 text-center">
                            <Link to="/shop" className="font-bold text-sm text-slate-400 hover:text-white uppercase underline underline-offset-4">
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
