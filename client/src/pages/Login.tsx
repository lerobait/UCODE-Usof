import React from 'react';
import Input from '../components/Common/Input';
import Button from '../components/Common/Button';

const Login: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Login Page</h1>
      <form className="bg-white shadow-md rounded-lg p-8 w-96">
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Enter login"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <Input
            type="email"
            placeholder="Enter email"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-6">
          <Input
            type="password"
            placeholder="Enter password"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <Button className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition duration-200">
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
