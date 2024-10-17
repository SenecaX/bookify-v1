import { Button } from "@mui/material";

interface SlotButtonProps {
    slot: string;
    onSelect: (slot: string) => void;
  }
  
  export const SlotButton: React.FC<SlotButtonProps> = ({ slot, onSelect }) => (
    <Button
      variant="contained"
      color="primary"
      fullWidth
      sx={{ mb: 2 }}
      onClick={() => onSelect(slot)}
    >
      {slot}
    </Button>
  );
  