
import { GadgetHealth } from "@/utils/gadget/types";
import { GadgetStatusIcon, GadgetStatusBadge } from "./GadgetStatusIndicators";

interface GadgetComponentsGridProps {
  components: GadgetHealth['components'];
}

export const GadgetComponentsGrid = ({ components }: GadgetComponentsGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-2 text-sm">
      {Object.entries(components).map(([name, details]) => (
        <div key={name} className="flex items-center justify-between p-2 border rounded-md">
          <div className="flex items-center gap-2">
            <GadgetStatusIcon status={details.status} />
            <span className="capitalize">{name}</span>
          </div>
          <GadgetStatusBadge status={details.status} />
        </div>
      ))}
    </div>
  );
};
