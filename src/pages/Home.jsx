import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { PostCard, PostCardSkeletonLoading } from "../components";
import { useDispatch, useSelector } from "react-redux";
import "../index.css";
import { setPosts, deleteAllPost } from "../store/configSlice";
import { Circles } from "react-loader-spinner";
import LoadingSpinner from "../components/animation/loader";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const authStatus = useSelector((state) => state.auth.status);
  const dispatch = useDispatch();

  let posts = useSelector((state) => state.config.posts);
  console.log(posts);

  useEffect(() => {
    if (!authStatus) {
      dispatch(deleteAllPost());
    }
  }, [authStatus]);

  // if (posts === null && authStatus !== "false") {
  //   return (
  //     <>
  //           {authStatus ? (
  //             <h1 className="text-white">
  //               <PostCardSkeletonLoading/>
  //             </h1>
  //           ) : (
  //     <div className="py-8 sm:w-96 text-center min-h-screen">
  //       <div className="flex flex-wrap">
  //         <div className="p-2 w-full">
  //             <h1 className="text-2xl font-bold text-white">
  //               Login to read posts
  //             </h1>
  //         </div>
  //       </div>
  //     </div>
  //           )}
  //     </>
  //   );
  // } else {
    return (
      <>
      {posts !== null
        ? posts.map((post, index) => (
            <div key={post?.$id} className="w-full">
              <PostCard {...post} idx={index} />
            </div>
          ))
        : [1, 2, 3, 4].map((_, index) => (
            <div key={index} className="w-full">
              <PostCardSkeletonLoading />
            </div>
          ))}
    </>
    );
  // }
}

export default Home;
