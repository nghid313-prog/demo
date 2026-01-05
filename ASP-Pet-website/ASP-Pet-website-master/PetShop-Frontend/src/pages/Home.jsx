import { useQuery } from '@tanstack/react-query';
import { dogItemsApi, dogProductsApi } from '../api/services';
import { PawPrint, ShoppingBag, ArrowRight, Heart, Star, Zap, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const { data: species, isLoading: loadingSpecies } = useQuery({
        queryKey: ['species'],
        queryFn: () => dogItemsApi.getAllSpecies().then(res => res.data),
    });

    const { data: products, isLoading: loadingProducts } = useQuery({
        queryKey: ['featured-products'],
        queryFn: () => dogProductsApi.getAllProducts().then(res => (Array.isArray(res.data) ? res.data.slice(0, 8) : [])),
    });

    return (
        <div className="pt-32 pb-20 overflow-hidden">
            {/* Hero Section */}
            <section className="px-6 max-w-7xl mx-auto mb-32">
                <div className="bg-primary brutal-border rounded-[2.5rem] p-12 md:p-24 shadow-brutal relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white font-black rounded-lg mb-8 rotate-[-1deg] uppercase text-xs shadow-brutal-sm">
                            <Zap className="w-4 h-4 text-primary" fill="currentColor" />
                            <span>Chào mừng tới Paws & Co.</span>
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black leading-[0.85] uppercase tracking-tighter mb-10 italic">
                            THIÊN ĐƯỜNG <br /> CỦA <span className="bg-white brutal-border px-4 shadow-brutal-sm inline-block rotate-[2deg]">THÚ CƯNG</span>
                        </h1>
                        <p className="text-xl md:text-2xl font-bold text-black mb-12 max-w-lg leading-tight uppercase">
                            Bộ sưu tập thú cưng và phụ kiện đẳng cấp nhất cho thành viên bốn chân của gia đình bạn.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link to="/shop" className="brutal-btn-accent text-xl py-5 px-10">MUA SẮM NGAY <ArrowRight /></Link>
                            <Link to="/pets" className="brutal-btn-secondary text-xl py-5 px-10">TÌM THÚ CƯNG</Link>
                        </div>
                    </div>

                    {/* Abstract shapes for neubrutalism feel */}
                    <div className="absolute top-[-50px] right-[-50px] w-96 h-96 bg-white brutal-border rounded-full opacity-50 -rotate-12 hidden lg:block"></div>
                    <div className="absolute bottom-10 right-20 hidden lg:block group">
                        <div className="relative">
                            <div className="w-80 h-80 bg-accent brutal-border rounded-3xl shadow-brutal group-hover:scale-105 transition-transform"></div>
                            <PawPrint className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 text-white rotate-12" fill="currentColor" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Scrolling Marquee */}
            <div className="bg-black py-4 border-y-4 border-black mb-32 rotate-[-1deg] scale-105">
                <div className="marquee">
                    <div className="marquee-content gap-20">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex items-center gap-6 text-white font-black uppercase text-2xl italic tracking-widest whitespace-nowrap">
                                <span>Free Shipping</span>
                                <Star className="text-primary fill-current w-6 h-6" />
                                <span>Premium Pets</span>
                                <Star className="text-secondary fill-current w-6 h-6" />
                                <span>Best Quality</span>
                                <Star className="text-accent fill-current w-6 h-6" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Featured Species */}
            <section className="px-6 max-w-7xl mx-auto mb-32">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
                    <div>
                        <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">Bé Cưng <span className="text-secondary">Phổ Biến</span></h2>
                        <div className="h-4 w-64 bg-secondary mt-[-10px] ml-[-10px] opacity-30"></div>
                    </div>
                    <Link to="/pets" className="brutal-btn-secondary py-2 text-xs">
                        XEM TẤT CẢ <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                    {loadingSpecies ? (
                        [1, 2, 3, 4].map(i => <div key={i} className="h-64 w-48 bg-slate-100 brutal-border rounded-3xl animate-pulse"></div>)
                    ) : (
                        species?.map((item) => (
                            <Link key={item.dogSpeciesId} to={`/pets`} className="group">
                                <div className="brutal-card flex flex-col items-center bg-white group-hover:bg-primary transition-colors w-48 h-48 justify-center">
                                    <div className="w-20 h-20 bg-white brutal-border rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform shadow-brutal-sm">
                                        <PawPrint className="w-10 h-10 text-black" />
                                    </div>
                                    <h3 className="font-black uppercase text-sm text-center group-hover:italic transition-all px-2 leading-tight">{item.dogSpeciesName}</h3>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </section>

            {/* Trust Badges */}
            <section className="px-6 max-w-7xl mx-auto mb-32">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="brutal-card bg-accent text-white flex items-start gap-6">
                        <Truck className="w-12 h-12 shrink-0" />
                        <div>
                            <h4 className="font-black uppercase text-xl mb-2">Giao hàng nhanh</h4>
                            <p className="font-bold text-blue-100 opacity-90">Vận chuyển an toàn, chuyên nghiệp đến tận tay khách hàng.</p>
                        </div>
                    </div>
                    <div className="brutal-card bg-secondary text-white flex items-start gap-6">
                        <ShieldCheck className="w-12 h-12 shrink-0" />
                        <div>
                            <h4 className="font-black uppercase text-xl mb-2">Bảo hành sức khỏe</h4>
                            <p className="font-bold text-red-100 opacity-90">Cam kết sức khỏe và nguồn gốc rõ ràng cho từng bé thú cưng.</p>
                        </div>
                    </div>
                    <div className="brutal-card bg-primary text-black flex items-start gap-6">
                        <Star className="w-12 h-12 shrink-0 fill-current" />
                        <div>
                            <h4 className="font-black uppercase text-xl mb-2">Dịch vụ 5 sao</h4>
                            <p className="font-bold text-black/60">Đội ngũ chuyên gia tư vấn chăm sóc trọn đời cho thú cưng của bạn.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="bg-black py-40 border-y-[8px] border-black relative mb-32">
                <div className="absolute top-20 right-[-100px] rotate-[-24deg] opacity-10">
                    <ShoppingBag className="w-[500px] h-[500px] text-white" />
                </div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-6 mb-20 px-10 py-4 bg-primary brutal-border inline-block rotate-[-2deg] shadow-brutal">
                        <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-black">SẢN PHẨM <span className="bg-white px-4 border-2 border-black shadow-brutal-sm">KHUYÊN DÙNG</span></h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {loadingProducts ? (
                            [1, 2, 3, 4].map(i => <div key={i} className="h-96 bg-slate-800 brutal-border rounded-3xl animate-pulse"></div>)
                        ) : (
                            products?.map((product) => (
                                <div key={product.dogProductItemId} className="brutal-card group bg-white flex flex-col h-full">
                                    <div className="h-56 bg-white brutal-border rounded-xl mb-6 flex items-center justify-center overflow-hidden relative shadow-brutal-sm">
                                        <div className="absolute top-3 left-3 z-10">
                                            <div className="brutal-badge bg-primary">NEW</div>
                                        </div>
                                        {product.images?.[0] ? (
                                            <img
                                                src={product.images[0]}
                                                alt={product.itemName}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <ShoppingBag className="w-20 h-20 text-slate-300 group-hover:scale-125 transition-transform duration-500" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-black uppercase text-xl leading-tight mb-4 group-hover:text-secondary group-hover:italic transition-all">{product.itemName}</h3>
                                        <div className="flex items-center gap-1 mb-6">
                                            {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-primary text-black" />)}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-2xl font-black italic tracking-tighter">{(product.price || 0).toLocaleString()}đ</span>
                                        <button className="p-4 bg-primary brutal-border rounded-xl hover:bg-black hover:text-white transition-all shadow-brutal-sm active:translate-x-1 active:translate-y-1 active:shadow-none">
                                            <ShoppingBag className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Footer-ish Quote */}
            <section className="px-6 max-w-5xl mx-auto text-center py-20 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 bg-primary/20 w-80 h-80 rounded-full blur-[100px]"></div>
                <Heart className="w-24 h-24 text-secondary mx-auto mb-12 animate-pulse" fill="currentColor" />
                <h2 className="text-5xl md:text-8xl font-black uppercase leading-[0.9] italic tracking-tighter mb-10">
                    "THÚ CƯNG KHÔNG CHỈ LÀ VẬT NUÔI, HỌ LÀ <span className="bg-primary px-6 border-4 border-black inline-block rotate-[-3deg] shadow-brutal mx-2">GIA ĐÌNH</span>"
                </h2>
                <div className="flex items-center justify-center gap-4 font-black uppercase text-2xl mb-20 underline decoration-primary decoration-[8px] underline-offset-8">
                    <span>PAWS & CO. TEAM</span>
                    <Star className="w-8 h-8 fill-primary" />
                    <span>SINCE 2024</span>
                </div>
            </section>
        </div>
    );
};

export default Home;
