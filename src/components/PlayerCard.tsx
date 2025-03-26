
import { useState } from 'react';
import { Calendar, User, Award, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * PlayerCard component for displaying member information
 */
interface PlayerCardProps {
  id: string;
  name: string;
  image: string;
  role: string;
  achievements?: string[];
  joinDate: string;
  smogon?: string;
  index: number;
}

const PlayerCard = ({ 
  id, 
  name, 
  image, 
  role, 
  achievements = [], 
  joinDate,
  smogon,
  index
}: PlayerCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const formattedDate = joinDate ? format(new Date(joinDate), 'MMMM yyyy') : 'N/A';
  
  // Alternate card layouts for visual interest
  const isEven = index % 2 === 0;
  
  return (
    <div 
      className={`group relative rounded-xl overflow-hidden border border-white/10 shadow-lg transition-all duration-300 hover:border-[#D946EF]/30 hover:shadow-[#D946EF]/5 bg-gray-900/60 hover:bg-gray-900/80`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col md:flex-row gap-6 p-6">
        {/* Profile Image */}
        <div className="relative w-full md:w-1/3 flex-shrink-0">
          <div className="relative rounded-lg overflow-hidden aspect-square">
            <img 
              src={image || '/placeholder.svg'} 
              alt={name} 
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80"></div>
          </div>
          
          {/* Smogon Profile Link */}
          {smogon && (
            <div className="absolute bottom-3 left-3 right-3">
              <Button 
                variant="outline" 
                className="w-full border-white/20 bg-black/50 hover:bg-black/70 text-xs"
                onClick={() => window.open(`https://www.smogon.com/forums/members/${smogon}`, '_blank')}
              >
                <ExternalLink className="mr-1 h-3 w-3" />
                Smogon Profile
              </Button>
            </div>
          )}
        </div>
        
        {/* Player Info */}
        <div className={`flex-1 flex flex-col ${isEven ? 'justify-between' : 'justify-start space-y-4'}`}>
          <div>
            <h3 className="text-2xl font-bold mb-1 group-hover:text-[#D946EF] transition-colors">
              {name}
            </h3>
            <p className="text-gray-400 mb-3 italic flex items-center">
              <User className="h-4 w-4 mr-1 opacity-70" />
              {role}
            </p>
          </div>
          
          {/* Achievements */}
          {achievements && achievements.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-300 mb-1">
                <Award className="h-4 w-4 mr-1 text-yellow-500" />
                Achievements:
              </div>
              <div className="flex flex-wrap gap-2">
                {achievements.map((achievement, i) => (
                  <TooltipProvider key={i}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="bg-gray-800/60">
                          {achievement.length > 20 ? `${achievement.substring(0, 20)}...` : achievement}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{achievement}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-auto text-sm text-gray-400 flex items-center pt-2">
            <Calendar className="h-4 w-4 mr-1 opacity-70" />
            Member since: {formattedDate}
          </div>
        </div>
      </div>
      
      {/* Decorative hover effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`}></div>
    </div>
  );
};

export default PlayerCard;
