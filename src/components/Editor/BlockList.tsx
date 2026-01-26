'use client';

import { Plus } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditorStore } from '@/stores/editor-store';
import ContentBlock from './ContentBlock';
import Button from '@/components/UI/Button';

function SortableBlock({ blockId }: { blockId: string }) {
  const block = useEditorStore((state) =>
    state.post.blocks.find((b) => b.id === blockId)
  );
  const updateBlock = useEditorStore((state) => state.updateBlock);
  const removeBlock = useEditorStore((state) => state.removeBlock);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: blockId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!block) return null;

  return (
    <div ref={setNodeRef} style={style}>
      <ContentBlock
        block={block}
        onUpdate={(data) => updateBlock(blockId, data)}
        onDelete={() => removeBlock(blockId)}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export default function BlockList() {
  const blocks = useEditorStore((state) => state.post.blocks);
  const addBlock = useEditorStore((state) => state.addBlock);
  const reorderBlocks = useEditorStore((state) => state.reorderBlocks);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);

      reorderBlocks(oldIndex, newIndex);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-neutral-700">
          Content Blocks
        </h3>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={addBlock}
        >
          <Plus className="h-4 w-4 mr-1" />
          Block hinzufügen
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block) => (
            <SortableBlock key={block.id} blockId={block.id} />
          ))}
        </SortableContext>
      </DndContext>

      {blocks.length === 0 && (
        <div className="text-center py-8 text-neutral-500 border-2 border-dashed border-neutral-300 rounded-lg">
          Noch keine Blocks vorhanden. Klicke auf "Block hinzufügen" um zu
          starten.
        </div>
      )}
    </div>
  );
}
