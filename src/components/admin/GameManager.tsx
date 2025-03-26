
import React, { useState } from "react";
import { useGameManager } from "../admin/games/useGameManager";
import GameManagerHeader from "./games/GameManagerHeader";
import GameList from "./games/GameList";
import GameEditForm from "./games/GameEditForm";
import { Game } from "@/frontend/types/api";

const GameManager = () => {
  // Track editing state locally
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [reordering, setReordering] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const {
    games,
    loading,
    error,
    createGame,
    updateGame,
    deleteGame, 
    updatePosition,
    refresh
  } = useGameManager();

  // Handlers to map to the expected API
  const handleEdit = (game: Game) => setEditingGame(game);
  const handleDelete = deleteGame;
  
  const handleUpdate = async (formData: any) => {
    if (editingGame) {
      await updateGame({
        ...formData,
        id: editingGame.id,
        position: editingGame.position
      });
    }
    setEditingGame(null);
  };
  
  const handleAddGame = () => setDialogOpen(true);
  
  const toggleReordering = () => setReordering(prev => !prev);
  
  const moveItem = async (index: number, direction: 'up' | 'down') => {
    const game = games[index];
    if (game?.id) {
      await updatePosition(game.id, direction);
    }
  };

  return (
    <div>
      {!editingGame && (
        <GameManagerHeader
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          reordering={reordering}
          toggleReordering={toggleReordering}
          handleAddGame={handleAddGame}
        />
      )}
      
      <h2 className="text-xl font-bold mb-4 text-white/90 mt-8">
        {reordering ? 'Use arrows to reorder games' : 'Current Games'}
      </h2>

      {editingGame ? (
        <GameEditForm 
          game={editingGame} 
          onSave={handleUpdate} 
          onCancel={() => setEditingGame(null)} 
        />
      ) : (
        <GameList
          games={games}
          loading={loading}
          reordering={reordering}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMoveItem={moveItem}
        />
      )}
    </div>
  );
};

export default GameManager;
