import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash, PenSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface FAQ {
  id: string;
  question_it: string;
  question_en: string;
  answer_it: string;
  answer_en: string;
  position: number;
  is_active: boolean;
}

const FAQManager = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFaq, setNewFaq] = useState<Omit<FAQ, "id" | "created_at" | "updated_at">>({
    question_it: "",
    question_en: "",
    answer_it: "",
    answer_en: "",
    position: 0,
    is_active: true,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const { toast } = useToast();

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("position", { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error: any) {
      console.error("Error fetching FAQs:", error);
      toast({
        title: "Error",
        description: "Failed to load FAQs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();

    // Set up real-time listener
    const subscription = supabase
      .channel("faqs-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "faqs" },
        () => {
          fetchFAQs();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAddFaq = async () => {
    try {
      if (!newFaq.question_it || !newFaq.question_en || !newFaq.answer_it || !newFaq.answer_en) {
        toast({
          title: "Validation Error",
          description: "All fields are required",
          variant: "destructive",
        });
        return;
      }

      // Determine the next position
      const nextPosition = faqs.length > 0 
        ? Math.max(...faqs.map(faq => faq.position)) + 1 
        : 0;
      
      const faqToAdd = {
        ...newFaq,
        position: nextPosition
      };

      const { error } = await supabase.from("faqs").insert([faqToAdd]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "FAQ added successfully",
      });
      
      setNewFaq({
        question_it: "",
        question_en: "",
        answer_it: "",
        answer_en: "",
        position: 0,
        is_active: true,
      });
      
      setDialogOpen(false);
      fetchFAQs();
    } catch (error: any) {
      console.error("Error adding FAQ:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add FAQ",
        variant: "destructive",
      });
    }
  };

  const handleEditFaq = async () => {
    try {
      if (!editingFaq) return;
      
      // Keep the original position when updating
      const { error } = await supabase
        .from("faqs")
        .update({
          question_it: editingFaq.question_it,
          question_en: editingFaq.question_en,
          answer_it: editingFaq.answer_it,
          answer_en: editingFaq.answer_en,
          is_active: editingFaq.is_active,
          // Don't update position to maintain order
        })
        .eq("id", editingFaq.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "FAQ updated successfully",
      });
      
      setEditingFaq(null);
      setDialogOpen(false);
      fetchFAQs();
    } catch (error: any) {
      console.error("Error updating FAQ:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update FAQ",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      const { error } = await supabase.from("faqs").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "FAQ deleted successfully",
      });
      
      fetchFAQs();
    } catch (error: any) {
      console.error("Error deleting FAQ:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete FAQ",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: string, is_active: boolean) => {
    try {
      const { error } = await supabase
        .from("faqs")
        .update({ is_active: !is_active })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `FAQ ${is_active ? "deactivated" : "activated"} successfully`,
      });
      
      fetchFAQs();
    } catch (error: any) {
      console.error("Error toggling FAQ:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update FAQ",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">FAQ Management</h2>
          <p className="text-muted-foreground mt-1">Manage frequently asked questions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-[#D946EF] hover:bg-[#D946EF]/90" 
              onClick={() => {
                setEditingFaq(null);
                setNewFaq({
                  question_it: "",
                  question_en: "",
                  answer_it: "",
                  answer_en: "",
                  position: faqs.length,
                  is_active: true,
                });
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-jf-dark border-[#D946EF]/30 text-jf-light">
            <DialogHeader>
              <DialogTitle className="text-jf-light">{editingFaq ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="question_it">Question (Italian)</Label>
                  <Input
                    id="question_it"
                    value={editingFaq ? editingFaq.question_it : newFaq.question_it}
                    onChange={(e) => editingFaq 
                      ? setEditingFaq({...editingFaq, question_it: e.target.value})
                      : setNewFaq({...newFaq, question_it: e.target.value})
                    }
                    className="bg-jf-gray/30 border-[#D946EF]/30 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="question_en">Question (English)</Label>
                  <Input
                    id="question_en"
                    value={editingFaq ? editingFaq.question_en : newFaq.question_en}
                    onChange={(e) => editingFaq
                      ? setEditingFaq({...editingFaq, question_en: e.target.value})
                      : setNewFaq({...newFaq, question_en: e.target.value})
                    }
                    className="bg-jf-gray/30 border-[#D946EF]/30 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="answer_it">Answer (Italian) - Markdown</Label>
                  <Textarea
                    id="answer_it"
                    rows={6}
                    value={editingFaq ? editingFaq.answer_it : newFaq.answer_it}
                    onChange={(e) => editingFaq
                      ? setEditingFaq({...editingFaq, answer_it: e.target.value})
                      : setNewFaq({...newFaq, answer_it: e.target.value})
                    }
                    placeholder="Support markdown formatting"
                    className="bg-jf-gray/30 border-[#D946EF]/30 text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="answer_en">Answer (English) - Markdown</Label>
                  <Textarea
                    id="answer_en"
                    rows={6}
                    value={editingFaq ? editingFaq.answer_en : newFaq.answer_en}
                    onChange={(e) => editingFaq
                      ? setEditingFaq({...editingFaq, answer_en: e.target.value})
                      : setNewFaq({...newFaq, answer_en: e.target.value})
                    }
                    placeholder="Support markdown formatting"
                    className="bg-jf-gray/30 border-[#D946EF]/30 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
              {!editingFaq && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      type="number"
                      value={newFaq.position}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setNewFaq({...newFaq, position: value});
                      }}
                      className="bg-jf-gray/30 border-[#D946EF]/30 text-white"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <Switch
                      id="is_active"
                      checked={editingFaq ? editingFaq.is_active : newFaq.is_active}
                      onCheckedChange={(checked) => editingFaq
                        ? setEditingFaq({...editingFaq, is_active: checked})
                        : setNewFaq({...newFaq, is_active: checked})
                      }
                      className="data-[state=checked]:bg-[#D946EF]"
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </div>
              )}
              {editingFaq && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={editingFaq.is_active}
                    onCheckedChange={(checked) => 
                      setEditingFaq({...editingFaq, is_active: checked})
                    }
                    className="data-[state=checked]:bg-[#D946EF]"
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} 
                className="border-[#D946EF]/50 text-[#D946EF] hover:bg-[#D946EF]/10">
                Cancel
              </Button>
              <Button 
                type="button" 
                className="bg-[#D946EF] hover:bg-[#D946EF]/90"
                onClick={editingFaq ? handleEditFaq : handleAddFaq}
              >
                {editingFaq ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center my-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : faqs.length === 0 ? (
        <div className="text-center py-12 bg-black/20 rounded-lg border border-white/10">
          <h3 className="text-xl font-medium mb-2">No FAQs Found</h3>
          <p className="text-gray-500 mb-4">Add your first FAQ using the button above.</p>
          <Button 
            className="bg-[#D946EF] hover:bg-[#D946EF]/90"
            onClick={() => {
              setEditingFaq(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add FAQ
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {faqs.map((faq) => (
            <Card key={faq.id} className={!faq.is_active ? "opacity-60 border border-white/5 bg-black/20" : "border border-white/10 bg-black/20"}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="text-lg">{faq.question_en}</CardTitle>
                    <CardDescription>Position: {faq.position}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`active-${faq.id}`}
                      checked={faq.is_active}
                      onCheckedChange={() => handleToggleActive(faq.id, faq.is_active)}
                      className="data-[state=checked]:bg-[#D946EF]"
                    />
                    <Label htmlFor={`active-${faq.id}`} className="sr-only">
                      Active
                    </Label>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingFaq(faq);
                        setDialogOpen(true);
                      }}
                      className="hover:bg-[#D946EF]/10 hover:text-[#D946EF]"
                    >
                      <PenSquare className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="hover:bg-[#D946EF]/10 hover:text-[#D946EF]"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-2 text-sm">
                  <strong>IT:</strong> {faq.question_it}
                </div>
                <div className="mt-2 text-sm">
                  <strong>EN:</strong> {faq.answer_en.length > 100 ? `${faq.answer_en.substring(0, 100)}...` : faq.answer_en}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FAQManager;
