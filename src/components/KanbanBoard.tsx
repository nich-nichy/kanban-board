import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon"
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null)
    const [activeTask, setActiveTask] = useState<Task | null>(null)
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 3
        }
    }))
    console.log(columns);
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns])

    const generateId = () => {
        return Math.floor(Math.random() * 10001)
    }
    const createNewColumn = () => {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`,
        }
        setColumns([...columns, columnToAdd])
    }
    const deleteColumn = (id: Id) => {
        const filterColumns = columns.filter((col) => col.id !== id);
        setColumns(filterColumns)
        const newTasks = tasks.filter((t) => t.columnId !== id);
        setTasks(newTasks)
    }
    const onDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column)
            return
        }
        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task)
            return
        }
    }
    const onDragEnd = (event: DragEndEvent) => {
        setActiveColumn(null);
        setActiveTask(null);
        const { active, over } = event;
        if (!over) return
        const activeColumnId = active.id;
        const overColumnId = over.id;

        if (activeColumnId === overColumnId) return
        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex(col => col.id === activeColumnId);
            const overColumnIndex = columns.findIndex(col => col.id === overColumnId);
            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        })
    }

    const onDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return
        const activeColumnId = active.id;
        const overColumnId = over.id;

        if (activeColumnId === overColumnId) return;

        const isActiveATask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";

        if (!isActiveATask) return

        if (isActiveATask && isOverATask) {
            setTasks(tasks => {
                const activeIndex = tasks.findIndex(t => t.id === activeColumnId);
                const overIndex = tasks.findIndex(t => t.id === overColumnId);
                tasks[activeIndex].columnId = tasks[overIndex].columnId;
                return arrayMove(tasks, activeIndex, overIndex);
            })
        }

        const isOverColumn = over.data.current?.type === "Column";
        if (isActiveATask && isOverColumn) {
            setTasks(tasks => {
                const activeIndex = tasks.findIndex(t => t.id === activeColumnId);
                tasks[activeIndex].columnId = overColumnId;
                return arrayMove(tasks, activeIndex, activeIndex);
            })
        }
    }

    const updateColumn = (id: Id, title: string) => {
        const newColumns = columns.map(col => {
            if (col.id !== id) return col;
            return {
                ...col,
                title
            }
        })
        setColumns(newColumns);
    }

    const createTask = (columnId: Id) => {
        const newTask: Task = {
            id: generateId(),
            columnId,
            content: `Task ${tasks.length + 1}`
        }
        setTasks([...tasks, newTask])
    }

    const deleteTask = (id: Id) => {
        const newTasks = tasks.filter(task => task.id !== id);
        setTasks(newTasks)
    }

    const updateTask = (id: Id, content: string) => {
        const newTasks = tasks.map(task => {
            if (task.id !== id) return task;
            return {
                ...task,
                content
            }
        })
        setTasks(newTasks)
    }

    return (
        <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-scroll px-[40px]">
            <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} sensors={sensors} onDragOver={onDragOver}>
                <div className="mx-auto flex gap-4">
                    <div className="flex gap-4">
                        <SortableContext items={columnsId}>
                            {columns.map((col) => (
                                <ColumnContainer key={col.id} column={col} deleteColumn={deleteColumn} updateColumn={updateColumn} createTask={createTask} tasks={tasks.filter(task => task.columnId === col.id)} deleteTask={deleteTask} updateTask={updateTask} />
                            ))}
                        </SortableContext>
                        <button
                            onClick={createNewColumn}
                            className="flex h-[60px] w-[350px] min-w-[350px] items-center justify-center gap-2 rounded-lg
                   border-2  bg-[#161C22] text-gray-300 transition-all
                    hover:text-white focus:outline-none focus:ring-2 border-color-background p-2 ring-lime-400 hover:ring-2 "
                        >
                            <PlusIcon />
                            <span className="font-medium">Add Column</span>
                        </button>
                    </div>
                </div>
                {createPortal(
                    <DragOverlay>
                        {activeColumn && <ColumnContainer column={activeColumn}
                            deleteColumn={deleteColumn} updateColumn={updateColumn} createTask={createTask} deleteTask={deleteTask} updateTask={updateTask} tasks={tasks.filter(task => task.columnId === activeColumn.id)} />}
                        {activeTask && <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask} />}
                    </DragOverlay>, document.body
                )}
            </DndContext>
        </div>
    )

}

// function KanbanBoard() {
//     const [columns, setColumns] = useState<Column[]>([]);

//     const generateId = () => Math.floor(Math.random() * 10001);

//     const createNewColumn = () => {
//         const columnToAdd: Column = {
//             id: generateId(),
//             title: `Column ${columns.length + 1}`,
//         };
//         setColumns([...columns, columnToAdd]);
//     };

//     return (
//         <div className="min-h-screen w-full bg-[#0D1117] p-8">
//             <div className="mx-auto max-w-[1400px] overflow-x-auto">
//                 <div className="flex gap-6 p-4">
//                     {columns.map((col) => (
//                         <ColumnContainer key={col.id} column={col} />
//                     ))}

//                     <button
//                         onClick={createNewColumn}
//                         className="flex h-[60px] w-[350px] min-w-[350px] items-center justify-center gap-2 rounded-lg 
//             border-2 border-gray-700 bg-[#161C22] p-4 text-gray-300 transition-all 
//             hover:border-gray-500 hover:bg-[#1C2631] hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
//                     >
//                         <PlusIcon />
//                         <span className="font-medium">Add Column</span>
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }
export default KanbanBoard