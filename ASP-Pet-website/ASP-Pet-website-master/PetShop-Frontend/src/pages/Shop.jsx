import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { dogProductsApi } from '../api/services';
import { ShoppingBag, Search, ShoppingCart, Star, Tag, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCart } from '../context/CartContext';

const Shop = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { addToCart, isInCart } = useCart();

    const { data: products, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: () => dogProductsApi.getAllProducts().then(res => res.data),
    });

    const filteredProducts = products?.filter(p =>
        p.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddToCart = (product) => {
        addToCart(product, 'product');
        toast.success(`Đã thêm ${product.itemName} vào giỏ hàng!`, {
            icon: '🐾',
            style: {
                borderRadius: '12px',
                background: '#000',
                color: '#fff',
                border: '3px solid #FFDE59',
                fontFamily: 'Lexend Mega, sans-serif',
                fontSize: '12px'
            },
        });
    };

    return (
        <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-20 bg-secondary brutal-border rounded-[3rem] p-12 shadow-brutal text-white relative overflow-hidden">
                <div className="relative z-10 w-full md:w-2/3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-black brutal-border rounded-lg mb-6 rotate-[-2deg] font-black text-xs uppercase shadow-brutal-sm">
                        <Tag className="w-4 h-4" />
                        <span>Flash Sale - 20% OFF</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-10 leading-[0.85]">PHỤ KIỆN <br /><span className="bg-primary text-black brutal-border px-4 shadow-brutal-sm inline-block rotate-[1deg]">CAO CẤP</span></h1>

                    <div className="relative max-w-md">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            className="brutal-input pl-14 pr-6 py-5 text-black"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="hidden lg:block">
                    <div className="relative">
                        <div className="w-72 h-72 bg-primary brutal-border rounded-full shadow-brutal flex items-center justify-center rotate-12">
                            <ShoppingBag className="w-40 h-40 text-black" strokeWidth={3} />
                        </div>
                        <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent brutal-border rounded-2xl flex items-center justify-center -rotate-12 shadow-brutal-sm">
                            <Star className="text-white fill-current w-10 h-10" />
                        </div>
                    </div>
                </div>

                {/* Abstract grid decoration */}
                <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 border-[40px] border-white/10 rounded-full"></div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-96 bg-white brutal-border rounded-[2rem] animate-pulse"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {filteredProducts?.map((product) => (
                        <div key={product.dogProductItemId} className="brutal-card group flex flex-col h-full hover:translate-x-[2px] hover:translate-y-[2px]">
                            <div className="h-64 bg-slate-50 brutal-border rounded-[1.5rem] mb-6 border-4 border-black overflow-hidden flex items-center justify-center relative shadow-brutal-sm group-hover:bg-accent/10 transition-colors">
                                {product.images?.[0] ? (
                                    <img
                                        src={product.images[0]}
                                        alt={product.itemName}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <ShoppingBag className="w-20 h-20 text-slate-200 group-hover:scale-125 group-hover:text-accent transition-all duration-500" />
                                )}
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <div className="bg-primary brutal-border p-2 rounded-xl shadow-brutal-sm">
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 px-2">
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">{product.category || "General"}</span>
                                <h3 className="font-black uppercase text-xl leading-tight mb-4 group-hover:text-accent transition-all line-clamp-2 italic">{product.itemName}</h3>
                                <div className="flex items-center gap-1 mb-8">
                                    {[1, 2, 3, 4].map(s => <Star key={s} className="w-4 h-4 fill-primary text-black" />)}
                                    <Star className="w-4 h-4 fill-slate-200 text-black" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t-[4px] border-black mt-auto">
                                <span className="text-2xl font-black tracking-tighter italic">{(product.price || 0).toLocaleString()}đ</span>
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="brutal-btn-primary p-4 rounded-xl"
                                >
                                    <ShoppingCart className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Shop;
