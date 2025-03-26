
import React, { useState } from "react";
import { useFAQManager } from "./faq/useFAQManager";
import FAQManagerHeader from "./faq/FAQManagerHeader";
import FAQList from "./faq/FAQList";
import FAQForm from "./faq/FAQForm";
import { NewFAQ, FAQ } from "@/frontend/types/api";

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
    initEditingFaq,
    fetchFAQs,
    handleAddFaq,
    handleEditFaq,
    handleDeleteFaq,
    handleToggleActive,
    handleMoveUp,
    handleMoveDown
  } = useFAQManager();

  // State for reordering mode
  const [reordering, setReordering] = useState(false);
  
  // Handlers to map to the expected prop names
  const handleEdit = initEditingFaq;
  const handleDelete = handleDeleteFaq;
  const handleUpdate = handleEditFaq;
  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up') {
      return handleMoveUp(index);
    } else {
      return handleMoveDown(index);
    }
  };
  const toggleReordering = () => setReordering(prev => !prev);

  return (
    <div>
      {!editingFaq && (
        <FAQManagerHeader
          handleAddFAQ={handleAddFaq}
          reordering={reordering}
          setDialogOpen={setDialogOpen}
          toggleReordering={toggleReordering}
        />
      )}
      
      <h2 className="text-xl font-bold mb-4 text-white/90 mt-8">
        {reordering ? 'Use arrows to reorder FAQs' : 'Current FAQs'}
      </h2>

      {editingFaq ? (
        <FAQForm 
          faq={editingFaq} 
          onSave={handleUpdate} 
          onCancel={() => initEditingFaq(null)} 
        />
      ) : (
        <FAQList
          faqs={faqs}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          moveItem={moveItem}
          reordering={reordering}
        />
      )}
    </div>
  );
};

export default FAQManager;
