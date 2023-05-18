import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEmployees, getTotalSales } from '../Api';
import {useLocation} from 'react-router-dom';

function Profile() {
  const { username } = useParams();
  const [employee, setEmployee] = useState(null);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    const fetchEmployeeAndSales = async () => {
      const employees = await getEmployees();
      const matchedEmployee = employees.find((employee) => employee.name === username);
      if (matchedEmployee) {
        const sales = await getTotalSales(matchedEmployee.id);
        setEmployee(matchedEmployee);
        setTotalSales(sales);
      }
    };

    fetchEmployeeAndSales();
  }, [username]);

  return (
<div className="container">
  <div className="row justify-content-center">
    <div className="col-6">
      <div className="text-center">
        <h2 className="mb-4">Profile</h2>
      </div>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{username}</h5>
          {employee && (
            <>
              <p className="card-text">Employee ID: {employee.id}</p>
              <p className="card-text">Total sales: {totalSales[0].total_sales}</p>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
</div>

  );
}

export default Profile;

