export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_credentials: {
        Row: {
          created_at: string | null
          id: string
          last_login: string | null
          password: string
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_login?: string | null
          password: string
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_login?: string | null
          password?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          article_format: string | null
          category: string
          content: string
          created_at: string | null
          date: string | null
          id: string
          published: boolean | null
          resource_name: string | null
          resource_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          article_format?: string | null
          category: string
          content: string
          created_at?: string | null
          date?: string | null
          id?: string
          published?: boolean | null
          resource_name?: string | null
          resource_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          article_format?: string | null
          category?: string
          content?: string
          created_at?: string | null
          date?: string | null
          id?: string
          published?: boolean | null
          resource_name?: string | null
          resource_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      blog_post_reactions: {
        Row: {
          blog_post_id: string
          created_at: string | null
          id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          blog_post_id: string
          created_at?: string | null
          id?: string
          reaction_type: string
          user_id: string
        }
        Update: {
          blog_post_id?: string
          created_at?: string | null
          id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_reactions_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author: string
          category: string
          color_scheme: string
          content_en: string
          content_ru: string
          created_at: string | null
          excerpt_en: string
          excerpt_ru: string
          featured: boolean | null
          id: string
          image_url: string | null
          published: boolean | null
          reading_time: string
          tags: string[] | null
          title_en: string
          title_ru: string
          updated_at: string | null
        }
        Insert: {
          author: string
          category: string
          color_scheme?: string
          content_en: string
          content_ru: string
          created_at?: string | null
          excerpt_en: string
          excerpt_ru: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          reading_time: string
          tags?: string[] | null
          title_en: string
          title_ru: string
          updated_at?: string | null
        }
        Update: {
          author?: string
          category?: string
          color_scheme?: string
          content_en?: string
          content_ru?: string
          created_at?: string | null
          excerpt_en?: string
          excerpt_ru?: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          reading_time?: string
          tags?: string[] | null
          title_en?: string
          title_ru?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_texts: {
        Row: {
          created_at: string | null
          id: string
          key: string
          section: string | null
          updated_at: string | null
          value_en: string
          value_ru: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          section?: string | null
          updated_at?: string | null
          value_en: string
          value_ru: string
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          section?: string | null
          updated_at?: string | null
          value_en?: string
          value_ru?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
