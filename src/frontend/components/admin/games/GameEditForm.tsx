import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GameFormData, Game } from '@/frontend/types/api';

interface GameEditFormProps {
  game?: Game | null;
  onSave: (data: GameFormData) => Promise<void>;
  onCancel: () => void;
}

const GameEditForm: React.FC<GameEditFormProps> = ({ game, onSave, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<GameFormData>({
    defaultValues: game ? {
      tournament: game.tournament,
      phase: game.phase,
      format: game.format,
      players: game.players,
      replay_url: game.replay_url,
      image_url: game.image_url,
      winner: game.winner,
      description_en: game.description_en,
      description_it: game.description_it,
    } : {
      tournament: '',
      phase: '',
      format: '',
      players: '',
      replay_url: '',
      image_url: '',
      winner: '',
      description_en: '',
      description_it: '',
    }
  });

  const handleSubmitForm = (data: any) => {
    const formData = {
      ...data,
      players: typeof data.players === 'object' ? data.players.join(', ') : data.players,
    };
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
      <div>
        <Label htmlFor="tournament">Tournament</Label>
        <Input
          type="text"
          id="tournament"
          {...register("tournament", { required: "Tournament is required" })}
        />
      </div>
      
      <div>
        <Label htmlFor="phase">Phase</Label>
        <Input
          type="text"
          id="phase"
          {...register("phase", { required: "Phase is required" })}
        />
      </div>

      <div>
        <Label htmlFor="format">Format</Label>
        <Input
          type="text"
          id="format"
          {...register("format", { required: "Format is required" })}
        />
      </div>

      <div>
        <Label htmlFor="players">Players</Label>
        <Input
          type="text"
          id="players"
          {...register("players", { required: "Players are required" })}
        />
      </div>

      <div>
        <Label htmlFor="replay_url">Replay URL</Label>
        <Input
          type="text"
          id="replay_url"
          {...register("replay_url", { required: "Replay URL is required" })}
        />
      </div>

      <div>
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          type="text"
          id="image_url"
          {...register("image_url", { required: "Image URL is required" })}
        />
      </div>

      <div>
        <Label htmlFor="winner">Winner</Label>
        <Input
          type="text"
          id="winner"
          {...register("winner", { required: "Winner is required" })}
        />
      </div>

      <div>
        <Label htmlFor="description_en">Description (EN)</Label>
        <Textarea
          id="description_en"
          rows={3}
          {...register("description_en", { required: "Description (EN) is required" })}
        />
      </div>

      <div>
        <Label htmlFor="description_it">Description (IT)</Label>
        <Textarea
          id="description_it"
          rows={3}
          {...register("description_it", { required: "Description (IT) is required" })}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

export default GameEditForm;
