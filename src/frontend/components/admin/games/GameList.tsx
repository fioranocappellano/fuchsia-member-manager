import React from 'react';
import { Game } from '@/frontend/types/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Edit, Trash } from 'lucide-react';

interface GameListProps {
  games: Game[];
  loading: boolean;
  reordering: boolean;
  onEdit: (game: Game) => void;
  onDelete: (id: string) => void;
  onMoveItem: (index: number, direction: 'up' | 'down') => Promise<void>;
}

const GameList: React.FC<GameListProps> = ({
  games,
  loading,
  reordering,
  onEdit,
  onDelete,
  onMoveItem,
}) => {
  if (loading) {
    return <p>Loading games...</p>;
  }

  if (!games || games.length === 0) {
    return <p>No games found.</p>;
  }

  return (
    <div className="space-y-3">
      {games.map((game, index) => (
        <Card key={game.id} className="bg-black/40 border-white/10">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-white">{game.tournament} - {game.phase}</h3>
                <p className="text-sm text-gray-400">Format: {game.format}</p>
              </div>
              <div className="flex items-center space-x-2">
                {reordering ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMoveItem(index, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMoveItem(index, 'down')}
                      disabled={index === games.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(game)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => onDelete(game.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GameList;
