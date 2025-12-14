import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { PlusCircle } from 'lucide-react';

interface AppHeaderProps {
  onReportClick: () => void;
}

export function AppHeader({ onReportClick }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-card z-10 shadow-sm">
      <div className="flex items-center gap-2">
        <Logo className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-bold tracking-tight text-foreground font-headline">
          SafeSpot
        </h1>
      </div>
      <Button onClick={onReportClick} variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
        <PlusCircle className="mr-2 h-4 w-4" />
        Report Incident
      </Button>
    </header>
  );
}
