interface CategoryFilterProps {
  categoriaAtiva: string;
  onCategoriaChange: (categoria: string) => void;
}

export function CategoryFilter({ categoriaAtiva, onCategoriaChange }: CategoryFilterProps) {
  const categorias = [
    { id: 'todos', label: 'Todos' },
    { id: 'Procedimentos', label: 'Procedimentos' },
    { id: 'Produtos Físicos', label: 'Produtos Físicos' },
  ];

  return (
    <div className="flex justify-center gap-3 flex-wrap">
      {categorias.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoriaChange(cat.id)}
          className={`px-6 py-2.5 rounded-full border-2 font-medium transition-all duration-200 font-subtitle
            ${categoriaAtiva === cat.id 
              ? 'bg-[#64473b] text-[#fdfdfd] border-[#64473b]' 
              : 'bg-transparent text-[#64473b] border-[#64473b]/50 hover:border-[#64473b] hover:bg-[#64473b]/10'
            }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
