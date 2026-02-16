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
  const [title, setTitle] = useState('Pinehurst Trip Championship');
  const [golferCount, setGolferCount] = useState('4');
  const [holeCount, setHoleCount] = useState<'9' | '18'>('18');
  const [coursePar, setCoursePar] = useState('72');

  const handleHoleCountChange = (value: string) => {
    const holes = value as '9' | '18';
    setHoleCount(holes);
    // Update default par based on hole count
    setCoursePar(holes === '18' ? '72' : '36');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const setup: EventSetup = {
      title: title.trim() || 'Pinehurst Trip Championship',
      golferCount: parseInt(golferCount, 10),
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
            placeholder="Pinehurst Trip Championship"
            className="font-medium"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="golferCount">Number of Golfers</Label>
            <Select value={golferCount} onValueChange={setGolferCount}>
              <SelectTrigger id="golferCount">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'Golfer' : 'Golfers'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
