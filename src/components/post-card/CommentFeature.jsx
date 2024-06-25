import React, { useState } from 'react'
import commentsClose from '../../../public/commentsClose.png'
import commentsOpen from '../../../public/commentsOpen.png'

function CommentFeature({comments, postId, currentUser, setIsComments, isComments}) {
    const [commentCount, setCommentCount] = useState(comments?.length)

    const handleComments = () => {
        setIsComments((prevState)=> !prevState)
    }
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-[2px] items-center">
        <img
          className="cursor-pointer"
          src={isComments ? commentsOpen : commentsClose}
          alt="like"
          width={24}
          height={24}
          onClick={handleComments}
        />
        <div className=" bg-black">
        </div>
        
        <p className="text-white">{commentCount}</p>
      </div>
    </div>
  )
}

export default CommentFeature