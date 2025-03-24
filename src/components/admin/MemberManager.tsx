
import React from "react";
import { useMemberManager } from "./members/useMemberManager";
import MemberManagerHeader from "./members/MemberManagerHeader";
import MemberList from "./members/MemberList";
import MemberEditForm from "./members/MemberEditForm";

const MemberManager = () => {
  const {
    members,
    loading,
    editingMember,
    reordering,
    dialogOpen,
    setDialogOpen,
    handleEdit,
    handleDelete,
    handleUpdate,
    handleAddMember,
    toggleReordering,
    moveItem,
    setEditingMember
  } = useMemberManager();

  return (
    <div>
      {!editingMember && (
        <MemberManagerHeader
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          reordering={reordering}
          toggleReordering={toggleReordering}
          handleAddMember={handleAddMember}
        />
      )}
      
      <h2 className="text-xl font-bold mb-4 text-white/90 mt-8">
        {reordering ? 'Use arrows to reorder members' : 'Current Team Members'}
      </h2>

      {editingMember ? (
        <MemberEditForm 
          member={editingMember} 
          onSave={handleUpdate} 
          onCancel={() => setEditingMember(null)} 
        />
      ) : (
        <MemberList
          members={members}
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

export default MemberManager;
