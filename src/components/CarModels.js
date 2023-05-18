import React, { useState, useEffect } from 'react';
import { getCarModels, addCarModel, deleteCarModel } from '../Api';

function CarModels() {

  const [carModels, setCarModels] = useState([]);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");

  //Hämtar alla bilmodller och sparar det i ett state (carModels)
  useEffect(() => {
    const fetchCarModels = async () => {
      const models = await getCarModels();
      setCarModels(models);
    };

    fetchCarModels();
  }, []);

  //Används vid onSubmit när man skamlägga till en ny bil
  const handleAddCarModel = async (event) => {
    event.preventDefault();
    const newCarModel = { brand, model, price: parseInt(price, 10) };
    const carModel = await addCarModel(newCarModel);
    setCarModels([...carModels, carModel]);
    setBrand("");
    setModel("");
    setPrice("");
  };

  //Samma fast när man ska ta bort en bil
  const handleDeleteCarModel = async (id) => {
    await deleteCarModel(id);
    setCarModels(carModels.filter((model) => model.id !== id));
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-6">
          <div className="text-center">
            <h2 className="mb-4">Car Models</h2>
          </div>
          {carModels.map((model) => (
            <div key={model.id} className="card mb-3">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="card-text mb-0">{model.brand} {model.model}</p>
                  <p className="card-text"><small className="text-muted">Price: {model.price}</small></p>
                </div>
                <button className="btn btn-danger" onClick={() => handleDeleteCarModel(model.id)}>Delete</button>
              </div>
            </div>
          ))}
          <div className="card mt-5">
            <div className="card-body">
              <h4 className="card-title mb-4">Add New Car</h4>
              <form onSubmit={handleAddCarModel}>
                <div className="mb-3">
                  <label htmlFor="brand" className="form-label">Brand:</label>
                  <input type="text" id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="model" className="form-label">Model:</label>
                  <input type="text" id="model" value={model} onChange={(e) => setModel(e.target.value)} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">Price:</label>
                  <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="form-control" required />
                </div>
                <button type="submit" className="btn btn-primary">Add Car Model</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarModels;

