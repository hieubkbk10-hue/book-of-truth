import type { MindElixirData } from "mind-elixir";
import { MindMap, MindMapControls } from "@/components/ui/mindmap";

interface MindmapViewerProps {
  data: MindElixirData;
}

export const MindmapViewer = ({ data }: MindmapViewerProps) => {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="mb-3 text-sm font-medium text-zinc-700">Sơ đồ tư duy</div>
      <div className="relative h-[420px] w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
        <MindMap data={data} readonly fit locale="en">
          <MindMapControls position="top-right" />
        </MindMap>
      </div>
    </div>
  );
};
