import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type EventSetup } from '../../state/eventTypes';

interface EventSetupFormProps {
  onComplete: (setup: EventSetup) => void;
}

export function EventSetupForm({ onComplete }: EventSetupFormProps) {
  const [title, setTitle] = useState('');
  const [courseName, setCourseName] = useState('');
  const [golferCount, setGolferCount] = useState('4');
  const [holeCount, setHoleCount] = useState<'9' | '18'>('18');
  const [coursePar, setCoursePar] = useState('72');
  const [golferCountError, setGolferCountError] = useState('');

  const handleHoleCountChange = (value: string) => {
    const holes = value as '9' | '18';
    setHoleCount(holes);
    // Update default par based on hole count
    setCoursePar(holes === '18' ? '72' : '36');
  };

  const handleGolferCountChange = (value: string) => {
    setGolferCount(value);
    setGolferCountError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate golfer count
    const count = parseInt(golferCount, 10);
    if (isNaN(count) || count < 1 || count > 64) {
      setGolferCountError('Number of golfers must be between 1 and 64');
      return;
    }

    const setup: EventSetup = {
      title: title.trim(),
      courseName: courseName.trim(),
      golferCount: count,
      holeCount: parseInt(holeCount, 10) as 9 | 18,
      coursePar: parseInt(coursePar, 10),
    };

    onComplete(setup);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-serif font-bold text-foreground">Event Setup</h2>
        <p className="text-sm text-muted-foreground">
          Configure your tournament details to get started
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Tournament Title</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter tournament title (optional)"
            className="font-medium"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="courseName">Course Name</Label>
          <Input
            id="courseName"
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="e.g., Pebble Beach Golf Links"
            className="font-medium"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="golferCount">Number of Golfers</Label>
            <Input
              id="golferCount"
              type="number"
              min="1"
              max="64"
              step="1"
              value={golferCount}
              onChange={(e) => handleGolferCountChange(e.target.value)}
              className="font-medium"
              required
            />
            {golferCountError && (
              <p className="text-sm text-destructive">{golferCountError}</p>
            )}
            <p className="text-xs text-muted-foreground">Enter a number between 1 and 64</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="holeCount">Number of Holes</Label>
            <Select value={holeCount} onValueChange={handleHoleCountChange}>
              <SelectTrigger id="holeCount">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="9">9 Holes</SelectItem>
                <SelectItem value="18">18 Holes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coursePar">Course Par</Label>
            <Input
              id="coursePar"
              type="number"
              min="27"
              max="90"
              value={coursePar}
              onChange={(e) => setCoursePar(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full">
        Continue to Score Entry
      </Button>
    </form>
  );
}
