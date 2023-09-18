import React, { useState, useEffect } from 'react';
import CommentList from './CommentList';
import { v4 as uuidv4 } from 'uuid';

function CommentForm({ user }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    // Load comments and replies from localStorage when the component mounts.
    const storedComments = JSON.parse(localStorage.getItem('comments')) || [];
    const storedReplies = JSON.parse(localStorage.getItem('replies')) || [];
    
    setComments(storedComments);
    setReplies(storedReplies);
  }, []);

  const handleSubmit = () => {
    if (comment.trim() !== '') {
      // Create a new comment object.
      const newComment = {
        id: uuidv4(),
        username: user.username,
        text: comment,
        date: new Date().toLocaleString(),
        isDeleted: false, // Set to false by default
        hasReplies: false

      };
      
      // Get existing comments from localStorage or initialize as an empty array.
      const existingComments = JSON.parse(localStorage.getItem('comments')) || [];

      // Add the new comment to the array of existing comments.
      existingComments.push(newComment);

      // Save the updated comments back to localStorage.
      localStorage.setItem('comments', JSON.stringify(existingComments));

      // Update the comments state to include the new comment.
      setComments(existingComments);

      // Clear the comment input field.
      setComment('');
    }
  };

  const handleDeleteComment = (id) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === id) {
        if (comment.hasReplies) {
          // If the comment has replies, update the text to indicate deletion.
          comment.text = 'User deleted the message';
          comment.edited = true;
          comment.editTime = new Date().toLocaleString();
          comment.isDeleted = true;
        } else {
          // If the comment has no replies, remove it completely.
          return null;
        }
      }
      return comment;
    });
  
    // Filter out null comments (comments to be removed) and update the state.
    const filteredComments = updatedComments.filter((comment) => comment !== null);
    setComments(filteredComments);
  
    // Update localStorage with the filtered comments.
    localStorage.setItem('comments', JSON.stringify(filteredComments));
  };
  

  const handleRepDelete = (id) => {
    const updatedReplies = replies.map((reply) => {
      if (reply.id === id) {
        if (reply.hasReplies) {
          // If the reply has replies, update the text to indicate deletion.
          reply.text = 'User deleted the message';
          reply.edited = true;
          reply.editTime = new Date().toLocaleString();
          reply.isDeleted = true;
        } else {
          // If the reply has no replies, remove it completely.
          return null;
        }
      }
      return reply;
    });
  
    // Filter out null replies (replies to be removed) and update the state.
    const filteredReplies = updatedReplies.filter((reply) => reply !== null);
    setReplies(filteredReplies);
  
    // Update localStorage with the filtered replies.
    localStorage.setItem('replies', JSON.stringify(filteredReplies));
  };
  

    // Define a function to handle comment editing.
    const handleEditComment = (id, newText) => {
      const updatedComments = [...comments];
      const editedComment = updatedComments.find((comment) => comment.id === id);

      editedComment.text = newText;
      editedComment.edited = true;
      editedComment.editTime = new Date().toLocaleString(); // Set editTime to the current time.

      setComments(updatedComments);
      localStorage.setItem('comments', JSON.stringify(updatedComments));
    };


 // Define a function to handle reply editing.
    const handleRepEdit = (id, newText) => {
      const updatedReplies = [...replies];
      const editedReply = updatedReplies.find((reply) => reply.id === id);

      editedReply.text = newText;
      editedReply.edited = true;
      editedReply.editTime = new Date().toLocaleString(); // Set editTime to the current time.

      setReplies(updatedReplies);
      localStorage.setItem('replies', JSON.stringify(updatedReplies));
    };

  
  // Define a function to handle replying to a comment.
  const handleReplyComment = (parentId, reply) => {
    // Create a new reply object.
    const newReply = {
      id: uuidv4(),
      parentId, // Reference to the parent comment.
      username: user.username,
      text: reply,
      date: new Date().toLocaleString(),
      isDeleted: false, // Set to false by default
      hasReplies: false
    };

    // Get existing replies from localStorage or initialize as an empty array.
    const existingReplies = JSON.parse(localStorage.getItem('replies')) || [];

    // Add the new reply to the array of existing replies.
    existingReplies.push(newReply);

    // Find and update the parent comment's hasReplies property to true.
    const updatedComments = comments.map((comment) => {
      if (comment.id === parentId) {
        comment.hasReplies = true;
      }
      return comment;
    });

    // Save the updated replies back to localStorage.
    localStorage.setItem('replies', JSON.stringify(existingReplies));

    // Update the replies state to include the new reply.
    setReplies(existingReplies);
    setComments(updatedComments);

  };

  const handleReply = (parentId, reply) => {
    // Create a new reply object.
    const newReply = {
      id: uuidv4(),
      parentId, // Reference to the parent reply.
      username: user.username,
      text: reply,
      date: new Date().toLocaleString(),
      isDeleted: false, // Set to false by default
      hasReplies: false
    };
  
    // Get existing replies from localStorage or initialize as an empty array.
    const existingReplies = JSON.parse(localStorage.getItem('replies')) || [];
  
    // Add the new reply to the array of existing replies.
    existingReplies.push(newReply);
  
    // Update the parent reply's hasReplies to true.
    const updatedReplies = existingReplies.map((reply) => {
      if (reply.id === parentId) {
        reply.hasReplies = true;
      }
      return reply;
    });
  
    // Save the updated replies back to localStorage.
    localStorage.setItem('replies', JSON.stringify(updatedReplies));
  
    // Update the replies state to include the new reply.
    setReplies(updatedReplies);
  };
  

  return (
    <div className='mx-6 my-4'>
    {user ? (
      <div className="flex flex-col items-center ">
        <textarea
          className="p-2 border-2 border-slate-600 rounded h-[120px] w-[370px]"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className="my-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:bg-blue-600"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>

    ) : (
      <p className="mt-4 text-gray-600 ">Please log in to leave a comment.</p>
    )}


      {/* Pass 'comments', 'replies', and related functions as props to CommentList. */}
      <CommentList
        comments={comments}
        replies={replies}
        onDeleteComment={handleDeleteComment}
        onEditComment={handleEditComment}
        onRepEdit={handleRepEdit}
        OnRepDelete={handleRepDelete}
        onReplyComment={handleReplyComment}
        onReply={handleReply}
      />
    </div>
  );
}

export default CommentForm;
