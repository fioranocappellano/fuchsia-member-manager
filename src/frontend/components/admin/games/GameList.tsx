
import { Button } from '@/frontend/components/ui/button';
import { 
  ChevronUp, ChevronDown, Edit, Trash2, AlertOctagon 
} from 'lucide-react';
import { Game } from '@/frontend/types/api';
import { Skeleton } from '@/frontend/components/ui/skeleton';

interface GameListProps {
  games: Game[];
  loading: boolean;
  error: string | null;
  onSelect: (game: Game) => void;
  onDelete: (id: string) => Promise<void>;
  onPositionChange: (index: number, direction: 'up' | 'down') => void;
}

/**
 * Component to display a list of games with controls for reordering, editing, and deleting
 */
const GameList = ({ 
  games, 
  loading, 
  error,
  onSelect, 
  onDelete,
  onPositionChange
}: GameListProps) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md flex items-center gap-2">
        <AlertOctagon className="h-5 w-5" />
        <p>{error}</p>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="p-4 border border-gray-200 rounded-md text-center text-gray-500">
        No games found. Add your first game!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {games.map((game, index) => (
        <div 
          key={game.id} 
          className="p-3 border border-gray-200 rounded-md flex items-center justify-between gap-2 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{game.tournament}</h3>
            <p className="text-sm text-gray-500 truncate">
              {game.format} - {game.players.join(' vs ')}
            </p>
          </div>
          
          <div className="flex items-center gap-1">
            <div className="flex flex-col">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={() => onPositionChange(index, 'up')}
                disabled={index === 0}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={() => onPositionChange(index, 'down')}
                disabled={index === games.length - 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onSelect(game)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => {
                if (confirm('Are you sure you want to delete this game?')) {
                  onDelete(game.id);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameList;
