
import { supabase } from './supabase'
import { Database } from './supabase'

type Blog = Database['public']['Tables']['blogs']['Row']
type BlogInsert = Database['public']['Tables']['blogs']['Insert']
type BlogUpdate = Database['public']['Tables']['blogs']['Update']

const blogService = {
  /** Fetch all blogs for a user */
  async getBlogs(userId: string): Promise<{ data: Blog[] | null; error: any }> {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      // console.error('[blogService.getBlogs] Error:', error)
    }
    return { data, error }
  },

  /** Fetch a single blog by id for a user */
  async getBlog(id: string, userId: string): Promise<{ data: Blog | null; error: any }> {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error('[blogService.getBlog] Error:', error)
    }
    return { data, error }
  },

  /** Create a new blog */
  async createBlog(blog: BlogInsert): Promise<{ data: Blog | null; error: any }> {
    const { data, error } = await supabase
      .from('blogs')
      .insert(blog)
      .select()
      .single()

    if (error) {
      console.error('[blogService.createBlog] Error:', error)
    }
    return { data, error }
  },

  /** Update a blog */
  // async updateBlog(id: string, updates: BlogUpdate): Promise<{ data: Blog | null; error: any }> {
  //   const { data, error } = await supabase
  //     .from('blogs')
  //     .update({ ...updates, updated_at: new Date().toISOString() })
  //     .eq('id', id)
  //     .select()
  //     .single()

  //   if (error) {
  //     console.error('[blogService.updateBlog] Error:', error)
  //   }
  //   return { data, error }
  // },

  async updateBlog(blogId: string, updates: Partial<Blog>) {
  const { data, error } = await supabase
    .from('blogs')
    .update(updates)
    .eq('id', blogId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
},


  /** Delete a blog */
  async deleteBlog(id: string, userId: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('[blogService.deleteBlog] Error:', error)
    }
    return { error }
  },

  /** Get blog stats for a user */
  async getStats(userId: string): Promise<{ data: any; error: any }> {
    const { data: blogs, error } = await supabase
      .from('blogs')
      .select('word_count, seo_score, status')
      .eq('user_id', userId)

    if (error || !blogs) {
      // console.error('[blogService.getStats] Error:', error)
      return { data: null, error }
    }

    const totalBlogs = blogs.length
    const publishedBlogs = blogs.filter(b => b.status === 'published').length
    const totalWords = blogs.reduce((sum, b) => sum + (b.word_count || 0), 0)
    const avgSeoScore =
      blogs.length > 0
        ? blogs.reduce((sum, b) => sum + (b.seo_score || 0), 0) / blogs.length
        : 0

    return {
      data: {
        totalBlogs,
        publishedBlogs,
        totalWords,
        avgSeoScore: Math.round(avgSeoScore * 10) / 10,
      },
      error: null,
    }
  },
}

export default blogService



