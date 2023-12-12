import { SheetProvider } from "@/hooks/useSheet";
import Sheet from "@/components/Sheet";

const SheetDetail = () => {
  return (
    <SheetProvider>
      <Sheet />
    </SheetProvider>
  );
};

export default SheetDetail;
