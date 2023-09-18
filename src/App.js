  import React, { useState, useEffect } from 'react';
  import CommentForm from './components/CommentForm';

  function App() {
    const [user, setUser] = useState(null);
    const [comments, setComments] = useState([]); // Initialize comments state here.

    useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      
      // Load comments from localStorage when the component mounts.
      const storedComments = JSON.parse(localStorage.getItem('comments')) || [];
      setComments(storedComments);
    }, []);

    const handleLogin = () => {
      // For simplicisty, we'll just set a mock user.
      const user = { username: 'user123' };
      setUser(user);

      // Store the user's authentication status in localStorage.
      localStorage.setItem('user', JSON.stringify(user));
    };

    const handleLogout = () => {
      // Log the user out.
      setUser(null);

      // Remove the user's authentication status from localStorage.
      localStorage.removeItem('user');
    };

    // Define a function to update the comments state when a new comment is submitted.
    const updateComments = (newComments) => {
      setComments(newComments);
    };

    return (
      <div className='flex justify-center font-mono bg-slate-300 '>
        <div className='mx-4 my-6'>
                {user ? (
                  <button className='border-2 border-red-500  bg-red-300 font-bold p-1.5 rounded-xl' onClick={handleLogout}>Log Out </button>
                ) : (
                  <button className='border-2 border-blue-500  bg-blue-300 font-bold p-1.5 rounded-xl' onClick={handleLogin}>Log In</button>
                )}
                {/* Pass 'comments' state and the 'updateComments' function as props to CommentForm. */}
                <CommentForm user={user} comments={comments} updateComments={updateComments} />
                {/* Pass 'comments' state as a prop to CommentList. */}
              </div>
      </div>
    );
  }

  export default App;
