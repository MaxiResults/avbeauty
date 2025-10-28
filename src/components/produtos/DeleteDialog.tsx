import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  produtoNome: string;
}

export function DeleteDialog({ open, onOpenChange, onConfirm, produtoNome }: DeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <span className="text-2xl">⚠️</span> Excluir Produto?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Tem certeza que deseja excluir <strong>"{produtoNome}"</strong>?
            </p>
            <p className="text-amber-600 dark:text-amber-500">
              ⚠️ Atenção: Se houver pedidos vinculados, o produto será apenas desativado, não deletado.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Sim, Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
