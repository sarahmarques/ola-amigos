import type { MascotLine, MascotMood } from "@/components/ui/Mascot";
import type { Activity } from "@/lib/types";

/** Activities steer Lua (speech bubble + mood) shown above them. */
export type LuaControl = (line: MascotLine, mood?: MascotMood) => void;

export type ActivityProps<T extends Activity["type"]> = {
  activity: Extract<Activity, { type: T }>;
  onDone: () => void;
  lua: LuaControl;
};
