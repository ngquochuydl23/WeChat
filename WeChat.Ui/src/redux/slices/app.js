import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    slidebar:{
        open : false,
        type : "CONTACT",
    }
};

const slice = createSlice({
    name: "app",
    initialState,
    reducers:{
        toggleSlidebar(state, action){
            state.sidebar.open = !state.sidebar.open;

        },
        updateSideBarType(state, action){
        state.sidebar.type = action.payload.type;
        }
    }
})

export default slice.reducer;

export function ToggleSidebar(){
    return async (dispatch , getState)=> {
        dispatch(slice.actions.toggleSidebar())
    }
}

export function UpdateSideBarType(type){
    return async (dispatch, getState)=>{
        dispatch(
            slice.actions.updateSideBarType({
                type,
            })
        )
    }
}