import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type CallawayResultData } from '../../state/eventTypes';
import { Medal, Trophy } from 'lucide-react';

interface LeaderboardTableProps {
  results: CallawayResultData[];
}

export function LeaderboardTable({ results }: LeaderboardTableProps) {
  // Assign ranks (same net score = same rank)
  const rankedResults = results.map((result, index) => {
    let rank = index + 1;
    if (index > 0 && result.net === results[index - 1].net) {
      // Find the rank of the previous player with same score
      let prevIndex = index - 1;
      while (prevIndex > 0 && results[prevIndex].net === results[prevIndex - 1].net) {
        prevIndex--;
      }
      rank = prevIndex + 1;
    }
    return { ...result, rank };
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return null;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Rank</TableHead>
            <TableHead>Player Name</TableHead>
            <TableHead className="text-right">Net Score</TableHead>
            <TableHead className="text-right">Gross Score</TableHead>
            <TableHead className="text-right">Deduction</TableHead>
            <TableHead className="text-right">Adjustment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rankedResults.map((result) => (
            <TableRow key={result.id} className={result.rank === 1 ? 'bg-primary/5' : ''}>
              <TableCell className="font-semibold">
                <div className="flex items-center gap-2">
                  {getRankIcon(result.rank)}
                  <span>{result.rank}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">{result.name}</TableCell>
              <TableCell className="text-right font-bold text-lg">{result.net}</TableCell>
              <TableCell className="text-right text-muted-foreground">{result.gross}</TableCell>
              <TableCell className="text-right text-muted-foreground">-{result.deduction}</TableCell>
              <TableCell className="text-right text-muted-foreground">
                {result.adjustment === 0 ? '0' : result.adjustment}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
