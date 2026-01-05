import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { dogProductsApi } from '../api/services';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ArrowLeft, Heart, Star, ShoppingCart, Package, Tag, Info, Sparkles, XCircle, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: () => dogProductsApi.getProductById(id).then(res => res.data),
        enabled: !!id,
    });

    const handleAddToCart = () => {
        if (!product) return;

        // Add multiple times based on quantity
        for (let i = 0; i < quantity; i++) {
            addToCart(product, 'product');
        }

        toast.success(`Đã thêm ${quantity} ${product.itemName} vào giỏ hàng!`, {
            style: {
                borderRadius: '12px',
                background: '#000',
                color: '#fff',
                border: '3px solid #FFDE59',
                fontFamily: 'Lexend Mega, sans-serif',
            },
        });
        setQuantity(1);
    };

    if (isLoading) {
        return (
            <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16">
                    <div className="h-[500px] bg-slate-100 brutal-border rounded-[2rem] animate-pulse"></div>
                    <div className="space-y-6">
                        <div className="h-12 bg-slate-100 brutal-border rounded-xl w-3/4 animate-pulse"></div>
                        <div className="h-6 bg-slate-100 brutal-border rounded-xl w-1/2 animate-pulse"></div>
                        <div className="h-32 bg-slate-100 brutal-border rounded-xl animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center">
                <ShoppingBag className="w-24 h-24 mx-auto mb-8 text-slate-300" />
                <h1 className="text-4xl font-black uppercase mb-4">Không tìm thấy sản phẩm</h1>
                <Link to="/shop" className="brutal-btn-primary py-3 px-8 inline-flex">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại cửa hàng
                </Link>
            </div>
        );
    }

    const images = product.images || [];

    return (
        <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <Link to="/shop" className="inline-flex items-center gap-2 font-bold text-slate-500 hover:text-black mb-10 group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="uppercase text-sm">Quay lại cửa hàng</span>
            </Link>

            <div className="grid lg:grid-cols-2 gap-16">
                {/* Image Gallery */}
                <div className="space-y-6">
                    <div className="h-[500px] bg-slate-50 brutal-border rounded-[2rem] overflow-hidden shadow-brutal relative">
                        {images[0] ? (
                            <img
                                src={images[0]}
                                alt={product.itemName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBag className="w-32 h-32 text-slate-200" />
                            </div>
                        )}
                        <div className="absolute top-6 left-6 flex gap-2">
                            <div className="brutal-badge bg-primary text-base px-4 py-2">
                                {product.isInStock ? <><Sparkles className="w-4 h-4 inline mr-1" /> Còn hàng</> : <><XCircle className="w-4 h-4 inline mr-1" /> Hết hàng</>}
                            </div>
                            {product.quantity <= 5 && product.quantity > 0 && (
                                <div className="brutal-badge bg-secondary text-white text-base px-4 py-2">
                                    Chỉ còn {product.quantity}!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Thumbnail Gallery */}
                    {images.length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {images.slice(0, 4).map((img, idx) => (
                                <div key={idx} className="h-24 bg-slate-50 brutal-border rounded-xl overflow-hidden">
                                    <img src={img} alt={`${product.itemName} ${idx + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="brutal-badge bg-accent text-white">
                                <Tag className="w-3 h-3 inline mr-1" />
                                {product.category || 'Phụ kiện'}
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4">
                            {product.itemName}
                        </h1>
                        <div className="flex items-center gap-2 mb-6">
                            {[1, 2, 3, 4].map(s => <Star key={s} className="w-5 h-5 fill-primary text-black" />)}
                            <Star className="w-5 h-5 fill-slate-200 text-black" />
                            <span className="font-bold text-slate-500 ml-2">(8 đánh giá)</span>
                        </div>
                    </div>

                    <p className="text-xl text-slate-600 font-medium leading-relaxed border-l-4 border-secondary pl-6 italic">
                        {product.description}
                    </p>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="brutal-card bg-slate-50 flex items-center gap-4 !p-4">
                            <Package className="w-8 h-8 text-accent" />
                            <div>
                                <span className="text-xs font-black uppercase text-slate-400">Tồn kho</span>
                                <p className="font-black text-lg">{product.quantity} sản phẩm</p>
                            </div>
                        </div>
                        <div className="brutal-card bg-slate-50 flex items-center gap-4 !p-4">
                            <Info className="w-8 h-8 text-secondary" />
                            <div>
                                <span className="text-xs font-black uppercase text-slate-400">Danh mục</span>
                                <p className="font-black text-lg">{product.category || 'Chung'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="brutal-card bg-slate-50 !p-6">
                        <label className="block font-black uppercase text-xs mb-3 tracking-widest text-slate-400">Số lượng</label>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className="w-12 h-12 brutal-border bg-white rounded-xl font-black text-2xl hover:bg-slate-100 transition-colors cursor-pointer"
                            >-</button>
                            <span className="text-3xl font-black w-16 text-center">{quantity}</span>
                            <button
                                onClick={() => setQuantity(q => Math.min(product?.quantity || 10, q + 1))}
                                className="w-12 h-12 brutal-border bg-white rounded-xl font-black text-2xl hover:bg-slate-100 transition-colors cursor-pointer"
                            >+</button>
                        </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="brutal-card bg-secondary text-white !p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <span className="text-sm font-black uppercase text-white/60">Giá bán</span>
                            <p className="text-4xl md:text-5xl font-black italic tracking-tighter">
                                {(product.price || 0).toLocaleString()}đ
                            </p>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={!product.isInStock}
                            className="brutal-btn bg-white text-black hover:bg-primary py-5 px-10 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ShoppingCart className="w-6 h-6" />
                            {product.isInStock ? 'THÊM VÀO GIỎ' : 'HẾT HÀNG'}
                        </button>
                    </div>

                    {/* Wishlist */}
                    <button className="w-full brutal-btn-secondary py-4 text-base">
                        <Heart className="w-5 h-5" />
                        Thêm vào danh sách yêu thích
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            <CommentsSection productId={id} />
        </div>
    );
};

// Comments Section Component
const CommentsSection = ({ productId }) => {
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');

    const { data: comments, isLoading, refetch } = useQuery({
        queryKey: ['comments', productId],
        queryFn: async () => {
            const res = await fetch(`http://localhost:5114/api/Comment/product-comment/${productId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'product' })
            });
            if (!res.ok) return [];
            return res.json();
        },
        enabled: !!productId,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('http://localhost:5114/api/Comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: parseInt(productId),
                    content: newComment,
                    type: 'product',
                    user_id: user.id,
                    username: user.username || user.email
                })
            });
            if (res.ok) {
                setNewComment('');
                refetch();
                toast.success('Đã đăng bình luận!');
            }
        } catch (err) {
            toast.error('Không thể đăng bình luận');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="mt-12">
            <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
                <MessageSquare className="w-8 h-8" />
                Đánh giá sản phẩm
                <span className="brutal-badge bg-primary text-sm">{comments?.length || 0}</span>
            </h2>

            {/* Add Comment Form */}
            {user ? (
                <form onSubmit={handleSubmit} className="brutal-card bg-slate-50 !p-6 mb-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 brutal-border bg-primary rounded-full flex items-center justify-center font-black text-lg">
                            {(user.username || user.email)?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Viết đánh giá của bạn..."
                                className="w-full brutal-border rounded-xl p-4 min-h-[100px] resize-none"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting || !newComment.trim()}
                                className="mt-3 brutal-btn bg-primary py-3 px-6 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="brutal-card bg-slate-100 !p-6 mb-6 text-center">
                    <p className="font-bold text-slate-500">
                        <Link to="/login" className="text-secondary underline hover:text-primary">Đăng nhập</Link> để viết đánh giá
                    </p>
                </div>
            )}

            {/* Comments List */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="brutal-card animate-pulse !p-6">
                            <div className="h-4 bg-slate-200 rounded w-1/4 mb-3"></div>
                            <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            ) : comments?.length > 0 ? (
                <div className="space-y-4">
                    {comments.map((comment, idx) => (
                        <div key={comment.commentId || idx} className="brutal-card !p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 brutal-border bg-accent rounded-full flex items-center justify-center font-black text-white">
                                    {comment.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <p className="font-black">{comment.username || 'Ẩn danh'}</p>
                                    <p className="text-xs text-slate-400">
                                        {comment.createAt ? new Date(comment.createAt).toLocaleDateString('vi-VN') : 'Hôm nay'}
                                    </p>
                                </div>
                            </div>
                            <p className="text-slate-700">{comment.content}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="brutal-card bg-slate-50 !p-8 text-center">
                    <MessageSquare className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p className="font-bold text-slate-400">Chưa có đánh giá nào</p>
                    <p className="text-sm text-slate-400">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
