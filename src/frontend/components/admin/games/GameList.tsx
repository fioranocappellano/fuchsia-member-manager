
import { Game } from "@/frontend/types/api";
import { Button } from "@/frontend/components/ui/button";
import { Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Skeleton } from "@/frontend/components/ui/skeleton";
import { normalizeImageUrl } from "@/frontend/utils/imageUtils";

interface GameListProps {
  games: Game[];
  loading: boolean;
  reordering: boolean;
  onEdit: (game: Game) => void;
  onDelete: (id: string) => void;
  onMoveItem: (index: number, direction: "up" | "down") => void;
}

const GameList: React.FC<GameListProps> = ({
  games,
  loading,
  reordering,
  onEdit,
  onDelete,
  onMoveItem
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-black/20 border border-white/10 rounded-lg p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Skeleton className="h-32 w-56 rounded-md" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-12 bg-black/20 border border-white/10 rounded-lg">
        <h3 className="text-xl font-medium text-gray-400">No games added yet</h3>
        <p className="text-gray-500 mt-1">Click "Add Game" to create your first game showcase</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {games.map((game, index) => (
        <div 
          key={game.id} 
          className="bg-black/20 border border-white/10 rounded-lg p-4 md:p-6 transition-all hover:border-white/20"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-56 h-32 overflow-hidden rounded-md border border-white/10">
              <img 
                src={normalizeImageUrl(game.image_url)} 
                alt={game.tournament} 
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-2 py-1 bg-[#D946EF]/20 text-[#D946EF] rounded-full text-xs font-medium">
                  {game.format}
                </span>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                  {game.tournament}
                </span>
                <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded-full text-xs font-medium">
                  {game.phase}
                </span>
              </div>
              
              <h3 className="text-lg font-medium text-white">{game.players}</h3>
              
              <p className="text-gray-400 mt-1 line-clamp-2 text-sm">
                {game.description_en}
              </p>
            </div>
            
            <div className="flex md:flex-col justify-end gap-2 mt-4 md:mt-0">
              {reordering ? (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onMoveItem(index, "up")}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onMoveItem(index, "down")}
                    disabled={index === games.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => onEdit(game)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-8 w-8 border-red-800/40 hover:bg-red-900/20 hover:text-red-400"
                    onClick={() => onDelete(game.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameList;
