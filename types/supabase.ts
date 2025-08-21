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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: number
          sender_type: Database["public"]["Enums"]["tipo_remetente_chat"]
          user_id: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: never
          sender_type: Database["public"]["Enums"]["tipo_remetente_chat"]
          user_id?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: never
          sender_type?: Database["public"]["Enums"]["tipo_remetente_chat"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cooperados: {
        Row: {
          annual_revenue: number | null
          avatar_url: string | null
          company_name: string | null
          conversion_rate: number | null
          created_at: string
          email: string | null
          employee_count: number | null
          engagement_rate: number | null
          id: number
          name: string
          notes: string | null
          sector: string | null
          since: string | null
          tier: Database["public"]["Enums"]["tier_cooperado"] | null
          user_id: string
          value: number | null
        }
        Insert: {
          annual_revenue?: number | null
          avatar_url?: string | null
          company_name?: string | null
          conversion_rate?: number | null
          created_at?: string
          email?: string | null
          employee_count?: number | null
          engagement_rate?: number | null
          id?: never
          name: string
          notes?: string | null
          sector?: string | null
          since?: string | null
          tier?: Database["public"]["Enums"]["tier_cooperado"] | null
          user_id: string
          value?: number | null
        }
        Update: {
          annual_revenue?: number | null
          avatar_url?: string | null
          company_name?: string | null
          conversion_rate?: number | null
          created_at?: string
          email?: string | null
          employee_count?: number | null
          engagement_rate?: number | null
          id?: never
          name?: string
          notes?: string | null
          sector?: string | null
          since?: string | null
          tier?: Database["public"]["Enums"]["tier_cooperado"] | null
          user_id?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cooperados_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      interacoes: {
        Row: {
          author_id: string
          cooperado_id: number
          created_at: string
          date: string
          description: string | null
          id: number
          title: string
          type: Database["public"]["Enums"]["tipo_interacao"]
        }
        Insert: {
          author_id: string
          cooperado_id: number
          created_at?: string
          date: string
          description?: string | null
          id?: never
          title: string
          type: Database["public"]["Enums"]["tipo_interacao"]
        }
        Update: {
          author_id?: string
          cooperado_id?: number
          created_at?: string
          date?: string
          description?: string | null
          id?: never
          title?: string
          type?: Database["public"]["Enums"]["tipo_interacao"]
        }
        Relationships: [
          {
            foreignKeyName: "interacoes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interacoes_cooperado_id_fkey"
            columns: ["cooperado_id"]
            isOneToOne: false
            referencedRelation: "cooperados"
            referencedColumns: ["id"]
          },
        ]
      }
      oportunidades: {
        Row: {
          cooperado_id: number
          created_at: string
          description: string | null
          expected_close_date: string | null
          id: number
          stage: Database["public"]["Enums"]["estagio_oportunidade"]
          title: string
          user_id: string
          value: number | null
        }
        Insert: {
          cooperado_id: number
          created_at?: string
          description?: string | null
          expected_close_date?: string | null
          id?: never
          stage: Database["public"]["Enums"]["estagio_oportunidade"]
          title: string
          user_id: string
          value?: number | null
        }
        Update: {
          cooperado_id?: number
          created_at?: string
          description?: string | null
          expected_close_date?: string | null
          id?: never
          stage?: Database["public"]["Enums"]["estagio_oportunidade"]
          title?: string
          user_id?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "oportunidades_cooperado_id_fkey"
            columns: ["cooperado_id"]
            isOneToOne: false
            referencedRelation: "cooperados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oportunidades_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          active: boolean
          category: string | null
          created_at: string
          description: string | null
          id: number
          name: string
          price: number | null
          user_id: string
        }
        Insert: {
          active?: boolean
          category?: string | null
          created_at?: string
          description?: string | null
          id?: never
          name: string
          price?: number | null
          user_id: string
        }
        Update: {
          active?: boolean
          category?: string | null
          created_at?: string
          description?: string | null
          id?: never
          name?: string
          price?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "produtos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          role: string
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          role?: string
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
      tarefas: {
        Row: {
          completed: boolean
          cooperado_id: number | null
          created_at: string
          due_date: string | null
          id: number
          oportunidade_id: number | null
          priority: Database["public"]["Enums"]["prioridade_tarefa"] | null
          title: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          cooperado_id?: number | null
          created_at?: string
          due_date?: string | null
          id?: never
          oportunidade_id?: number | null
          priority?: Database["public"]["Enums"]["prioridade_tarefa"] | null
          title: string
          user_id: string
        }
        Update: {
          completed?: boolean
          cooperado_id?: number | null
          created_at?: string
          due_date?: string | null
          id?: never
          oportunidade_id?: number | null
          priority?: Database["public"]["Enums"]["prioridade_tarefa"] | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tarefas_cooperado_id_fkey"
            columns: ["cooperado_id"]
            isOneToOne: false
            referencedRelation: "cooperados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tarefas_oportunidade_id_fkey"
            columns: ["oportunidade_id"]
            isOneToOne: false
            referencedRelation: "oportunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tarefas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      estagio_oportunidade:
        | "Prospecção"
        | "Qualificação"
        | "Diagnóstico"
        | "Proposta"
        | "Negociação"
        | "Ganho"
        | "Perdido"
      prioridade_tarefa: "Baixa" | "Média" | "Alta"
      tier_cooperado: "Bronze" | "Prata" | "Ouro" | "Diamante"
      tipo_interacao:
        | "note"
        | "email"
        | "call"
        | "meeting"
        | "whatsapp"
        | "other"
      tipo_remetente_chat: "user" | "ai"
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
    Enums: {
      estagio_oportunidade: [
        "Prospecção",
        "Qualificação",
        "Diagnóstico",
        "Proposta",
        "Negociação",
        "Ganho",
        "Perdido",
      ],
      prioridade_tarefa: ["Baixa", "Média", "Alta"],
      tier_cooperado: ["Bronze", "Prata", "Ouro", "Diamante"],
      tipo_interacao: ["note", "email", "call", "meeting", "whatsapp", "other"],
      tipo_remetente_chat: ["user", "ai"],
    },
  },
} as const
