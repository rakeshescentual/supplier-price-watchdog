
import { useState, useCallback } from 'react';

interface UseDocumentSectionProps {
  initialSection?: string;
}

export const useDocumentSection = ({ initialSection = '' }: UseDocumentSectionProps = {}) => {
  const [activeSection, setActiveSection] = useState<string>(initialSection);
  
  const handleSectionClick = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  
  return {
    activeSection,
    setActiveSection,
    handleSectionClick
  };
};
