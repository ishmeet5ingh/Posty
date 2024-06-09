import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: JSON.parse(localStorage.getItem("posts")) || null,
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
      localStorage.setItem("posts", JSON.stringify(state.posts));
    },

    createPost: (state, action) => {
      state.posts.push(action.payload);
      localStorage.setItem("posts", JSON.stringify(state.posts));
    },

    deletePost: (state, action) => {
      state.posts.splice(action.payload, 1);
      localStorage.setItem("posts", JSON.stringify(state.posts));
    },

    updatePost: (state, action) => {
      const { id, dbPost } = action.payload;
      state.posts = state.posts.map((post) =>
        post.$id === id ? dbPost : post
      );
      localStorage.setItem("posts", JSON.stringify(state.posts));
    },

    deleteAllPost: (state) => {
      state.posts = null;
      localStorage.setItem("posts", JSON.stringify(state.posts));
    },
  },
});

export const { setPosts, createPost, deletePost, updatePost, deleteAllPost } =
  configSlice.actions;

export default configSlice.reducer;
