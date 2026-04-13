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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      care_contacts: {
        Row: {
          available_time: string | null
          contact: string | null
          created_at: string
          department: string | null
          hospital: string | null
          id: string
          name: string
          notes: string | null
          role: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          available_time?: string | null
          contact?: string | null
          created_at?: string
          department?: string | null
          hospital?: string | null
          id?: string
          name: string
          notes?: string | null
          role: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          available_time?: string | null
          contact?: string | null
          created_at?: string
          department?: string | null
          hospital?: string | null
          id?: string
          name?: string
          notes?: string | null
          role?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      clinical_visits: {
        Row: {
          created_at: string
          department: string | null
          doctor_name: string | null
          hospital: string | null
          id: string
          notes: string | null
          symptom_summary: string | null
          updated_at: string
          user_id: string
          visit_date: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          doctor_name?: string | null
          hospital?: string | null
          id?: string
          notes?: string | null
          symptom_summary?: string | null
          updated_at?: string
          user_id: string
          visit_date: string
        }
        Update: {
          created_at?: string
          department?: string | null
          doctor_name?: string | null
          hospital?: string | null
          id?: string
          notes?: string | null
          symptom_summary?: string | null
          updated_at?: string
          user_id?: string
          visit_date?: string
        }
        Relationships: []
      }
      medication_logs: {
        Row: {
          actual_time: string | null
          id: string
          late_by: string | null
          logged_at: string
          medication_id: string | null
          scheduled_time: string
          status: string
          user_id: string
        }
        Insert: {
          actual_time?: string | null
          id?: string
          late_by?: string | null
          logged_at?: string
          medication_id?: string | null
          scheduled_time: string
          status: string
          user_id: string
        }
        Update: {
          actual_time?: string | null
          id?: string
          late_by?: string | null
          logged_at?: string
          medication_id?: string | null
          scheduled_time?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_logs_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          created_at: string
          dose: string
          id: string
          instruction_key: string | null
          label: string
          name: string
          stock_days: number | null
          stock_remaining: number | null
          stock_unit: string | null
          strength: string | null
          times: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dose: string
          id?: string
          instruction_key?: string | null
          label: string
          name: string
          stock_days?: number | null
          stock_remaining?: number | null
          stock_unit?: string | null
          strength?: string | null
          times?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dose?: string
          id?: string
          instruction_key?: string | null
          label?: string
          name?: string
          stock_days?: number | null
          stock_remaining?: number | null
          stock_unit?: string | null
          strength?: string | null
          times?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          diagnosis_time: string | null
          display_name: string | null
          emergency_contact: string | null
          fall_history: string | null
          id: string
          main_symptoms: string | null
          primary_doctor: string | null
          role: string | null
          swallowing_difficulty: string | null
          updated_at: string
          user_id: string
          wearable_device: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          diagnosis_time?: string | null
          display_name?: string | null
          emergency_contact?: string | null
          fall_history?: string | null
          id?: string
          main_symptoms?: string | null
          primary_doctor?: string | null
          role?: string | null
          swallowing_difficulty?: string | null
          updated_at?: string
          user_id: string
          wearable_device?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          diagnosis_time?: string | null
          display_name?: string | null
          emergency_contact?: string | null
          fall_history?: string | null
          id?: string
          main_symptoms?: string | null
          primary_doctor?: string | null
          role?: string | null
          swallowing_difficulty?: string | null
          updated_at?: string
          user_id?: string
          wearable_device?: string | null
        }
        Relationships: []
      }
      symptoms: {
        Row: {
          id: string
          logged_at: string
          note: string | null
          severity: string
          shared_to: string[] | null
          symptom: string
          time: string | null
          user_id: string
        }
        Insert: {
          id?: string
          logged_at?: string
          note?: string | null
          severity: string
          shared_to?: string[] | null
          symptom: string
          time?: string | null
          user_id: string
        }
        Update: {
          id?: string
          logged_at?: string
          note?: string | null
          severity?: string
          shared_to?: string[] | null
          symptom?: string
          time?: string | null
          user_id?: string
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
