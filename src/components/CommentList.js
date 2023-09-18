import React, { useState } from 'react';

function CommentList({ comments, replies, onDeleteComment, onEditComment, onReplyComment, onReply, onRepEdit, OnRepDelete }) {
  const [editedComment, setEditedComment] = useState({ id: null, text: '' });
  const [replyingComment, setReplyingComment] = useState({ id: null, text: '' });
  const [editedReply, setEditedReply] = useState({ id: null, text: '' });
  const [nextReply, setNextReply] = useState({ id: null, text: '' });

  const handleEditClick = (id) => {
    setEditedComment({ id, text: comments.find((comment) => comment.id === id).text });
  };

  const handleRepEditClick = (id) => {
    setEditedReply({ id, text: replies.find((reply) => reply.id === id).text });
  };

  const handleEditSubmit = () => {
    if (editedComment.id !== null) {
      onEditComment(editedComment.id, editedComment.text);
      setEditedComment({ id: null, text: '' });
    }
  };

  const handleRepEditSubmit = () => {
    if (editedReply.id !== null) {
      onRepEdit(editedReply.id, editedReply.text);
      setEditedReply({ id: null, text: '' });
    }
  };

  const handleFirstReplyClick = (id) => {
    setReplyingComment({ id, text: '' });
  };

  const handleNextReplyClick = (id) => {
    setNextReply({ id, text: '' });
  };

  const handleReplySubmit = (id) => {
    if (replyingComment.id === id && replyingComment.text.trim() !== '') {
      onReplyComment(id, replyingComment.text);
      setReplyingComment({ id: null, text: '' });
    }
  };

  const handleNextReplySubmit = (id) => {
    if (nextReply.id === id && nextReply.text.trim() !== '') {
      onReply(id, nextReply.text);
      setNextReply({ id: null, text: '' });
    }
  };


  
  const renderReplies = (parentId) => {
    const repliesToRender = replies.filter((reply) => reply.parentId === parentId);
    return (
      <ul className="list-disc pl-4" >
      {repliesToRender.map((reply) => (
          <li key={reply.id} className={reply.edited ? 'edited-comment' : ''}>

            <div className='my-4'>
            <strong>{reply.username}:</strong> {reply.text}

            </div>
            <div>
              <em>Date: {reply.date}</em>
              {reply.edited && <em>Edit Time: {reply.editTime}</em>}
            </div>
            {reply.id === editedReply.id ? (
              <div>
                <textarea
                  value={editedReply.text}
                  onChange={(e) => setEditedReply({ id: editedReply.id, text: e.target.value })}
                />
                <button onClick={handleRepEditSubmit}>Submit Edit</button>
              </div>
            ) : (
              <>
                {reply.edited ? <em>* Edited</em> : null}
              {!reply.isDeleted && (
                  <div className="space-x-4 mt-4">
                            <button
                    onClick={() => handleRepEditClick(reply.id)}
                      className="border border-slate-800 rounded-xl px-2 py-1 text-sm text-green-600 hover:text-green-700 focus:outline-none"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => OnRepDelete(reply.id)}
                      className="border border-slate-800 rounded-xl px-2 py-1 text-sm text-red-600 hover:text-red-900 focus:outline-none"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleNextReplyClick(reply.id)}
                      className="border border-slate-800 rounded-xl px-2 py-1 text-sm text-blue-600 hover:text-blue-900 focus:outline-none"
                    >
                      Reply
                    </button>
                
          </div>
        )}

                {reply.id === nextReply.id && (
                  <div>
                    <textarea
                      value={nextReply.text}
                      className="w-full my-2 p-2 border border-gray-300 rounded"
                      placeholder="Your reply..."

                      onChange={(e) => setNextReply({ id: nextReply.id, text: e.target.value })}
                    />
                    <button          className="my-2 px-2 py-1 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:outline-none focus:ring focus:bg-blue-600" onClick={() => handleNextReplySubmit(reply.id)}>Submit  Reply</button>
                  </div>
                )}

                {renderReplies(reply.id)} {/* Recursively render nested replies */}
              </>
            )}
          </li>
        ))}
      </ul>

    );
  };

  return (
    <div>
      <div className='text-[28px] font-bold '> Comments:</div>


      <ul className='list-disc ' >
        {comments.map((comment) => (
          <li key={comment.id} className=" px-2 pb-2 rounded-xl">
                        <div className='my-4'>

            <strong>{comment.username}:</strong> {comment.text}
            </div>
            <div className=' px-2 space-x-2 '>
              <em>Date: {comment.date}</em>
              {comment.edited && <em>Edit Time: {comment.editTime}</em>}
            </div>
            {comment.id === editedComment.id ? (
              <div>
                <textarea
                  value={editedComment.text}
                  
                  onChange={(e) => setEditedComment({ id: editedComment.id, text: e.target.value })}
                />
                <button onClick={handleEditSubmit}>Submit Edit</button>
              </div>
            ) : (
              <>
                {comment.edited ? <em>* Edited </em> : null}

                  {!comment.isDeleted && (
                    <div className='flex justify-between '>
                      <div className="space-x-4 mt-4">
          {!comment.isDeleted && (
            <>
              <button
                onClick={() => handleEditClick(comment.id)}
                className="border border-slate-800 rounded-xl px-2 py-1 text-sm text-green-600 hover:text-green-700 focus:outline-none"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteComment(comment.id)}
                className="border border-slate-800 rounded-xl px-2 py-1 text-sm text-red-600 hover:text-red-900 focus:outline-none"
              >
                Delete
              </button>
              <button
                onClick={() => handleFirstReplyClick(comment.id)}
                className="border border-slate-800 rounded-xl px-2 py-1 text-sm text-blue-600 hover:text-blue-900 focus:outline-none"
              >
                Reply
              </button>
            </>
          )}
      </div>

                    </div>
                  )}


                {comment.id === replyingComment.id && (
       <div className="mt-2">
       <textarea
         value={replyingComment.text}
         onChange={(e) => setReplyingComment({ id: replyingComment.id, text: e.target.value })}
         className="w-full my-2 p-2 border border-gray-300 rounded"
         placeholder="Your reply..."
       />
       <button
         onClick={() => handleReplySubmit(comment.id)}
         className="my-2 px-2 py-1 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:outline-none focus:ring focus:bg-blue-600"
       >
         Submit Reply
       </button>
     </div>
     
                )}

                {renderReplies(comment.id)} {/* Render replies to this comment */}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CommentList;
