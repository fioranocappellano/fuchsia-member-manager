
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
    error,
    createMember,
    updateMember,
    deleteMember,
    updatePosition: updateMemberPosition,
    refresh
  } = useMemberManager();

  // Handler for updating a member's position in the list
  const handlePositionChange = async (index: number, direction: 'up' | 'down') => {
    const member = members[index];
    if (member?.id) {
      await updateMemberPosition(member.id, direction);
    }
  };

  return (
    <div className="space-y-6">
      <MemberManagerHeader 
        onRefresh={refresh} 
        loading={loading} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Members List</h2>
          <MemberList 
            members={members}
            loading={loading}
            error={error}
            onSelect={setSelectedMember}
            onDelete={deleteMember}
            onPositionChange={handlePositionChange}
          />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-medium">
            {selectedMember ? 'Edit Member' : 'Add New Member'}
          </h2>
          <MemberEditForm 
            member={selectedMember}
            onSave={async (member) => {
              if (selectedMember) {
                await updateMember(member);
              } else {
                await createMember(member);
              }
              setSelectedMember(null);
            }}
            onCancel={() => setSelectedMember(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default MemberManager;
