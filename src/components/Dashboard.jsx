import React from 'react'
import { userAuth } from "../context/Authcontext";
import { Link, useNavigate } from 'react-router-dom';
import { handleSignOut } from './SignOut';

const Dashboard = () => {
  const {session, signOut} = userAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Welcome, {session?.user.email}</h2>
      <div>
        <p
          onClick={() => handleSignOut(navigate)}
          className="hover:cursor-pointer border inline-block px-4 py-3 mt-4"
        >
          Sign out
        </p>
      </div>
      <button>
        {" "}
        <Link to="/profile">Go to profile</Link>
      </button>
    </div>
  );
}

export default Dashboard