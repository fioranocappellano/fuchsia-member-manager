
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
    fetchGames,
    handleDelete,
    handleUpdate,
    handleAddGame,
    handleEdit,
    moveItem
  } = useGameManager();

  // Handlers to map to the expected API
  const onEdit = (game: Game) => {
    if (handleEdit) {
      handleEdit(game);
    } else {
      setEditingGame(game);
    }
  };
  
  const onDelete = handleDelete;
  
  const onUpdate = async (formData: any) => {
    if (editingGame) {
      await handleUpdate({
        ...formData,
        id: editingGame.id,
        position: editingGame.position
      });
    }
    setEditingGame(null);
  };
  
  const onAddGame = () => {
    if (handleAddGame) {
      handleAddGame();
    } else {
      setDialogOpen(true);
    }
  };
  
  const toggleReordering = () => setReordering(prev => !prev);
  
  const onMoveItem = async (id: string, direction: 'up' | 'down') => {
    if (moveItem) {
      await moveItem(id, direction);
    } else {
      // Default implementation if moveItem isn't provided
      console.log("Move item not implemented:", id, direction);
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
          handleAddGame={onAddGame}
        />
      )}
      
      <h2 className="text-xl font-bold mb-4 text-white/90 mt-8">
        {reordering ? 'Use arrows to reorder games' : 'Current Games'}
      </h2>

      {editingGame ? (
        <GameEditForm 
          game={editingGame} 
          onSave={onUpdate} 
          onCancel={() => setEditingGame(null)} 
        />
      ) : (
        <GameList
          games={games}
          loading={loading}
          reordering={reordering}
          onEdit={onEdit}
          onDelete={onDelete}
          onMoveItem={onMoveItem}
        />
      )}
    </div>
  );
};

export default GameManager;
