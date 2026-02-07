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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      keys: {
        Row: {
          bg_class: string
          border_class: string
          color_class: string
          created_at: string
          desc_ar: string
          desc_en: string
          id: string
          is_active: boolean
          key: string
          name_ar: string
          name_en: string
          price: number
          rarity_ar: string
          rarity_en: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          bg_class: string
          border_class: string
          color_class: string
          created_at?: string
          desc_ar: string
          desc_en: string
          id?: string
          is_active?: boolean
          key: string
          name_ar: string
          name_en: string
          price: number
          rarity_ar: string
          rarity_en: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          bg_class?: string
          border_class?: string
          color_class?: string
          created_at?: string
          desc_ar?: string
          desc_en?: string
          id?: string
          is_active?: boolean
          key?: string
          name_ar?: string
          name_en?: string
          price?: number
          rarity_ar?: string
          rarity_en?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      mods: {
        Row: {
          created_at: string
          description_ar: string | null
          description_en: string | null
          download_url: string
          id: string
          image_url: string | null
          is_active: boolean
          minecraft_version: string | null
          name_ar: string
          name_en: string
          sort_order: number
          updated_at: string
          version: string | null
        }
        Insert: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          download_url: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          minecraft_version?: string | null
          name_ar: string
          name_en: string
          sort_order?: number
          updated_at?: string
          version?: string | null
        }
        Update: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          download_url?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          minecraft_version?: string | null
          name_ar?: string
          name_en?: string
          sort_order?: number
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          quantity?: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "store_products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_email: string
          buyer_id: string | null
          buyer_minecraft_username: string | null
          created_at: string
          currency: string
          id: string
          status: string
          store_id: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          buyer_email: string
          buyer_id?: string | null
          buyer_minecraft_username?: string | null
          created_at?: string
          currency?: string
          id?: string
          status?: string
          store_id: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          buyer_email?: string
          buyer_id?: string | null
          buyer_minecraft_username?: string | null
          created_at?: string
          currency?: string
          id?: string
          status?: string
          store_id?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          minecraft_username: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          minecraft_username?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          minecraft_username?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ranks: {
        Row: {
          bg_class: string
          border_class: string
          color_class: string
          created_at: string
          desc_ar: string
          desc_en: string
          icon: string
          id: string
          is_active: boolean
          key: string
          name_ar: string
          name_en: string
          price: number
          reward_ar: string
          reward_en: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          bg_class: string
          border_class: string
          color_class: string
          created_at?: string
          desc_ar: string
          desc_en: string
          icon?: string
          id?: string
          is_active?: boolean
          key: string
          name_ar: string
          name_en: string
          price: number
          reward_ar: string
          reward_en: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          bg_class?: string
          border_class?: string
          color_class?: string
          created_at?: string
          desc_ar?: string
          desc_en?: string
          icon?: string
          id?: string
          is_active?: boolean
          key?: string
          name_ar?: string
          name_en?: string
          price?: number
          reward_ar?: string
          reward_en?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      seller_applications: {
        Row: {
          admin_notes: string | null
          created_at: string
          discord_url: string | null
          id: string
          reason: string
          server_ip: string
          server_name: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          discord_url?: string | null
          id?: string
          reason: string
          server_ip: string
          server_name: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          discord_url?: string | null
          id?: string
          reason?: string
          server_ip?: string
          server_name?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      store_categories: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name_ar: string
          name_en: string
          sort_order: number
          store_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name_ar: string
          name_en: string
          sort_order?: number
          store_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name_ar?: string
          name_en?: string
          sort_order?: number
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_categories_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      store_products: {
        Row: {
          bg_class: string
          border_class: string
          category_id: string | null
          color_class: string
          commands: string[] | null
          created_at: string
          desc_ar: string
          desc_en: string
          icon: string | null
          id: string
          is_active: boolean
          name_ar: string
          name_en: string
          price: number
          product_type: string
          sort_order: number
          store_id: string
          stripe_price_id: string | null
          updated_at: string
        }
        Insert: {
          bg_class?: string
          border_class?: string
          category_id?: string | null
          color_class?: string
          commands?: string[] | null
          created_at?: string
          desc_ar: string
          desc_en: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name_ar: string
          name_en: string
          price: number
          product_type: string
          sort_order?: number
          store_id: string
          stripe_price_id?: string | null
          updated_at?: string
        }
        Update: {
          bg_class?: string
          border_class?: string
          category_id?: string | null
          color_class?: string
          commands?: string[] | null
          created_at?: string
          desc_ar?: string
          desc_en?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name_ar?: string
          name_en?: string
          price?: number
          product_type?: string
          sort_order?: number
          store_id?: string
          stripe_price_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "store_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          api_key: string | null
          created_at: string
          description: string | null
          discord_url: string | null
          id: string
          is_featured: boolean
          logo_url: string | null
          name: string
          owner_id: string
          server_ip: string | null
          slug: string
          status: Database["public"]["Enums"]["store_status"]
          theme: Database["public"]["Enums"]["store_theme"]
          updated_at: string
        }
        Insert: {
          api_key?: string | null
          created_at?: string
          description?: string | null
          discord_url?: string | null
          id?: string
          is_featured?: boolean
          logo_url?: string | null
          name: string
          owner_id: string
          server_ip?: string | null
          slug: string
          status?: Database["public"]["Enums"]["store_status"]
          theme?: Database["public"]["Enums"]["store_theme"]
          updated_at?: string
        }
        Update: {
          api_key?: string | null
          created_at?: string
          description?: string | null
          discord_url?: string | null
          id?: string
          is_featured?: boolean
          logo_url?: string | null
          name?: string
          owner_id?: string
          server_ip?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["store_status"]
          theme?: Database["public"]["Enums"]["store_theme"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_own_profile: { Args: { profile_user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "seller"
      store_status: "pending" | "approved" | "suspended"
      store_theme:
        | "minecraft_classic"
        | "nether_dark"
        | "end_purple"
        | "ocean_blue"
        | "forest_green"
        | "desert_gold"
        | "ice_frost"
        | "redstone_red"
        | "diamond_cyan"
        | "emerald_green"
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
      app_role: ["admin", "moderator", "user", "seller"],
      store_status: ["pending", "approved", "suspended"],
      store_theme: [
        "minecraft_classic",
        "nether_dark",
        "end_purple",
        "ocean_blue",
        "forest_green",
        "desert_gold",
        "ice_frost",
        "redstone_red",
        "diamond_cyan",
        "emerald_green",
      ],
    },
  },
} as const
