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
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      City: {
        Row: {
          createdAt: string
          id: number
          latitude: number
          longitude: number
          name: string
          state: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id?: number
          latitude: number
          longitude: number
          name: string
          state: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          id?: number
          latitude?: number
          longitude?: number
          name?: string
          state?: string
          updatedAt?: string
        }
        Relationships: []
      }
      LogRequest: {
        Row: {
          createdAt: string
          id: number
          priceCollectionId: number
          userId: string
        }
        Insert: {
          createdAt?: string
          id?: number
          priceCollectionId: number
          userId: string
        }
        Update: {
          createdAt?: string
          id?: number
          priceCollectionId?: number
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "LogRequest_priceCollectionId_fkey"
            columns: ["priceCollectionId"]
            isOneToOne: false
            referencedRelation: "PriceCollection"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "LogRequest_priceCollectionId_fkey"
            columns: ["priceCollectionId"]
            isOneToOne: false
            referencedRelation: "view_pricecollection"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "LogRequest_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      PriceCollection: {
        Row: {
          createdAt: string
          description: string | null
          id: number
          name: string
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          id?: number
          name: string
          updatedAt: string
          userId: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          id?: number
          name?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "PriceCollection_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      PriceCollectionCity: {
        Row: {
          cityId: number
          createdAt: string
          id: number
          priceCollectionId: number
          updatedAt: string
        }
        Insert: {
          cityId: number
          createdAt?: string
          id?: number
          priceCollectionId: number
          updatedAt: string
        }
        Update: {
          cityId?: number
          createdAt?: string
          id?: number
          priceCollectionId?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "PriceCollectionCity_cityId_fkey"
            columns: ["cityId"]
            isOneToOne: false
            referencedRelation: "City"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "PriceCollectionCity_priceCollectionId_fkey"
            columns: ["priceCollectionId"]
            isOneToOne: false
            referencedRelation: "PriceCollection"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "PriceCollectionCity_priceCollectionId_fkey"
            columns: ["priceCollectionId"]
            isOneToOne: false
            referencedRelation: "view_pricecollection"
            referencedColumns: ["id"]
          },
        ]
      }
      PriceCollectionProduct: {
        Row: {
          barcode: string
          createdAt: string
          id: number
          priceCollectionId: number
          updatedAt: string
        }
        Insert: {
          barcode: string
          createdAt?: string
          id?: number
          priceCollectionId: number
          updatedAt: string
        }
        Update: {
          barcode?: string
          createdAt?: string
          id?: number
          priceCollectionId?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "PriceCollectionProduct_priceCollectionId_fkey"
            columns: ["priceCollectionId"]
            isOneToOne: false
            referencedRelation: "PriceCollection"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "PriceCollectionProduct_priceCollectionId_fkey"
            columns: ["priceCollectionId"]
            isOneToOne: false
            referencedRelation: "view_pricecollection"
            referencedColumns: ["id"]
          },
        ]
      }
      PriceCollectionProductHistory: {
        Row: {
          barcode: string
          createdAt: string
          description: string | null
          id: number
          image: string | null
          interval: string | null
          lastCheckDate: string | null
          storeCnpj: string
          unit: string | null
          updatedAt: string
          value: number
        }
        Insert: {
          barcode: string
          createdAt?: string
          description?: string | null
          id?: number
          image?: string | null
          interval?: string | null
          lastCheckDate?: string | null
          storeCnpj: string
          unit?: string | null
          updatedAt: string
          value: number
        }
        Update: {
          barcode?: string
          createdAt?: string
          description?: string | null
          id?: number
          image?: string | null
          interval?: string | null
          lastCheckDate?: string | null
          storeCnpj?: string
          unit?: string | null
          updatedAt?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "PriceCollectionProductHistory_storeCnpj_fkey"
            columns: ["storeCnpj"]
            isOneToOne: false
            referencedRelation: "Store"
            referencedColumns: ["cnpj"]
          },
        ]
      }
      Store: {
        Row: {
          cityId: number
          cnpj: string
          createdAt: string
          endDistrict: string
          endNumber: string
          endStreet: string
          name: string
          phone: string | null
          updatedAt: string
        }
        Insert: {
          cityId: number
          cnpj: string
          createdAt?: string
          endDistrict: string
          endNumber: string
          endStreet: string
          name: string
          phone?: string | null
          updatedAt: string
        }
        Update: {
          cityId?: number
          cnpj?: string
          createdAt?: string
          endDistrict?: string
          endNumber?: string
          endStreet?: string
          name?: string
          phone?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Store_cityId_fkey"
            columns: ["cityId"]
            isOneToOne: false
            referencedRelation: "City"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          createdAt: string
          id: string
          name: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id: string
          name: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          id?: string
          name?: string
          updatedAt?: string
        }
        Relationships: []
      }
    }
    Views: {
      view_pricecollection: {
        Row: {
          countproduct: number | null
          createdAt: string | null
          description: string | null
          id: number | null
          lastcheckdate: string | null
          name: string | null
          updatedAt: string | null
          userId: string | null
        }
        Relationships: [
          {
            foreignKeyName: "PriceCollection_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      view_pricecollectionproducthistory: {
        Row: {
          barcode: string | null
          cityId: number | null
          createdAt: string | null
          description: string | null
          id: number | null
          image: string | null
          interval: string | null
          lastCheckDate: string | null
          priceCollectionId: number | null
          storeCnpj: string | null
          unit: string | null
          updatedAt: string | null
          value: number | null
        }
        Relationships: [
          {
            foreignKeyName: "PriceCollectionProduct_priceCollectionId_fkey"
            columns: ["priceCollectionId"]
            isOneToOne: false
            referencedRelation: "PriceCollection"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "PriceCollectionProduct_priceCollectionId_fkey"
            columns: ["priceCollectionId"]
            isOneToOne: false
            referencedRelation: "view_pricecollection"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "PriceCollectionProductHistory_storeCnpj_fkey"
            columns: ["storeCnpj"]
            isOneToOne: false
            referencedRelation: "Store"
            referencedColumns: ["cnpj"]
          },
          {
            foreignKeyName: "Store_cityId_fkey"
            columns: ["cityId"]
            isOneToOne: false
            referencedRelation: "City"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_price_collection_products: {
        Args:
          | {
              p_price_collection_id?: number
              p_city_id?: number
              p_barcode?: string
              p_description?: string
            }
          | {
              p_price_collection_id?: number
              p_city_id?: number
              p_barcode?: string
              p_description?: string
              p_limit?: number
              p_offset?: number
            }
          | {
              p_price_collection_id?: number
              p_city_id?: number
              p_barcode_or_description?: string
              p_limit?: number
              p_offset?: number
            }
        Returns: {
          id: number
          pricecollectionid: number
          barcode: string
          maxvalue: number
          minvalue: number
          description: string
          lastupdateat: string
          countstore: number
          image: string
          maxvaluestorename: string
          minvaluestorename: string
        }[]
      }
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
