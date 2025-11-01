export const buscarCEP = async (cep: string) => {
  try {
    const limpo = cep.replace(/\D/g, '');
    if (limpo.length !== 8) return { error: 'CEP inválido' };
    
    const res = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
    const data = await res.json();
    
    if (data.erro) return { error: 'CEP não encontrado' };
    
    return {
      success: true,
      cep: limpo.replace(/(\d{5})(\d{3})/, '$1-$2'),
      logradouro: data.logradouro || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      estado: data.uf || ''
    };
  } catch {
    return { error: 'Erro ao buscar CEP' };
  }
};

export const formatarCEP = (cep: string) => {
  const limpo = cep.replace(/\D/g, '');
  return limpo.length === 8 ? limpo.replace(/(\d{5})(\d{3})/, '$1-$2') : cep;
};

export const estadosBrasil = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'
];
