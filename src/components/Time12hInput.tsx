import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parseTimeParts, buildTime12h } from "@/lib/format";

export function Time12hInput({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string | null | undefined;
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  const parts = parseTimeParts(value);

  const update = (patch: Partial<typeof parts>) => {
    const next = { ...parts, ...patch };
    onChange(buildTime12h(next.hour, next.minute, next.period));
  };

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-1.5">
        <Select
          disabled={disabled}
          value={parts.hour}
          onValueChange={(h) => update({ hour: h })}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((h) => (
              <SelectItem key={h} value={h}>
                {h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="font-semibold text-muted-foreground">:</span>

        <Select
          disabled={disabled}
          value={parts.minute}
          onValueChange={(m) => update({ minute: m })}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          disabled={disabled}
          value={parts.period}
          onValueChange={(p: "AM" | "PM") => update({ period: p })}
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

