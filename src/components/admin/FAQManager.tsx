
import React from "react";
import { useFAQManager } from "./faq/useFAQManager";
import FAQManagerHeader from "./faq/FAQManagerHeader";
import FAQList from "./faq/FAQList";
import FAQForm from "./faq/FAQForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";

const FAQManager = () => {
  const {
    faqs,
    loading,
    newFaq,
    dialogOpen,
    editingFaq,
    isSubmitting,
    setDialogOpen,
    setNewFaq,
    setEditingFaq,
    initEditingFaq,
    handleAddFaq,
    handleEditFaq,
    handleDeleteFaq,
    handleToggleActive,
    handleMoveUp,
    handleMoveDown
  } = useFAQManager();

  return (
    <div className="space-y-6">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <FAQManagerHeader 
          setNewFaq={setNewFaq} 
          setDialogOpen={setDialogOpen}
          faqsLength={faqs.length}
        />
        
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-jf-dark border-[#D946EF]/20 text-jf-light">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-[#D946EF]" />
              {editingFaq ? "Edit FAQ" : "Add New FAQ"}
            </DialogTitle>
          </DialogHeader>
          <FAQForm
            editingFaq={editingFaq}
            newFaq={newFaq}
            isSubmitting={isSubmitting}
            onCancel={() => {
              setDialogOpen(false);
              if (editingFaq) {
                initEditingFaq(null);
              }
            }}
            onSubmit={editingFaq ? handleEditFaq : handleAddFaq}
            onChange={editingFaq ? setEditingFaq : setNewFaq}
          />
        </DialogContent>
      </Dialog>

      <FAQList
        faqs={faqs}
        loading={loading}
        onEdit={(faq) => {
          initEditingFaq(faq);
          setDialogOpen(true);
        }}
        onDelete={handleDeleteFaq}
        onToggleActive={handleToggleActive}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        onAddFirstFAQ={() => {
          setDialogOpen(true);
        }}
      />
    </div>
  );
};

export default FAQManager;
