import React, { useState, useEffect } from 'react';
import {registerUser, getUserByName, getEmployees} from '../Api';
import {useNavigate} from 'react-router-dom';

function Home() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const data = await getEmployees();
      setEmployees(data);
    };

    fetchEmployees();
  }, []);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-6 text-center">
          <h2>Welcome to Williams Car Shop!</h2>
          <p>Our wonderful employees are:</p>
          <ul className="list-group mt-4">
            {employees.map(employee => (
              <li key={employee.id} className="list-group-item">{employee.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
