//Följande är ett Api som låter react komponenterna prata med servern.

const API_URL = "http://localhost:3000";


export const getEmployees = async () => {
  const response = await fetch(`${API_URL}/employees`);
  const data = await response.json();
  return data;
};

export const getCarModels = async () => {
  const response = await fetch(`${API_URL}/carmodels`);
  const data = await response.json();
  console.log(data);
  return data;
};

export const addCarModel = async (newCarModel) => {
  const response = await fetch(`${API_URL}/carmodels`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCarModel),
  });
  const data = await response.json();
  return data;
};

export const deleteCarModel = async (id) => {
  const response = await fetch(`${API_URL}/carmodels/${id}`, {
    method: "DELETE",
  });
  if (response.ok) {
    return true;
  } else {
    throw new Error("Error while deleting car model");
  }
};

export const getTotalSales = async (id) => {
  const response = await fetch(`${API_URL}/total_sales/${id}`);
  const data = await response.json();
  return data;
};

export const registerUser = async (user) => {
  const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
  });
  return response.json();
}

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  return response.json();
}

export const getUserByName = async (name) => {
  const response = await fetch(`${API_URL}/users/${name}`);
  console.log(name);
  return response.json();
}
