import { useState } from 'react'
import { Id, Task } from '../types'
import { TrashIcon } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TaskCard = ({ task, deleteTask, updateTask }: { task: Task, deleteTask: (id: Id) => void, updateTask: (id: Id, content: string) => void }) => {
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task
        },
        disabled: editMode
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    const toggleEditMode = () => {
        setEditMode(prev => !prev);
        setMouseIsOver(false);
    }

    if (editMode) {
        return <div className='bg-slate-950 p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-lime-400 cursor-grab relative' ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <textarea className='h-[90%] w-full resize-none border-none rounded bg-transparent text-white foxus:outline-none' value={task.content} autoFocus
                placeholder='Task content here'
                onBlur={toggleEditMode}
                onKeyDown={e => {
                    if (e.key === 'Enter' && e.shiftKey) toggleEditMode()
                }}
                onChange={e => updateTask(task.id, e.target.value)}
            >
            </textarea>
        </div>
    }

    if (isDragging) {
        return <div ref={setNodeRef} style={style} className='opacity-50 bg-slate-950 p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-lime-400 cursor-grab relative task'></div>
    }

    return (
        <div className='bg-slate-950 p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-lime-400 cursor-grab relative task' ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={toggleEditMode}
            onMouseEnter={() => {
                setMouseIsOver(true);
            }}
            onMouseLeave={() => {
                setMouseIsOver(false);
            }}
        >
            <p className='my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap'>{task.content}</p>
            {mouseIsOver && (
                <button className='stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-slate-700 p-2 rounded opacity-60 hover:opacity-100'
                    onClick={() => { deleteTask(task.id) }}
                >
                    <TrashIcon size={14} /></button>
            )}
        </div>
    )
}

export default TaskCard