import { useEffect, useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon"
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { useVerifyToken } from '../utils/VerifyRole'
import Navbar from "./Navbar";
import { useDispatch } from "react-redux";
import { setStateColumns, setStateTasks } from '../redux/slices/boardSlice';
import axios from "axios";
import Cookies from "js-cookie";

const url = import.meta.env.VITE_BACKEND_URL;

function KanbanBoard() {
    useVerifyToken();
    const [columns, setColumns] = useState<Column[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 3 } }));
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
    const dispatch = useDispatch();
    const token = Cookies.get("token");


    const fetchBoardData = async () => {
        try {
            const response = await axios.get(`${url}/board/get-board/${token}`);
            if (response.data.success) {
                setColumns(response.data.data.columns);
                setTasks(response.data.data.tasks);
            }
        } catch (error) {
            console.error("Error fetching board data:", error);
        }
    };


    const createNewColumn = async () => {
        const columnToAdd: Column = { id: Date.now(), title: `Column ${columns.length + 1}` };
        setColumns((prev) => [...prev, columnToAdd]);

    };

    const deleteColumn = async (id: Id) => {
        setColumns((prev) => prev.filter((col) => col.id !== id));
        setTasks((prev) => prev.filter((task) => task.columnId !== id));

    };

    const createTask = async (columnId: Id) => {
        const newTask: Task = { id: Date.now(), columnId, content: `Task ${tasks.length + 1}` };
        setTasks((prev) => [...prev, newTask]);

    };

    const deleteTask = async (id: Id) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));

    };

    const onDragStart = (event: DragStartEvent) => {
        try {
            if (event.active.data.current?.type === "Column") {
                setActiveColumn(event.active.data.current.column);
            } else if (event.active.data.current?.type === "Task") {
                setActiveTask(event.active.data.current.task);
            }
        } catch (error) {
            console.error("Error on drag start:", error);
        }
    };

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

    const onDragEnd = async (event: DragEndEvent) => {
        try {
            setActiveColumn(null);
            setActiveTask(null);

            const { active, over } = event;
            if (!over) return;

            const activeId = active.id;
            const overId = over.id;

            if (activeId === overId) return;

            if (active.data.current?.type === "Column") {
                setColumns((prev) => {
                    const activeIndex = prev.findIndex((col) => col.id === activeId);
                    const overIndex = prev.findIndex((col) => col.id === overId);
                    if (activeIndex === -1 || overIndex === -1) return prev;
                    return arrayMove(prev, activeIndex, overIndex);
                });
            } else if (active.data.current?.type === "Task") {
                setTasks((prev) => {
                    const activeIndex = prev.findIndex((task) => task.id === activeId);
                    const overIndex = prev.findIndex((task) => task.id === overId);

                    if (activeIndex === -1 || overIndex === -1) return prev;

                    const updatedTasks = [...prev];
                    updatedTasks[activeIndex] = {
                        ...updatedTasks[activeIndex],
                        columnId: updatedTasks[overIndex]?.columnId || active?.data?.current?.columnId,
                    };
                    return arrayMove(updatedTasks, activeIndex, overIndex);
                });
            }
        } catch (error) {
            console.error("Error on drag end:", error);
        }
    };



    useEffect(() => {
        fetchBoardData();
    }, []);

    useEffect(() => {
        dispatch(setStateColumns(columns));
        dispatch(setStateTasks(tasks));
    }, [columns, tasks, dispatch]);

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

    const onDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;
        const activeColumnId = active.id;
        const overColumnId = over.id;

        if (activeColumnId === overColumnId) return;

        const isActiveATask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";

        if (!isActiveATask) return;

        if (isActiveATask && isOverATask) {
            setTasks((prev) => {
                const activeIndex = prev.findIndex((t) => t.id === activeColumnId);
                const overIndex = prev.findIndex((t) => t.id === overColumnId);

                const updatedTasks = [...prev];
                updatedTasks[activeIndex] = {
                    ...updatedTasks[activeIndex],
                    columnId: updatedTasks[overIndex].columnId,
                };

                return arrayMove(updatedTasks, activeIndex, overIndex);
            });
        }

        const isOverColumn = over.data.current?.type === "Column";
        if (isActiveATask && isOverColumn) {
            setTasks((prev) => {
                const activeIndex = prev.findIndex((t) => t.id === activeColumnId);

                const updatedTasks = [...prev];
                updatedTasks[activeIndex] = {
                    ...updatedTasks[activeIndex],
                    columnId: overColumnId,
                };

                return updatedTasks;
            });
        }
    };

    return (
        <div>
            <Navbar />
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
        </div>
    )
}


export default KanbanBoard