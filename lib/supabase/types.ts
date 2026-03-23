export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type LedgerRole = "owner" | "editor" | "viewer";
export type InviteStatus = "active" | "used" | "expired";
export type CategoryType = "expense" | "income" | "transfer";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nickname: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          nickname?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          nickname?: string;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      ledgers: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon: string | null;
          currency: string;
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          currency?: string;
          owner_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          icon?: string | null;
          currency?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ledger_members: {
        Row: {
          id: string;
          ledger_id: string;
          user_id: string;
          role: LedgerRole;
          joined_at: string;
        };
        Insert: {
          id?: string;
          ledger_id: string;
          user_id: string;
          role?: LedgerRole;
          joined_at?: string;
        };
        Update: {
          role?: LedgerRole;
        };
        Relationships: [];
      };
      ledger_invites: {
        Row: {
          id: string;
          ledger_id: string;
          token: string;
          role: LedgerRole;
          created_by: string;
          status: InviteStatus;
          expires_at: string;
          used_by: string | null;
          used_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          ledger_id: string;
          token?: string;
          role?: LedgerRole;
          created_by: string;
          status?: InviteStatus;
          expires_at?: string;
          used_by?: string | null;
          used_at?: string | null;
          created_at?: string;
        };
        Update: {
          role?: LedgerRole;
          status?: InviteStatus;
          expires_at?: string;
          used_by?: string | null;
          used_at?: string | null;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          ledger_id: string;
          parent_id: string | null;
          name: string;
          icon: string | null;
          color: string | null;
          type: CategoryType;
          sort_order: number;
          is_system: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          ledger_id: string;
          parent_id?: string | null;
          name: string;
          icon?: string | null;
          color?: string | null;
          type?: CategoryType;
          sort_order?: number;
          is_system?: boolean;
          created_at?: string;
        };
        Update: {
          parent_id?: string | null;
          name?: string;
          icon?: string | null;
          color?: string | null;
          type?: CategoryType;
          sort_order?: number;
          is_system?: boolean;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string;
          ledger_id: string;
          category_id: string | null;
          created_by: string;
          amount: number;
          type: CategoryType;
          note: string | null;
          occurred_at: string;
          tags: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          ledger_id: string;
          category_id?: string | null;
          created_by: string;
          amount: number;
          type: CategoryType;
          note?: string | null;
          occurred_at?: string;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          category_id?: string | null;
          amount?: number;
          type?: CategoryType;
          note?: string | null;
          occurred_at?: string;
          tags?: string[] | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      monthly_summary: {
        Row: {
          ledger_id: string;
          month: string;
          type: CategoryType;
          category_id: string | null;
          category_name: string | null;
          parent_id: string | null;
          tx_count: number;
          total_amount: number;
        };
        Relationships: [];
      };
    };
    Functions: {
      is_ledger_member: {
        Args: { p_ledger_id: string };
        Returns: boolean;
      };
      is_ledger_editor: {
        Args: { p_ledger_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      ledger_role: LedgerRole;
      invite_status: InviteStatus;
      category_type: CategoryType;
    };
    CompositeTypes: Record<string, never>;
  };
}
