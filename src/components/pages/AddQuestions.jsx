import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddQuestions = () => {
  const [modules, setModules] = useState([]);
  const [submodulearray, setsubmodulearray] = useState([]);
  const [Allmodules, setAllmodules] = useState([])
  const [selectedModule, setSelectedModule] = useState('');
  const [submodule, setsubmodule] = useState([])
  const adminToken = localStorage.getItem('authToken');

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_DOMAIN}/getAllAssessmentForAdmin`,
        {
          headers: {
            Authorization: "Bearer " + adminToken,
          },
        }
      );
      if (response && response.data) {
        const tempmodules = [];
setAllmodules(response.data.data)
        // Iterate over the response data
        response.data.data.forEach((module) => {
            let submodule = [];
        
            // Extract submodules
            module?.Assessmentmodules?.forEach((sub) => {
                submodule.push(sub.module);
            });
        
            // Create a temporary object with dynamic key
            let temp = {
                [module._id]: submodule
            };
        
            // Push the temp object into the modules array
            tempmodules.push(temp);
        });
        console.log(modules);
        
        setModules(tempmodules);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (event) => {
    setSelectedModule(event.target.value);
    console.log(modules[event.target.value]);
    
setsubmodulearray(modules[event.target.value])
    // setsubmodule()
  };
  
  const handlesubmoduleChange = (event) => {
    setsubmodule(event.target.value);
    // setsubmodule()
  };

  return (
    <div className="p-5">
      <div className="flex items-center gap-3 mb-5">
        <label htmlFor="module" className="whitespace-nowrap">
          Select Module:
        </label>
        <select
          name="module"
          id="module"
          value={selectedModule}
          onChange={handleChange}
          className="p-2 rounded border border-gray-300 w-52"
        >
          <option value="" disabled>
            Select a module
          </option>
          {Allmodules?.map((module) => (
            <option key={module._id} value={module._id}>
              {module.assessmentName}
            </option>
          ))}
        </select>
        <label htmlFor="module" className="whitespace-nowrap">
          Select SubModule:
        </label>
        <select
          name="submodule"
          id="submodule"
          value={submodule}
          onChange={handlesubmoduleChange}
          className="p-2 rounded border border-gray-300 w-52"
        >
          <option value="" disabled>
            Select a module
          </option>
          {submodulearray.map((module) => (
            <option key={module._id} value={module._id}>
              {module.name}
            </option>
          ))}
        </select>
        <label htmlFor="fileUpload" className="whitespace-nowrap">
          Choose File:
        </label>
        <input
          type="file"
          id="fileUpload"
          className="p-2 rounded border border-gray-300"
        />
      </div>
    </div>
  );
};

export default AddQuestions;
