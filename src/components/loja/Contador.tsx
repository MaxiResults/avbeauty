import { useState, useEffect } from 'react';

// CONFIGURAÇÃO: Defina a data de término do Lote 1
const DATA_FIM_LOTE_1 = new Date('2025-11-12T23:59:59');

export function Contador() {
  const [tempo, setTempo] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
    encerrado: false,
  });

  useEffect(() => {
    const calcularTempo = () => {
      const agora = new Date();
      const diferenca = DATA_FIM_LOTE_1.getTime() - agora.getTime();

      if (diferenca <= 0) {
        setTempo({
          dias: 0,
          horas: 0,
          minutos: 0,
          segundos: 0,
          encerrado: true,
        });
        return;
      }

      const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

      setTempo({ dias, horas, minutos, segundos, encerrado: false });
    };

    calcularTempo();
    const timer = setInterval(calcularTempo, 1000);

    return () => clearInterval(timer);
  }, []);

  if (tempo.encerrado) {
    return (
      <section className="bg-[#181818] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#fdfdfd] font-display">
            🔴 Lote 1 Encerrado
          </h2>
        </div>
      </section>
    );
  }

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <section className="bg-[#181818] py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-8">
          <h2 className="text-2xl lg:text-3xl font-semibold text-[#ececec] font-subtitle">
            ⏰ TEMPO RESTANTE DO LOTE 1:
          </h2>

          <div className="flex justify-center items-center gap-4 lg:gap-8">
            {[
              { label: 'DIAS', value: tempo.dias },
              { label: 'HORAS', value: tempo.horas },
              { label: 'MIN', value: tempo.minutos },
              { label: 'SEG', value: tempo.segundos },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-[#64473b] rounded-xl shadow-2xl w-20 h-24 lg:w-32 lg:h-40 flex flex-col items-center justify-center transition-transform hover:scale-105"
              >
                <span className="text-3xl lg:text-6xl font-bold text-[#ececec] font-mono">
                  {formatNumber(item.value)}
                </span>
                <span className="text-xs lg:text-sm font-medium text-[#fdfdfd] uppercase tracking-wider mt-1">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <p className="text-base lg:text-lg text-[#704e3b] font-medium font-subtitle">
            Corre que o tempo tá acabando
          </p>
        </div>
      </div>
    </section>
  );
}
