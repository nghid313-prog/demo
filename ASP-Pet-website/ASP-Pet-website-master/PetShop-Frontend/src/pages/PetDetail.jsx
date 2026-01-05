import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { dogItemsApi } from '../api/services';
import { useCart } from '../context/CartContext';
import { PawPrint, ArrowLeft, Heart, MapPin, Calendar, Palette, Shield, Star, ShoppingCart, Sparkles, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PetDetail = () => {
    const { id } = useParams();
    const { addToCart, isInCart } = useCart();

    const { data: pet, isLoading, error } = useQuery({
        queryKey: ['pet', id],
        queryFn: () => dogItemsApi.getItemById(id).then(res => res.data),
        enabled: !!id,
    });

    const handleAddToCart = () => {
        if (!pet) return;

        const alreadyInCart = isInCart(pet.dogItemId, 'animal');
        if (alreadyInCart) {
            toast.error('Thú cưng này đã có trong giỏ hàng!', {
                style: {
                    borderRadius: '12px',
                    background: '#000',
                    color: '#fff',
                    border: '3px solid #FF5757',
                    fontFamily: 'Lexend Mega, sans-serif',
                },
            });
            return;
        }

        addToCart(pet, 'animal');
        toast.success(`Đã thêm ${pet.dogName} vào giỏ hàng!`, {
            style: {
                borderRadius: '12px',
                background: '#000',
                color: '#fff',
                border: '3px solid #FFDE59',
                fontFamily: 'Lexend Mega, sans-serif',
            },
        });
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

    if (error || !pet) {
        return (
            <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center">
                <PawPrint className="w-24 h-24 mx-auto mb-8 text-slate-300" />
                <h1 className="text-4xl font-black uppercase mb-4">Không tìm thấy thú cưng</h1>
                <Link to="/pets" className="brutal-btn-primary py-3 px-8 inline-flex">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại danh sách
                </Link>
            </div>
        );
    }

    const images = pet.images || [];

    return (
        <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <Link to="/pets" className="inline-flex items-center gap-2 font-bold text-slate-500 hover:text-black mb-10 group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="uppercase text-sm">Quay lại danh sách thú cưng</span>
            </Link>

            <div className="grid lg:grid-cols-2 gap-16">
                {/* Image Gallery */}
                <div className="space-y-6">
                    <div className="h-[500px] bg-slate-50 brutal-border rounded-[2rem] overflow-hidden shadow-brutal relative">
                        {images[0] ? (
                            <img
                                src={images[0]}
                                alt={pet.dogName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <PawPrint className="w-32 h-32 text-slate-200" />
                            </div>
                        )}
                        <div className="absolute top-6 left-6">
                            <div className="brutal-badge bg-primary text-base px-4 py-2 flex items-center gap-1">
                                {pet.isInStock ? <><Sparkles className="w-4 h-4" /> Còn hàng</> : <><XCircle className="w-4 h-4" /> Đã bán</>}
                            </div>
                        </div>
                    </div>

                    {/* Thumbnail Gallery */}
                    {images.length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {images.slice(0, 4).map((img, idx) => (
                                <div key={idx} className="h-24 bg-slate-50 brutal-border rounded-xl overflow-hidden">
                                    <img src={img} alt={`${pet.dogName} ${idx + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="brutal-badge bg-accent text-white">{pet.dogSpeciesName}</span>
                            <span className="brutal-badge bg-black text-white">
                                {pet.sex === "Đực" ? "♂ Nam" : "♀ Nữ"}
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4">
                            {pet.dogName}
                        </h1>
                        <div className="flex items-center gap-2 mb-6">
                            {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-5 h-5 fill-primary text-black" />)}
                            <span className="font-bold text-slate-500 ml-2">(12 đánh giá)</span>
                        </div>
                    </div>

                    <p className="text-xl text-slate-600 font-medium leading-relaxed border-l-4 border-primary pl-6 italic">
                        {pet.description}
                    </p>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="brutal-card bg-slate-50 flex items-center gap-4 !p-4">
                            <Calendar className="w-8 h-8 text-accent" />
                            <div>
                                <span className="text-xs font-black uppercase text-slate-400">Tuổi</span>
                                <p className="font-black text-lg">{pet.age} tháng</p>
                            </div>
                        </div>
                        <div className="brutal-card bg-slate-50 flex items-center gap-4 !p-4">
                            <Palette className="w-8 h-8 text-secondary" />
                            <div>
                                <span className="text-xs font-black uppercase text-slate-400">Màu sắc</span>
                                <p className="font-black text-lg">{pet.color}</p>
                            </div>
                        </div>
                        <div className="brutal-card bg-slate-50 flex items-center gap-4 !p-4">
                            <MapPin className="w-8 h-8 text-primary" />
                            <div>
                                <span className="text-xs font-black uppercase text-slate-400">Nguồn gốc</span>
                                <p className="font-black text-lg">{pet.origin}</p>
                            </div>
                        </div>
                        <div className="brutal-card bg-slate-50 flex items-center gap-4 !p-4">
                            <Shield className="w-8 h-8 text-green-500" />
                            <div>
                                <span className="text-xs font-black uppercase text-slate-400">Sức khỏe</span>
                                <p className="font-black text-lg">{pet.healthStatus}</p>
                            </div>
                        </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="brutal-card bg-primary !p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <span className="text-sm font-black uppercase text-black/60">Chi phí đón bé</span>
                            <p className="text-4xl md:text-5xl font-black italic tracking-tighter">
                                {(pet.price || 0).toLocaleString()}đ
                            </p>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={!pet.isInStock}
                            className="brutal-btn-accent py-5 px-10 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ShoppingCart className="w-6 h-6" />
                            {pet.isInStock ? 'THÊM VÀO GIỎ' : 'ĐÃ BÁN'}
                        </button>
                    </div>

                    {/* Wishlist */}
                    <button className="w-full brutal-btn-secondary py-4 text-base">
                        <Heart className="w-5 h-5" />
                        Thêm vào danh sách yêu thích
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PetDetail;
