
import React from 'react';
import { Game } from '@/frontend/types/api';
import { Card, CardContent } from '@/frontend/components/ui/card';
import { Button } from '@/frontend/components/ui/button';
import { Edit, Trash, ArrowUp, ArrowDown } from 'lucide-react';
import { Skeleton } from '@/frontend/components/ui/skeleton';

interface GameListProps {
  games: Game[];
  loading: boolean;
  error?: string | null;
  onSelect: (game: Game) => void;
  onDelete: (id: string) => void;
  onPositionChange: (index: number, direction: 'up' | 'down') => Promise<void>;
}

const GameList: React.FC<GameListProps> = ({
  games,
  loading,
  error,
  onSelect,
  onDelete,
  onPositionChange
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-4">
              <Skeleton className="h-6 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-1" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-md">
        {error}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="p-4 bg-gray-100 border border-gray-300 text-gray-700 rounded-md">
        No games available. Add a new game to get started.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {games.map((game, index) => (
        <Card key={game.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold">{game.tournament}</h3>
                <p className="text-sm text-gray-500">
                  {game.format} - {game.phase}
                </p>
                <p className="text-sm truncate">
                  {typeof game.players === 'string' ? game.players : 'Multiple players'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onSelect(game)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-500"
                  onClick={() => onDelete(game.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-2 flex justify-end gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPositionChange(index, 'up')}
                disabled={index === 0}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPositionChange(index, 'down')}
                disabled={index === games.length - 1}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GameList;
