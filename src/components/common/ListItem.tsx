import React from "react";
import { Draggable, DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";

interface ItemType {
  id: string;
  prefix: string;
  content: string;
}

interface ListItemProps {
  item: ItemType;
  index: number;
}

const ListItem: React.FC<ListItemProps> = ({ item, index }) => {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
        return (
          <div
            className={`drag-item ${snapshot.isDragging ? "dragging" : ""}`}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <span>{item.content}</span>
            {/* <h4>{item.prefix}</h4> */}
          </div>
        );
      }}
    </Draggable>
  );
};

export default ListItem;
