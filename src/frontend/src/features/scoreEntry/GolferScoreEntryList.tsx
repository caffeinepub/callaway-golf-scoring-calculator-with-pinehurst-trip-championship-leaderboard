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

  const calculateSubtotal = (holeScores: string[], startIndex: number, endIndex: number): number | null => {
    const rangeScores = holeScores.slice(startIndex, endIndex);
    const allFilled = rangeScores.every((score) => score !== '');
    if (!allFilled) return null;

    const total = rangeScores.reduce((sum, score) => {
      const num = parseInt(score, 10);
      return isNaN(num) ? sum : sum + num;
    }, 0);

    return total;
  };

  return (
    <div className="space-y-6">
      {golfers.map((golfer, golferIndex) => {
        const grossTotal = calculateGrossTotal(golfer.holeScores);
        const frontNineSubtotal = calculateSubtotal(golfer.holeScores, 0, 9);
        const backNineSubtotal = holeCount === 18 ? calculateSubtotal(golfer.holeScores, 9, 18) : null;

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
                  
                  {/* Front Nine (Holes 1-9) */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Front 9
                    </div>
                    <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
                      {golfer.holeScores.slice(0, 9).map((score, holeIndex) => (
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
                    
                    {/* Front Nine Subtotal */}
                    <div className="flex items-center justify-between bg-muted/30 rounded-md px-3 py-2">
                      <Label className="text-sm font-semibold">Front 9 Subtotal:</Label>
                      <div className="text-lg font-mono font-bold text-primary">
                        {frontNineSubtotal !== null ? frontNineSubtotal : '—'}
                      </div>
                    </div>
                  </div>

                  {/* Back Nine (Holes 10-18) - Only for 18-hole events */}
                  {holeCount === 18 && (
                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Back 9
                      </div>
                      <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
                        {golfer.holeScores.slice(9, 18).map((score, holeIndex) => {
                          const actualHoleIndex = holeIndex + 9;
                          return (
                            <div key={actualHoleIndex} className="space-y-1">
                              <Label
                                htmlFor={`score-${golfer.id}-${actualHoleIndex}`}
                                className="text-xs text-muted-foreground text-center block"
                              >
                                {actualHoleIndex + 1}
                              </Label>
                              <Input
                                id={`score-${golfer.id}-${actualHoleIndex}`}
                                type="number"
                                min="1"
                                max="15"
                                value={score}
                                onChange={(e) => handleScoreChange(golferIndex, actualHoleIndex, e.target.value)}
                                className="text-center h-10 font-mono font-semibold"
                                placeholder="–"
                                required
                              />
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Back Nine Subtotal */}
                      <div className="flex items-center justify-between bg-muted/30 rounded-md px-3 py-2">
                        <Label className="text-sm font-semibold">Back 9 Subtotal:</Label>
                        <div className="text-lg font-mono font-bold text-primary">
                          {backNineSubtotal !== null ? backNineSubtotal : '—'}
                        </div>
                      </div>
                    </div>
                  )}
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
