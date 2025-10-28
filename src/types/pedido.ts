export interface PedidoDB {
  id: string;
  codigo: string;
  cliente_id: number;
  empresa_id: number;
  contato_id?: number;
  campanha_id?: number;
  lead_id?: string;
  lead_nome: string;
  lead_telefone: string;
  lead_cpf?: string;
  lead_email: string;
  forma_pagto: string;
  numero_parcelas?: number;
  valor: number;
  desconto: number;
  valor_total: number;
  payment_id?: string;
  payment_gateway?: string;
  status_pagamento: string;
  link_pagamento?: string;
  status_pedido: string;
  status_envio?: string;
  created_at: string;
  updated_at: string;
}

export interface Pedido {
  ID: string;
  Codigo: string;
  Cliente_ID: number;
  Empresa_ID: number;
  Contato_ID?: number;
  Campanha_ID?: number;
  Lead_ID?: string;
  Lead_Nome: string;
  Lead_Telefone: string;
  Lead_CPF?: string;
  Lead_Email: string;
  Forma_Pagto: string;
  Numero_Parcelas?: number;
  Valor: number;
  Desconto: number;
  Valor_Total: number;
  Payment_ID?: string;
  Payment_Gateway?: string;
  Status_Pagamento: string;
  Link_Pagamento?: string;
  Status_Pedido: string;
  Status_Envio?: string;
  Created_at: string;
  Updated_at: string;
  Campanha_Nome?: string;
  Produtos?: string;
}

export interface PedidoItem {
  ID: string;
  Pedido_ID: number;
  Produto_ID: number;
  Produto_Nome: string;
  Quantidade: number;
  Preco_Unitario: number;
  Preco_Total: number;
  Imagem_Produto?: string;
}

export const dbToPedido = (db: PedidoDB): Pedido => ({
  ID: db.id,
  Codigo: db.codigo,
  Cliente_ID: db.cliente_id,
  Empresa_ID: db.empresa_id,
  Contato_ID: db.contato_id,
  Campanha_ID: db.campanha_id,
  Lead_ID: db.lead_id,
  Lead_Nome: db.lead_nome,
  Lead_Telefone: db.lead_telefone,
  Lead_CPF: db.lead_cpf,
  Lead_Email: db.lead_email,
  Forma_Pagto: db.forma_pagto,
  Numero_Parcelas: db.numero_parcelas,
  Valor: db.valor,
  Desconto: db.desconto,
  Valor_Total: db.valor_total,
  Payment_ID: db.payment_id,
  Payment_Gateway: db.payment_gateway,
  Status_Pagamento: db.status_pagamento,
  Link_Pagamento: db.link_pagamento,
  Status_Pedido: db.status_pedido,
  Status_Envio: db.status_envio,
  Created_at: db.created_at,
  Updated_at: db.updated_at,
});
