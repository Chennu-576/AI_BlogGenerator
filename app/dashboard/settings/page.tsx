
'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Save, User, Globe, Building } from 'lucide-react'
import { toast } from 'react-hot-toast'

const languages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 
  'Russian', 'Japanese', 'Korean', 'Chinese (Simplified)', 'Chinese (Traditional)',
  'Arabic', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Punjabi'
]

const templates = [
  { id: 'general', name: 'General Article' },
  // { id: 'product-review', name: 'Product Review' },
  // { id: 'listicle', name: 'Listicle' },
  // { id: 'press-release', name: 'Press Release' },
  // { id: 'how-to', name: 'How-to Guide' },
]

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [preferences, setPreferences] = useState({
    language: 'English',
    company_name: '',
    default_template: 'general'
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // In this version, we just show a toast. You can add real save logic later.
      toast.success('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving preferences:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and defaults</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Basic information about you and your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name (Optional)</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="company_name"
                    placeholder="Your company name"
                    value={preferences.company_name}
                    onChange={(e) => setPreferences({ ...preferences, company_name: e.target.value })}
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  This will be used in your generated content when relevant
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-600" />
                Content Preferences
              </CardTitle>
              <CardDescription>
                Set your default language and template preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Language</Label>
                <Select
                  value={preferences.language}
                  onValueChange={(value) => setPreferences({ ...preferences, language: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Default Template</Label>
                <Select
                  value={preferences.default_template}
                  onValueChange={(value) => setPreferences({ ...preferences, default_template: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  This template will be pre-selected when creating new blogs
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving} className="min-w-32">
              {saving ? (
                <>
                  <Save className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
