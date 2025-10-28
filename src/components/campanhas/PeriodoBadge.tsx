import { Badge } from '@/components/ui/badge';

interface PeriodoBadgeProps {
  dataInicio: string;
  dataFim: string;
}

export function PeriodoBadge({ dataInicio, dataFim }: PeriodoBadgeProps) {
  const now = new Date();
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);

  let badge = null;
  
  if (now < inicio) {
    badge = (
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
        Em breve
      </Badge>
    );
  } else if (now > fim) {
    badge = (
      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
        Encerrada
      </Badge>
    );
  } else {
    badge = (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
        Ativa agora
      </Badge>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm">
        {new Date(dataInicio).toLocaleDateString('pt-BR')} - {new Date(dataFim).toLocaleDateString('pt-BR')}
      </span>
      {badge}
    </div>
  );
}
