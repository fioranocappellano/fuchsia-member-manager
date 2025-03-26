
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { Check, ChevronDown, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Language selector component for switching between available languages
 */
const LanguageSelector = () => {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // Available languages with their display names
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'it', name: 'Italiano' },
  ];

  // Get current language display name
  const currentLanguage = languages.find(lang => lang.code === locale)?.name || 'English';

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Languages className="h-4 w-4 mr-1" />
          {currentLanguage}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => {
              setLocale(language.code as 'en' | 'it');
              setIsOpen(false);
            }}
            className="flex items-center justify-between"
          >
            {language.name}
            {locale === language.code && (
              <Check className="h-4 w-4 ml-2" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
