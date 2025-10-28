import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { validateImageFile } from '@/lib/uploadHelpers';

interface ImageUploadProps {
  value: string | File | null;
  onChange: (file: File | null) => void;
  onUrlChange?: (url: string) => void;
  label: string;
  required?: boolean;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, onUrlChange, label, required = false, disabled = false }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    typeof value === 'string' ? value : null
  );
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setIsUploading(true);

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Erro ao validar arquivo');
      setIsUploading(false);
      return;
    }

    // Criar preview local
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);

    onChange(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      await handleFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onChange(null);
    if (onUrlChange) onUrlChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {preview ? (
        <div className="relative group">
          <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Carregando...</p>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">
                Arraste e solte uma imagem aqui
              </p>
              <p className="text-xs text-muted-foreground mb-4">ou</p>
              <Button type="button" variant="outline" size="sm" disabled={disabled}>
                Selecionar Imagem
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Formatos: JPG, PNG, WEBP • Máximo: 2MB
              </p>
              <p className="text-xs text-muted-foreground">
                Dimensões recomendadas: 800x600px
              </p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileSelect}
            disabled={disabled}
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
