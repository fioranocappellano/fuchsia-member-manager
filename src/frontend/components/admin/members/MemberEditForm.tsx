
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, ArrowLeft, Plus, X } from "lucide-react";
import { Member } from "@/frontend/types/api";
import { normalizeImageUrl } from "@/frontend/utils/imageUtils";

// Schema for form validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  role: z.string().min(2, { message: "Role must be at least 2 characters." }),
  join_date: z.string().optional(),
  image: z.string().url({ message: "Please enter a valid URL for the image." }),
  smogon: z.string().url({ message: "Please enter a valid URL for the Smogon profile." }).optional().or(z.literal('')),
  achievements: z.array(z.string())
});

type FormValues = z.infer<typeof formSchema>;

interface MemberEditFormProps {
  member: Member;
  onSave: (id: string, updatedMember: Partial<Member>) => void;
  onCancel: () => void;
}

const MemberEditForm: React.FC<MemberEditFormProps> = ({ member, onSave, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(normalizeImageUrl(member.image));
  const [newAchievement, setNewAchievement] = useState("");
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: member.name,
      role: member.role,
      join_date: member.join_date || "",
      image: member.image,
      smogon: member.smogon || "",
      achievements: member.achievements,
    },
  });

  const { setValue, watch } = form;
  const achievements = watch("achievements");

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPreviewImage(url);
    setValue("image", url);
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setValue("achievements", [...achievements, newAchievement.trim()]);
      setNewAchievement("");
    }
  };

  const removeAchievement = (index: number) => {
    setValue(
      "achievements", 
      achievements.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      // Clean up empty values
      const cleanedValues = {
        ...values,
        smogon: values.smogon || null,
        join_date: values.join_date || null
      };
      await onSave(member.id, cleanedValues);
    } catch (error) {
      console.error("Error updating member:", error);
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
        <h2 className="text-xl font-bold text-white">Edit Team Member</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {/* Image Preview */}
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-2">Profile Picture Preview</p>
                <div className="h-48 w-48 bg-black/40 rounded-lg overflow-hidden border border-white/10 mx-auto">
                  <img 
                    src={previewImage} 
                    alt="Member preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Profile Image URL</FormLabel>
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Member Name" className="bg-black/40 border-white/10 text-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Role</FormLabel>
                    <FormControl>
                      <Input placeholder="Role" className="bg-black/40 border-white/10 text-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="join_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Join Date (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. January 2023" 
                        className="bg-black/40 border-white/10 text-white" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="smogon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Smogon Profile URL (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Smogon Profile URL" 
                        className="bg-black/40 border-white/10 text-white" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div>
            <FormLabel className="text-white">Achievements</FormLabel>
            <div className="mt-2 mb-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Add new achievement" 
                  className="bg-black/40 border-white/10 text-white"
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addAchievement();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  onClick={addAchievement}
                  variant="outline"
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
              
              <ul className="mt-4 space-y-2">
                {achievements.length === 0 ? (
                  <li className="text-gray-500 text-sm">No achievements added yet. Add some using the field above.</li>
                ) : (
                  achievements.map((achievement, index) => (
                    <li 
                      key={index} 
                      className="flex items-center justify-between bg-black/30 p-3 rounded-md border border-white/5"
                    >
                      <span className="text-gray-300">{achievement}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-400 hover:text-white"
                        onClick={() => removeAchievement(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <FormMessage />
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

export default MemberEditForm;
