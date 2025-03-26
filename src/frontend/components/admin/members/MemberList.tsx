
import { Member } from "@/frontend/types/api";
import { Button } from "@/frontend/components/ui/button";
import { Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Skeleton } from "@/frontend/components/ui/skeleton";
import { normalizeImageUrl } from "@/frontend/utils/imageUtils";

interface MemberListProps {
  members: Member[];
  loading: boolean;
  reordering: boolean;
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
  onMoveItem: (index: number, direction: "up" | "down") => void;
}

const MemberList: React.FC<MemberListProps> = ({
  members,
  loading,
  reordering,
  onEdit,
  onDelete,
  onMoveItem
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-black/20 border border-white/10 rounded-lg p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-12 bg-black/20 border border-white/10 rounded-lg">
        <h3 className="text-xl font-medium text-gray-400">No team members added yet</h3>
        <p className="text-gray-500 mt-1">Click "Add Member" to add the first team member</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {members.map((member, index) => (
        <div 
          key={member.id} 
          className="bg-black/20 border border-white/10 rounded-lg p-6 transition-all hover:border-white/20"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-24 h-24 overflow-hidden rounded-full border border-white/10">
              <img 
                src={normalizeImageUrl(member.image)} 
                alt={member.name} 
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-medium text-white">{member.name}</h3>
              <p className="text-[#D946EF] mb-2">{member.role}</p>
              
              <div className="text-sm text-gray-400">
                <div className="mb-2">
                  {member.join_date && (
                    <span className="mr-4">Joined: {member.join_date}</span>
                  )}
                  {member.smogon && (
                    <a 
                      href={member.smogon} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      Smogon Profile
                    </a>
                  )}
                </div>
                
                <ul className="space-y-1">
                  {member.achievements.map((achievement, i) => (
                    <li key={i} className="flex items-start max-w-xl">
                      <span className="text-[#D946EF] mr-2">•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="flex md:flex-col justify-end gap-2 mt-4 md:mt-0">
              {reordering ? (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onMoveItem(index, "up")}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onMoveItem(index, "down")}
                    disabled={index === members.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => onEdit(member)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-8 w-8 border-red-800/40 hover:bg-red-900/20 hover:text-red-400"
                    onClick={() => onDelete(member.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemberList;
