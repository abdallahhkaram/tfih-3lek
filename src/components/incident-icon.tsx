import { SprayCan, Package, Car, Zap, AlertTriangle, LucideProps } from "lucide-react";
import type { IncidentCategory } from "@/lib/types";

interface IncidentIconProps extends LucideProps {
  category: IncidentCategory | string;
}

export function IncidentIcon({ category, ...props }: IncidentIconProps) {
  switch (category) {
    case 'Vandalism':
      return <SprayCan {...props} />;
    case 'Theft':
      return <Package {...props} />;
    case 'Accident':
      return <Car {...props} />;
    case 'Assault':
      return <Zap {...props} />;
    case 'Other':
    default:
      return <AlertTriangle {...props} />;
  }
}
