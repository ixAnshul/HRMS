import React, { useState, useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import DraggableElement from "./DraggableElement";
import "./Taskmanager.css"

interface ItemType {
  id: string;
  prefix: string;
  content: string;
  status: string;
}

const TaskManager: React.FC = () => {
  const lists = ["todo", "inProgress", "done"];

//   Sample data for tasks with status
  const todoItems: ItemType[] = [
    { id: "todo-1", prefix: "todo", content: "Task 1", status: "todo" },
    { id: "todo-2", prefix: "todo", content: "Task 2", status: "todo" },
    { id: "todo-3", prefix: "todo", content: "Task 3", status: "todo" },
    { id: "inProgress-1", prefix: "inProgress", content: "Task 4", status: "inProgress" },
    { id: "done-1", prefix: "done", content: "Task 5", status: "done" },
  ];

  const generateLists = () =>
    lists.reduce((acc, listKey) => ({
      ...acc,
      [listKey]: todoItems.filter((item) => item.status === listKey),
    }), {});

  const [elements, setElements] = useState<{ [key: string]: ItemType[] }>(generateLists);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const listCopy: { [key: string]: ItemType[] } = { ...elements };
    const sourceList = listCopy?.[result.source.droppableId];

    if (!sourceList) {
      return;
    }

    const [removedElement, newSourceList] = removeFromList(
      sourceList,
      result.source.index
    );

    listCopy[result.source.droppableId] = newSourceList;
    const destinationList = listCopy[result.destination.droppableId];
    if (!destinationList) {
      return;
    }

    listCopy[result.destination.droppableId] = addToList(
      destinationList,
      result.destination.index,
      removedElement
    );
    setElements(listCopy);
  };

  const removeFromList = (list: ItemType[], index: number): [ItemType, ItemType[]] => {
    const result = Array.from(list);
    const [removed] = result.splice(index, 1);
    return [removed, result];
  };

  const addToList = (list: ItemType[], index: number, element: ItemType): ItemType[] => {
    const result = Array.from(list);
    result.splice(index, 0, element);
    return result;
  };

  useEffect(() => {
    // Simulate fetching data from an API
    // In this case, we're using static data, so no API call is needed
    setElements(generateLists());
  }, []); // Empty dependency array means this effect runs only once on mount

  return (
    <>
    <div className="flex justify-center m-5">
        Tasks Management
    </div>
    <div className="flex justify-center m-8">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="list-grid">
          {lists.map((listKey) => (
            <Droppable key={listKey} droppableId={listKey}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="droppable"
                >
                  <DraggableElement
                    key={listKey}
                    prefix={listKey}
                    elements={elements[listKey]}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
    </>
  );
};

export default TaskManager;
