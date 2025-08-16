import { ReactNode } from 'react';

export default function Section({ 
  children, 
  className = '', 
  id 
}: { 
  children: ReactNode; 
  className?: string; 
  id?: string; 
}) {
  return (
    <section id={id} className={`px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto py-10">
        {children}
      </div>
    </section>
  );
}