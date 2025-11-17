export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      campanhas: {
        Row: {
          ativo: boolean
          campanha_status: string
          campanha_tipo: string | null
          canal_principal: string | null
          cliente_id: number
          created_at: string
          criado_por: string | null
          data_fim: string
          data_inicio: string
          descricao: string | null
          empresa_id: number
          id: number
          investimento_total: number | null
          nome_campanha: string
          plataforma_ads: string | null
          publico_alvo: string | null
          slug: string
          updated_at: string
          url_principal: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          ativo?: boolean
          campanha_status?: string
          campanha_tipo?: string | null
          canal_principal?: string | null
          cliente_id?: number
          created_at?: string
          criado_por?: string | null
          data_fim: string
          data_inicio: string
          descricao?: string | null
          empresa_id?: number
          id?: number
          investimento_total?: number | null
          nome_campanha: string
          plataforma_ads?: string | null
          publico_alvo?: string | null
          slug: string
          updated_at?: string
          url_principal: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          ativo?: boolean
          campanha_status?: string
          campanha_tipo?: string | null
          canal_principal?: string | null
          cliente_id?: number
          created_at?: string
          criado_por?: string | null
          data_fim?: string
          data_inicio?: string
          descricao?: string | null
          empresa_id?: number
          id?: number
          investimento_total?: number | null
          nome_campanha?: string
          plataforma_ads?: string | null
          publico_alvo?: string | null
          slug?: string
          updated_at?: string
          url_principal?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      Conversas_Historico: {
        Row: {
          cliente_id: number
          data_envio: string
          id: string
          mensagem: string
          origem: string | null
          remetente: string
          sessao_id: string
          tipo_mensagem: string | null
        }
        Insert: {
          cliente_id?: number
          data_envio?: string
          id?: string
          mensagem: string
          origem?: string | null
          remetente: string
          sessao_id: string
          tipo_mensagem?: string | null
        }
        Update: {
          cliente_id?: number
          data_envio?: string
          id?: string
          mensagem?: string
          origem?: string | null
          remetente?: string
          sessao_id?: string
          tipo_mensagem?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Conversas_Historico_sessao_id_fkey"
            columns: ["sessao_id"]
            isOneToOne: false
            referencedRelation: "Conversas_sessao"
            referencedColumns: ["id"]
          },
        ]
      }
      Conversas_sessao: {
        Row: {
          canal: string | null
          cliente_id: number
          created_at: string
          id: string
          lead_id: string
          origem: string | null
          thread_id: string | null
        }
        Insert: {
          canal?: string | null
          cliente_id?: number
          created_at?: string
          id?: string
          lead_id: string
          origem?: string | null
          thread_id?: string | null
        }
        Update: {
          canal?: string | null
          cliente_id?: number
          created_at?: string
          id?: string
          lead_id?: string
          origem?: string | null
          thread_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Conversas_sessao_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "Leads_Cadastro"
            referencedColumns: ["id"]
          },
        ]
      }
      Leads_Cadastro: {
        Row: {
          canal_origem: string | null
          cliente_id: number
          created_at: string
          email: string
          id: string
          interesse: string | null
          nome: string
          observacoes: string | null
          origem_url: string | null
          status: string | null
          telefone: string
        }
        Insert: {
          canal_origem?: string | null
          cliente_id?: number
          created_at?: string
          email: string
          id?: string
          interesse?: string | null
          nome: string
          observacoes?: string | null
          origem_url?: string | null
          status?: string | null
          telefone: string
        }
        Update: {
          canal_origem?: string | null
          cliente_id?: number
          created_at?: string
          email?: string
          id?: string
          interesse?: string | null
          nome?: string
          observacoes?: string | null
          origem_url?: string | null
          status?: string | null
          telefone?: string
        }
        Relationships: []
      }
      leads_cadastro_teaser: {
        Row: {
          campanha_id: number | null
          cliente_id: number
          created_at: string | null
          data_primeiro_acesso: string | null
          email: string
          empresa_id: number
          id: string
          ip_cadastro: string | null
          link_exclusivo: string
          nome: string
          numero_acessos: number | null
          status: string | null
          telefone: string
          updated_at: string | null
        }
        Insert: {
          campanha_id?: number | null
          cliente_id?: number
          created_at?: string | null
          data_primeiro_acesso?: string | null
          email: string
          empresa_id?: number
          id?: string
          ip_cadastro?: string | null
          link_exclusivo: string
          nome: string
          numero_acessos?: number | null
          status?: string | null
          telefone: string
          updated_at?: string | null
        }
        Update: {
          campanha_id?: number | null
          cliente_id?: number
          created_at?: string | null
          data_primeiro_acesso?: string | null
          email?: string
          empresa_id?: number
          id?: string
          ip_cadastro?: string | null
          link_exclusivo?: string
          nome?: string
          numero_acessos?: number | null
          status?: string | null
          telefone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      produtos: {
        Row: {
          categoria: string | null
          cliente_id: number
          controla_estoque: boolean | null
          created_at: string
          desconto_percentual: number | null
          descricao_completa: string | null
          descricao_curta: string | null
          empresa_id: number
          id: number
          imagem_galeria: string[] | null
          imagem_principal: string | null
          meta_description: string | null
          meta_title: string | null
          nome: string
          ordem_exibicao: number | null
          preco_padrao: number
          preco_promocional: number | null
          slug: string
          status: string
          updated_at: string
          vagas_disponiveis: number | null
          vagas_vendidas: number | null
        }
        Insert: {
          categoria?: string | null
          cliente_id?: number
          controla_estoque?: boolean | null
          created_at?: string
          desconto_percentual?: number | null
          descricao_completa?: string | null
          descricao_curta?: string | null
          empresa_id?: number
          id?: number
          imagem_galeria?: string[] | null
          imagem_principal?: string | null
          meta_description?: string | null
          meta_title?: string | null
          nome: string
          ordem_exibicao?: number | null
          preco_padrao?: number
          preco_promocional?: number | null
          slug: string
          status?: string
          updated_at?: string
          vagas_disponiveis?: number | null
          vagas_vendidas?: number | null
        }
        Update: {
          categoria?: string | null
          cliente_id?: number
          controla_estoque?: boolean | null
          created_at?: string
          desconto_percentual?: number | null
          descricao_completa?: string | null
          descricao_curta?: string | null
          empresa_id?: number
          id?: number
          imagem_galeria?: string[] | null
          imagem_principal?: string | null
          meta_description?: string | null
          meta_title?: string | null
          nome?: string
          ordem_exibicao?: number | null
          preco_padrao?: number
          preco_promocional?: number | null
          slug?: string
          status?: string
          updated_at?: string
          vagas_disponiveis?: number | null
          vagas_vendidas?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
