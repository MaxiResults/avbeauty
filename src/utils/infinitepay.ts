import { supabase } from '@/lib/supabase';

// Tipos
interface InfinitePayItem {
  name: string;
  price: number; // centavos (1000 = R$ 10,00)
  quantity: number;
}

interface InfinitePayLinkParams {
  items: InfinitePayItem[];
  orderNsu: string;
  redirectUrl: string;
  customerName?: string;
  customerEmail?: string;
  customerCellphone?: string;
  addressCep?: string;
  addressComplement?: string;
  addressNumber?: string;
}

interface PaymentCheckResponse {
  success: boolean;
  pedidoId?: string;
  pedidoCodigo?: string;
  message?: string;
}

// Gerar link de pagamento
export function gerarLinkInfinitePay(params: InfinitePayLinkParams): string {
  const handle = import.meta.env.VITE_INFINITEPAY_HANDLE;
  const baseUrl = `https://checkout.infinitepay.io/${handle}`;
  
  const itemsJson = JSON.stringify(params.items);
  
  const urlParams = new URLSearchParams({
    items: itemsJson,
    order_nsu: params.orderNsu,
    redirect_url: params.redirectUrl
  });
  
  if (params.customerName) urlParams.append('customer_name', params.customerName);
  if (params.customerEmail) urlParams.append('customer_email', params.customerEmail);
  if (params.customerCellphone) urlParams.append('customer_cellphone', params.customerCellphone);
  if (params.addressCep) urlParams.append('address_cep', params.addressCep);
  if (params.addressComplement) urlParams.append('address_complement', params.addressComplement);
  if (params.addressNumber) urlParams.append('address_number', params.addressNumber);
  
  return `${baseUrl}?${urlParams.toString()}`;
}

// Gerar order_nsu único
export function gerarOrderNsu(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
}

// Verificar pagamento via Edge Function
export async function verificarPagamentoInfinitePay(
  transactionId: string,
  orderNsu: string,
  slug: string,
  dadosCheckout: any
): Promise<PaymentCheckResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('verificar-pagamento-infinitepay', {
      body: {
        transactionNsu: transactionId,
        externalOrderNsu: orderNsu,
        slug,
        dadosCheckout,
      },
    });

    if (error) {
      throw new Error(error.message || 'Erro ao verificar pagamento');
    }

    return data as PaymentCheckResponse;
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Erro desconhecido' 
    };
  }
}

// Converter real para centavos
export function realParaCentavos(valor: number): number {
  return Math.round(valor * 100);
}

// Converter centavos para real
export function centavosParaReal(centavos: number): number {
  return centavos / 100;
}
