import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Heart, Sparkles, Moon, MessageCircle, Zap } from 'lucide-react';

interface EmotionalModeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const modes = [
  { value: 'romantic', label: 'Romantic', icon: Heart },
  { value: 'flirty', label: 'Flirty', icon: Sparkles },
  { value: 'soft', label: 'Soft', icon: Moon },
  { value: 'deep_emotional', label: 'Deep', icon: MessageCircle },
  { value: 'playful', label: 'Playful', icon: Zap },
];

export const EmotionalModeSelector = ({ value, onChange }: EmotionalModeSelectorProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-32 rounded-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <SelectItem key={mode.value} value={mode.value}>
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {mode.label}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
