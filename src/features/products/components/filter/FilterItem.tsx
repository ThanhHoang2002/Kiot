/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface FilterItemProps {
  name: string;
  items: any[] | undefined;
  currentValue?: string;
  action: (value: string) => void;
}
const FilterItem = memo(
  ({ items, name, currentValue, action }: FilterItemProps) => {
    const [selectedItem, setSelectedItem] = useState(currentValue || "");
    const handleChange = (value: string) => {
      if (selectedItem === value) {
        setSelectedItem("");
        action("");
        return;
      }
      setSelectedItem(value);
      action(value);
    };
    return (
      <div className="px-2 py-4">
        <h3 className="mb-2 text-lg font-semibold">{name}</h3>
        <div className="flex flex-col gap-2">
          {items?.map((item) => (
            <label
              key={item.value}
              className="flex items-center gap-2 truncate"
            >
              <input
                type="checkbox"
                value={item.value}
                checked={selectedItem.toString() === item.value.toString()}
                onChange={() => handleChange(item.value)}
              />
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger>{item.label}</TooltipTrigger>
                  <TooltipContent>
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
          ))}
        </div>
      </div>
    );
  }
);
FilterItem.displayName = "FilterItem";
export default FilterItem;
