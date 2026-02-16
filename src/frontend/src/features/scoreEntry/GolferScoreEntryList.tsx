import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type GolferData } from '../../state/eventTypes';
import { User } from 'lucide-react';

interface GolferScoreEntryListProps {
  golfers: GolferData[];
  holeCount: number;
  onUpdate: (golfers: GolferData[]) => void;
}

export function GolferScoreEntryList({ golfers, holeCount, onUpdate }: GolferScoreEntryListProps) {
  const handleNameChange = (index: number, name: string) => {
    const updated = [...golfers];
    updated[index] = { ...updated[index], name };
    onUpdate(updated);
  };

  const handleScoreChange = (golferIndex: number, holeIndex: number, value: string) => {
    // Allow empty string or valid numbers
    if (value !== '' && (isNaN(Number(value)) || Number(value) < 0)) {
      return;
    }

    const updated = [...golfers];
    const newScores = [...updated[golferIndex].holeScores];
    newScores[holeIndex] = value;
    updated[golferIndex] = { ...updated[golferIndex], holeScores: newScores };
    onUpdate(updated);
  };

  const calculateGrossTotal = (holeScores: string[]): number | null => {
    // Check if all scores are filled and valid
    const allFilled = holeScores.every((score) => score !== '');
    if (!allFilled) return null;

    const total = holeScores.reduce((sum, score) => {
      const num = parseInt(score, 10);
      return isNaN(num) ? sum : sum + num;
    }, 0);

    return total;
  };

  return (
    <div className="space-y-6">
      {golfers.map((golfer, golferIndex) => {
        const grossTotal = calculateGrossTotal(golfer.holeScores);

        return (
          <Card key={golfer.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">Golfer {golferIndex + 1}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`name-${golfer.id}`}>Player Name *</Label>
                  <Input
                    id={`name-${golfer.id}`}
                    type="text"
                    value={golfer.name}
                    onChange={(e) => handleNameChange(golferIndex, e.target.value)}
                    placeholder="Enter player name"
                    className="font-medium"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label>Hole Scores (Gross Strokes) *</Label>
                  <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
                    {golfer.holeScores.map((score, holeIndex) => (
                      <div key={holeIndex} className="space-y-1">
                        <Label
                          htmlFor={`score-${golfer.id}-${holeIndex}`}
                          className="text-xs text-muted-foreground text-center block"
                        >
                          {holeIndex + 1}
                        </Label>
                        <Input
                          id={`score-${golfer.id}-${holeIndex}`}
                          type="number"
                          min="1"
                          max="15"
                          value={score}
                          onChange={(e) => handleScoreChange(golferIndex, holeIndex, e.target.value)}
                          className="text-center h-10 font-mono font-semibold"
                          placeholder="–"
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gross Total Display */}
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Gross Total:</Label>
                    <div className="text-2xl font-mono font-bold text-primary">
                      {grossTotal !== null ? grossTotal : '—'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
