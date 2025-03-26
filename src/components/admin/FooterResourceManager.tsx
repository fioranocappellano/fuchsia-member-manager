import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PlusCircle, Trash, Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FooterResource {
  id: string;
  title_en: string;
  title_it: string;
  url: string;
  category: string;
  position: number;
}

const FooterResourceManager = () => {
  const [resources, setResources] = useState<FooterResource[]>([]);
  const [editingResource, setEditingResource] = useState<FooterResource | null>(null);
  const [newResource, setNewResource] = useState({
    title_en: "",
    title_it: "",
    url: "",
    category: "",
    position: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("footer_resources")
          .select("*")
          .order("position", { ascending: true });

        if (error) throw error;
        setResources(data || []);
      } catch (error) {
        console.error("Error fetching footer resources:", error);
        toast({
          title: "Error fetching footer resources",
          description: "Failed to load footer resources.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewResource({ ...newResource, [e.target.name]: e.target.value });
  };

  const handleEdit = (resource: FooterResource) => {
    setEditingResource(resource);
  };

  const handleCancelEdit = () => {
    setEditingResource(null);
  };

  const handleSaveEdit = async () => {
    if (!editingResource) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("footer_resources")
        .update({
          title_en: editingResource.title_en,
          title_it: editingResource.title_it,
          url: editingResource.url,
          category: editingResource.category,
          position: editingResource.position,
        })
        .eq("id", editingResource.id);

      if (error) throw error;

      toast({
        title: "Resource updated",
        description: "Footer resource updated successfully.",
      });

      setEditingResource(null);
    } catch (error) {
      console.error("Error updating footer resource:", error);
      toast({
        title: "Error updating resource",
        description: "Failed to update footer resource.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        setLoading(true);
        const { error } = await supabase.from("footer_resources").delete().eq("id", id);

        if (error) throw error;

        toast({
          title: "Resource deleted",
          description: "Footer resource deleted successfully.",
        });
      } catch (error) {
        console.error("Error deleting footer resource:", error);
        toast({
          title: "Error deleting resource",
          description: "Failed to delete footer resource.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddResource = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.from("footer_resources").insert([newResource]);

      if (error) throw error;

      toast({
        title: "Resource added",
        description: "Footer resource added successfully.",
      });

      setNewResource({
        title_en: "",
        title_it: "",
        url: "",
        category: "",
        position: 0,
      });
    } catch (error) {
      console.error("Error adding footer resource:", error);
      toast({
        title: "Error adding resource",
        description: "Failed to add footer resource.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Footer Resources Manager</h1>

      {/* Add New Resource Form */}
      <Card className="mb-4">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Add New Resource</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title_en">Title (EN)</Label>
              <Input
                type="text"
                id="title_en"
                name="title_en"
                value={newResource.title_en}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="title_it">Title (IT)</Label>
              <Input
                type="text"
                id="title_it"
                name="title_it"
                value={newResource.title_it}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="url">URL</Label>
              <Input type="text" id="url" name="url" value={newResource.url} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                type="text"
                id="category"
                name="category"
                value={newResource.category}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                type="number"
                id="position"
                name="position"
                value={newResource.position}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <Button className="mt-4" onClick={handleAddResource} disabled={loading}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Resource
          </Button>
        </Card>
      </Card>

      {/* Resources List */}
      <h2 className="text-lg font-semibold mb-2">Current Resources</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource) => (
            <Card key={resource.id}>
              <Card className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{resource.title_en}</h3>
                  <p className="text-sm text-gray-500">{resource.url}</p>
                </div>
                <div>
                  {editingResource?.id === resource.id ? (
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={handleSaveEdit} disabled={loading}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={handleCancelEdit} disabled={loading}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(resource)} disabled={loading}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500"
                        onClick={() => handleDelete(resource.id)}
                        disabled={loading}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FooterResourceManager;
