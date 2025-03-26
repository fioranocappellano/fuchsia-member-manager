
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, ArrowLeft } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Game } from "@/frontend/types/api";
import { normalizeImageUrl } from "@/frontend/utils/imageUtils";

// Schema for form validation
const formSchema = z.object({
  tournament: z.string().min(2, { message: "Tournament name must be at least 2 characters." }),
  phase: z.string().min(2, { message: "Phase must be at least 2 characters." }),
  format: z.string().min(2, { message: "Format must be at least 2 characters." }),
  players: z.string().min(2, { message: "Players must be at least 2 characters." }),
  description_it: z.string().min(10, { message: "Italian description must be at least 10 characters." }),
  description_en: z.string().min(10, { message: "English description must be at least 10 characters." }),
  image_url: z.string().url({ message: "Please enter a valid URL for the image." }),
  replay_url: z.string().url({ message: "Please enter a valid URL for the replay." }),
});

type FormValues = z.infer<typeof formSchema>;

interface GameEditFormProps {
  game: Game;
  onSave: (id: string, updatedGame: Partial<Game>) => void;
  onCancel: () => void;
}

const GameEditForm: React.FC<GameEditFormProps> = ({ game, onSave, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(normalizeImageUrl(game.image_url));
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tournament: game.tournament,
      phase: game.phase,
      format: game.format,
      players: game.players,
      description_it: game.description_it,
      description_en: game.description_en,
      image_url: game.image_url,
      replay_url: game.replay_url,
    },
  });

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPreviewImage(url);
    form.setValue("image_url", url);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      // We don't need to pass the ID in the values since we pass it separately
      await onSave(game.id, values);
    } catch (error) {
      console.error("Error updating game:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/20 border border-white/10 rounded-lg p-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onCancel}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h2 className="text-xl font-bold text-white">Edit Game</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {/* Image Preview */}
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-2">Image Preview</p>
                <div className="aspect-video bg-black/40 rounded-lg overflow-hidden border border-white/10">
                  <img 
                    src={previewImage} 
                    alt="Game preview" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Image URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Image URL" 
                        className="bg-black/40 border-white/10 text-white" 
                        onChange={handleImageUrlChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="tournament"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Tournament</FormLabel>
                    <FormControl>
                      <Input placeholder="Tournament" className="bg-black/40 border-white/10 text-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phase"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Phase</FormLabel>
                      <FormControl>
                        <Input placeholder="Phase" className="bg-black/40 border-white/10 text-white" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Format</FormLabel>
                      <FormControl>
                        <Input placeholder="Format" className="bg-black/40 border-white/10 text-white" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="players"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Players</FormLabel>
                    <FormControl>
                      <Input placeholder="Players" className="bg-black/40 border-white/10 text-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="replay_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Replay URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Replay URL" className="bg-black/40 border-white/10 text-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="description_it"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Description (IT)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Italian Description"
                      className="bg-black/40 border-white/10 text-white min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Description (EN)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="English Description"
                      className="bg-black/40 border-white/10 text-white min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[#D946EF] hover:bg-[#D946EF]/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default GameEditForm;
