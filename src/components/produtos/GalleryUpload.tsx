import { useState, useRef } from 'react';
import { Plus, X, Loader2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { validateImageFile } from '@/lib/uploadHelpers';

interface GalleryUploadProps {
  value: (string | File)[];
  onChange: (files: (string | File)[]) => void;
  disabled?: boolean;
  maxImages?: number;
}

export function GalleryUpload({ value, onChange, disabled = false, maxImages = 6 }: GalleryUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (value.length >= maxImages) {
      setError(`Máximo de ${maxImages} imagens permitidas`);
      return;
    }

    setError(null);
    setIsUploading(true);

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Erro ao validar arquivo');
      setIsUploading(false);
      return;
    }

    onChange([...value, file]);
    setIsUploading(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    
    for (const file of imageFiles.slice(0, maxImages - value.length)) {
      await handleFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      for (const file of fileArray.slice(0, maxImages - value.length)) {
        await handleFile(file);
      }
    }
  };

  const handleRemove = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const getPreviewUrl = (item: string | File): string => {
    if (typeof item === 'string') return item;
    return URL.createObjectURL(item);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">
          Galeria de Imagens (opcional)
        </label>
        <p className="text-xs text-muted-foreground mt-1">
          Máximo {maxImages} imagens
        </p>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {value.map((item, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                  src={getPreviewUrl(item)}
                  alt={`Galeria ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {!disabled && (
                <>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemove(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="absolute top-2 left-2 h-8 w-8 bg-background/80 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
                    <GripVertical className="w-4 h-4" />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {value.length < maxImages && !disabled && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Adicionando...</p>
            </div>
          ) : (
            <>
              <Plus className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Adicionar Imagem</p>
              <p className="text-xs text-muted-foreground mt-1">
                {value.length} / {maxImages} imagens
              </p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {value.length > 1 && (
        <p className="text-xs text-muted-foreground">
          💡 Arraste para reordenar as imagens (em breve)
        </p>
      )}
    </div>
  );
}
