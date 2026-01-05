import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dogItemsApi } from '../api/services';
import { PawPrint, Filter, Search, Info, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pets = () => {
    const [selectedSpeciesId, setSelectedSpeciesId] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('All'); // 'All', 'Chó', 'Mèo'

    const { data: species } = useQuery({
        queryKey: ['species'],
        queryFn: () => dogItemsApi.getAllSpecies().then(res => res.data),
    });

    const { data: pets, isLoading } = useQuery({
        queryKey: ['pets', selectedSpeciesId],
        queryFn: () => {
            if (selectedSpeciesId === 'All') return dogItemsApi.getAllItems().then(res => res.data);
            return dogItemsApi.getItemsBySpecies(selectedSpeciesId).then(res => res.data);
        },
    });

    const filteredPets = pets?.filter(pet => {
        const matchesSearch = pet.dogName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pet.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'All' || pet.type === selectedType;
        return matchesSearch && matchesType;
    });

    const filteredSpecies = species?.filter(s => {
        if (selectedType === 'All') return true;
        // In this app, species 1-10 are dogs, 11-17 are cats based on seed
        if (selectedType === 'Chó') return s.dogSpeciesId <= 10;
        if (selectedType === 'Mèo') return s.dogSpeciesId >= 11 && s.dogSpeciesId <= 17;
        return true;
    });

    return (
        <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-20 bg-accent p-12 brutal-border rounded-[2.5rem] shadow-brutal text-white relative overflow-hidden">
                <div className="relative z-10 w-full lg:w-2/3">
                    <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-8 leading-[0.85]">BẠN ĐỒNG HÀNH <br /><span className="bg-white text-black brutal-border px-4 shadow-brutal-sm inline-block rotate-[-2deg]">MỚI</span></h1>

                    <div className="flex flex-wrap gap-4 mt-12 mb-8">
                        <div className="flex bg-white brutal-border p-1 rounded-2xl shadow-brutal-sm mr-4">
                            <button
                                onClick={() => { setSelectedType('All'); setSelectedSpeciesId('All'); }}
                                className={`px-6 py-2 font-black uppercase text-xs rounded-xl transition-all ${selectedType === 'All' ? 'bg-black text-white' : 'text-black hover:bg-slate-100'}`}
                            >
                                Tất cả
                            </button>
                            <button
                                onClick={() => { setSelectedType('Chó'); setSelectedSpeciesId('All'); }}
                                className={`px-6 py-2 font-black uppercase text-xs rounded-xl transition-all ${selectedType === 'Chó' ? 'bg-primary text-black' : 'text-black hover:bg-slate-100'}`}
                            >
                                Chó 🐶
                            </button>
                            <button
                                onClick={() => { setSelectedType('Mèo'); setSelectedSpeciesId('All'); }}
                                className={`px-6 py-2 font-black uppercase text-xs rounded-xl transition-all ${selectedType === 'Mèo' ? 'bg-secondary text-white' : 'text-black hover:bg-slate-100'}`}
                            >
                                Mèo 🐱
                            </button>
                        </div>

                        <div className="h-10 w-[2px] bg-white/20 self-center hidden md:block"></div>

                        <button
                            onClick={() => setSelectedSpeciesId('All')}
                            className={`px-6 py-3 font-black uppercase text-sm rounded-xl brutal-border shadow-brutal-sm transition-all active:shadow-none active:translate-x-1 active:translate-y-1 ${selectedSpeciesId === 'All' ? 'bg-primary text-black' : 'bg-white text-black hover:bg-slate-50'}`}
                        >
                            Tất cả giống
                        </button>
                        {filteredSpecies?.map(s => (
                            <button
                                key={s.dogSpeciesId}
                                onClick={() => setSelectedSpeciesId(s.dogSpeciesId)}
                                className={`px-6 py-3 font-black uppercase text-sm rounded-xl brutal-border shadow-brutal-sm transition-all active:shadow-none active:translate-x-1 active:translate-y-1 ${selectedSpeciesId === s.dogSpeciesId ? 'bg-primary text-black' : 'bg-white text-black hover:bg-slate-50'}`}
                            >
                                {s.dogSpeciesName}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative w-full lg:w-96 mb-2">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm bé cưng..."
                        className="brutal-input pl-14 pr-6 py-5 text-black"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Decoration */}
                <PawPrint className="absolute right-[-20px] top-[-20px] w-64 h-64 text-white/10 -rotate-12" fill="currentColor" />
            </div>

            {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-96 bg-white brutal-border rounded-[2rem] animate-pulse"></div>)}
                </div>
            ) : filteredPets?.length === 0 ? (
                <div className="text-center py-32 bg-white brutal-border rounded-[2rem] shadow-brutal">
                    <Info className="w-20 h-20 mx-auto mb-6 text-accent" />
                    <p className="font-black uppercase text-3xl italic tracking-tight">Không tìm thấy bé cưng nào!</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {filteredPets?.map((pet) => (
                        <div key={pet.dogItemId} className="brutal-card group hover:translate-x-[4px] hover:translate-y-[4px]">
                            <div className="h-72 bg-slate-50 brutal-border rounded-[1.5rem] mb-8 flex items-center justify-center relative overflow-hidden group-hover:bg-primary/10 transition-colors shadow-brutal-sm">
                                <div className="absolute top-4 right-4 z-10">
                                    <div className="brutal-badge bg-white flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-primary text-black" />
                                        <span>{pet.dogSpeciesName}</span>
                                    </div>
                                </div>
                                <div className="absolute bottom-4 left-4 z-10">
                                    <div className="brutal-badge bg-black text-white px-4">{pet.sex === "Đực" ? "♂ GENTLE" : "♀ LADY"}</div>
                                </div>
                                {pet.images?.[0] ? (
                                    <img
                                        src={pet.images[0]}
                                        alt={pet.dogName}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <PawPrint className="w-24 h-24 text-black/5 group-hover:scale-125 transition-transform duration-700" fill="currentColor" />
                                )}
                            </div>

                            <h3 className="text-3xl font-black uppercase mb-4 tracking-tight group-hover:italic transition-all">{pet.dogName}</h3>
                            <p className="text-slate-600 font-bold text-base mb-8 line-clamp-2 leading-relaxed italic border-l-4 border-primary pl-4">{pet.description}</p>

                            <div className="flex items-center justify-between pt-8 border-t-[4px] border-black mt-auto">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Chi phí đón bé</span>
                                    <span className="text-3xl font-black text-black italic">{(pet.price || 0).toLocaleString()}đ</span>
                                </div>
                                <Link to={`/pets/detail/${pet.dogItemId}`} className="brutal-btn-primary p-5 rounded-2xl">
                                    <ArrowRight className="w-8 h-8" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Pets;
