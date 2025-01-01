import { useMemo, useState } from 'react'
import { Column, Id, Task } from '../types'
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';

interface Props {
    column: Column,
    deleteColumn: (id: Id) => void,
    updateColumn: (id: Id, title: string) => void;
    createTask: (columnId: Id) => void;
    deleteTask: (id: Id) => void;
    tasks: Task[];
    updateTask: (id: Id, content: string) => void;
}

// const ColumnContainer = (props: Props) => {
//     const { column } = props
//     return (
//         <div className='bg-color-background w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col'>
//             <div className='flex gap-2'>
//                 <div className='bg-slate-700 text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-color-background'>
//                     <div className='flex justify-center items-center bg-slate-700 px-2 py-1 text-sm'>0</div>
//                     {column.title}
//                 </div>
//             </div>
//             <div className='flex flex-grow'>Content</div>
//             <div>Footer</div>
//         </div>
//     )
// }

const ColumnContainer = ({ column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask }: Props) => {
    const [editMode, setEditMode] = useState(false);
    const tasksIds = useMemo(() => {
        return tasks.map(task => task.id);
    }, [tasks])
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column
        },
        disabled: editMode
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    if (isDragging) {
        return <div className='flex w-[350px] h-[500px] max-h-[500px] flex-col rounded-lg bg-[#161C22] shadow-lg opacity-40 border-2 border-lime-400'></div>
    }

    return (
        <div className="flex w-[350px] h-[500px] max-h-[500px] flex-col rounded-lg bg-[#161C22] shadow-lg" ref={setNodeRef} style={style}>
            <div {...attributes} {...listeners}
                onClick={() => setEditMode(true)}
                className="flex items-center justify-between border-b bg-slate-950 m-2 p-2" >
                <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-gray-700 text-md font-medium text-gray-300">
                        0
                    </span>
                    <h3 className="text-md font-semibold text-gray-200" onKeyDown={e => {
                        if (e.key !== "Enter") return;
                        setEditMode(false);
                    }}>
                        {!editMode && column.title}
                        {editMode && <input className='bg-black focus:ring-lime-400 border-rounded rounded focus:ring-1 outline-none px-2' autoFocus onBlur={() => setEditMode(false)} value={column.title} onChange={e => updateColumn(column.id, e.target.value)} />}
                    </h3>
                </div>
                <button className='stroke-gray-500 hover:bg-gray-700 rounded px-1 py-2 hover:stroke-red-400' onClick={() => deleteColumn(column.id)}><Trash2Icon className='' /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                {tasks?.length === 0 ? <div className="h-full rounded-md border-2 border-dashed border-gray-700 p-4 text-gray-400">
                    Drop tasks here
                </div> :
                    <div className='flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto'>
                        <SortableContext items={tasksIds}>
                            {tasks?.map((task) => (
                                <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} />
                            ))}
                        </SortableContext>
                    </div>
                }

            </div>
            {/* 
            <div className='flex flex-grow'>
               
            </div> */}

            <div className="border-t border-gray-700 p-3">
                <button className="w-full flex gap-2 justify-center items-center rounded-md bg-[#1C2631] p-2 text-sm text-gray-300 hover:bg-[#243242] hover:text-white" onClick={() => {
                    createTask(column.id)
                }}>
                    <PlusIcon />
                    Add Task
                </button>
            </div>
        </div>
    );
}


export default ColumnContainer