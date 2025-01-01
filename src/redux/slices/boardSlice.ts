import { createSlice } from "@reduxjs/toolkit";

const boardSlice = createSlice({
    name: "kanban",
    initialState: {
        columnsState: [],
        tasksState: []
    },
    reducers: {
        setStateColumns(state, action) {
            state.columnsState = action.payload;
        },
        setStateTasks(state, action) {
            state.tasksState = action.payload;
        },
    },
});

export const { setStateColumns, setStateTasks } = boardSlice.actions;
export default boardSlice.reducer;