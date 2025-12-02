import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2, Sparkles, Zap, LogOut } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Settings() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}

function SettingsContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [useOpenAI, setUseOpenAI] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('use_openai_elevenlabs')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setUseOpenAI(data.use_openai_elevenlabs);
      } else {
        // Create default preferences
        await supabase
          .from('user_preferences')
          .insert({
            user_id: user!.id,
            use_openai_elevenlabs: true
          });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (newValue: boolean) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user!.id,
          use_openai_elevenlabs: newValue,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      setUseOpenAI(newValue);
      toast({
        title: 'Settings saved',
        description: `Now using ${newValue ? 'OpenAI + ElevenLabs' : 'Gemini'} for AI responses`,
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully',
      });
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Customize your Avera experience
        </p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Provider
          </CardTitle>
          <CardDescription>
            Choose which AI system powers your conversations with Avera
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/50">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="ai-provider" className="text-base font-semibold cursor-pointer">
                  Use OpenAI + ElevenLabs
                </Label>
                {useOpenAI && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {useOpenAI ? (
                  <>
                    <Zap className="w-4 h-4 inline mr-1" />
                    GPT-4.1-mini for emotional intelligence, ElevenLabs for natural voice responses
                  </>
                ) : (
                  'Currently using Google Gemini 2.5 Flash for chat'
                )}
              </p>
            </div>
            <Switch
              id="ai-provider"
              checked={useOpenAI}
              onCheckedChange={savePreferences}
              disabled={saving}
              className="ml-4"
            />
          </div>

          <div className="text-sm text-muted-foreground space-y-2 p-4 bg-muted/30 rounded-lg">
            <p className="font-medium">What changes with OpenAI + ElevenLabs?</p>
            <ul className="space-y-1 ml-4">
              <li>• More emotionally intelligent responses</li>
              <li>• Natural, personality-matched voice responses</li>
              <li>• Better memory and context understanding</li>
              <li>• Smoother conversation flow</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        onClick={() => window.history.back()}
        className="w-full"
      >
        Back to Chat
      </Button>

      <Button
        variant="destructive"
        onClick={handleSignOut}
        className="w-full"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}
