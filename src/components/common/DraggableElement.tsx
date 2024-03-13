import React from "react";
import { Droppable } from "react-beautiful-dnd";
import ListItem from "./ListItem";

interface DraggableElementProps {
  prefix: string;
  elements: ItemType[];
}

interface ItemType {
  id: string;
  prefix: string;
  content: string;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ prefix, elements }) => {
  return (
    <div className="droppable">
      <h5>{prefix}</h5>

      <Droppable droppableId={prefix}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {elements.map((item: ItemType, index: number) => (
              <ListItem key={item.id} item={item} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default DraggableElement;
