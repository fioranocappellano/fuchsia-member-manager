
import React, { useState } from 'react';
import { useMemberManager } from '@/frontend/hooks/useMemberManager';
import MemberManagerHeader from '@/frontend/components/admin/members/MemberManagerHeader';
import MemberList from '@/frontend/components/admin/members/MemberList';
import MemberEditForm from '@/frontend/components/admin/members/MemberEditForm';
import { Member } from '@/frontend/types/api';

/**
 * MemberManager component for managing members in the admin panel
 */
const MemberManager = () => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const {
    members,
    loading,
    createMember,
    updateMember,
    deleteMember,
    changePosition,
    refresh
  } = useMemberManager();

  // Handler for updating a member's position in the list
  const handlePositionChange = async (index: number, direction: 'up' | 'down') => {
    if (index >= 0 && index < members.length) {
      const member = members[index];
      if (member?.id) {
        await changePosition(member.id, direction);
      }
    }
  };

  // Form submission handler
  const handleSave = async (memberData: Partial<Member>) => {
    if (selectedMember && selectedMember.id) {
      // Update existing member
      await updateMember({
        ...memberData,
        id: selectedMember.id,
        position: selectedMember.position || 0
      });
    } else {
      // Create new member
      await createMember({
        ...memberData as Omit<Member, "id" | "created_at" | "updated_at">,
        position: members.length + 1
      });
    }
    setSelectedMember(null);
  };

  return (
    <div className="space-y-6">
      <MemberManagerHeader 
        reordering={false}
        dialogOpen={false}
        setDialogOpen={() => {}}
        toggleReordering={() => {}}
        handleAddMember={() => setSelectedMember({}  as Member)}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Members List</h2>
          <MemberList 
            members={members}
            loading={loading}
            reordering={false}
            onEdit={(member) => setSelectedMember(member)}
            onDelete={deleteMember}
            onMoveItem={(id, direction) => {
              const index = members.findIndex(member => member.id === id);
              if (index !== -1) {
                handlePositionChange(index, direction);
              }
            }}
          />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-medium">
            {selectedMember ? 'Edit Member' : 'Add New Member'}
          </h2>
          {selectedMember && (
            <MemberEditForm 
              member={selectedMember} 
              onSave={handleSave} 
              onCancel={() => setSelectedMember(null)} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberManager;
