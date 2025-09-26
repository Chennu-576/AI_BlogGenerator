export type Database = {
  public: {
    Tables: {
      blogs: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          word_count: number
          seo_score: number
          status: 'draft' | 'published'
          created_at: string
          updated_at?: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          word_count: number
          seo_score: number
          status?: 'draft' | 'published'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          word_count?: number
          seo_score?: number
          status?: 'draft' | 'published'
          updated_at?: string
        }
      }
    }
}
}