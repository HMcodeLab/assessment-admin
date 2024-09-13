import axios from "axios";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

export const REACT_APP_SERVER_DOMAIN = process.env.REACT_APP_SERVER_DOMAIN;

export const adminToken = localStorage.getItem("authToken");

export const Toast = ({ type }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []); 

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      {show && (
        <div
          className={`flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 mx-auto bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 ${
            type === "success"
              ? "bg-green-100 text-green-500"
              : "bg-red-100 text-red-500"
          }`}
          role="alert"
        >
          {/* Icon */}
          {type === "success" ? (
            <svg
              className="w-5 h-5 flex-shrink-0 mr-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 flex-shrink-0 mr-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
          {/* Message */}
          <div className="flex-1">
            <p className="text-sm font-medium">
              {type === "success" ? "Success!" : "Error!"}
            </p>
            <p className="text-sm">
              {type === "success"
                ? "Fetch data successfully."
                : "Error in fetching data."}
            </p>
          </div>
          {/* Close button */}
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-900 focus:outline-none focus:ring focus:ring-gray-300 rounded-md p-1"
            aria-label="Close"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};


export const InstructorDetails = async () => {
  try {
    const response = await axios.get(`${REACT_APP_SERVER_DOMAIN}/instructors`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};

export const studentDetails = async () => {
  try {
    const response = await axios.get(
      `${REACT_APP_SERVER_DOMAIN}/getadmindashdata`
    );
    console.log(response);
    return response;
  } catch (error) {
    <Toast type="danger" />;
    console.log("Error in Fetching data", error);
  }
};

export const studentDetailByEmail = async (email) => {
  try {
    const response = await axios.get(
      `${REACT_APP_SERVER_DOMAIN}/user/${email}`
    );
    console.log(response);
    return response;
  } catch (error) {
    <Toast type="danger" />;
    console.log("Error in Fetching data", error);
  }
};

export const DeleteModal = ({ toggleDeleteModal, deleteAction, id }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto">
      <div
        className="fixed inset-0 bg-gray-700 opacity-50"
        onClick={toggleDeleteModal}
        role="button"
        tabIndex="0"
        aria-label="Close modal"
      ></div>
      <div
        className="absolute bg-white border border-gray-300 rounded-lg shadow-lg outline-none focus:outline-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="relative flex flex-col p-6">
          {/* <h3 className="text-2xl font-semibold">Log out</h3> */}
          <p>Are you sure you want to delete this record?</p>
          <div className="mt-4 flex justify-between">
            <button className="text-red-500" onClick={() => deleteAction(id)}>
              Yes
            </button>
            <button className="text-blue-500" onClick={toggleDeleteModal}>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 
       {logoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={toggleLogoutModal}
          ></div>
          <div
            className="absolute bg-white border border-gray-300 rounded-lg shadow-lg outline-none focus:outline-none"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="relative flex flex-col p-6">
              <h3 className="text-2xl font-semibold">Log out</h3>
              <p>Are you sure you want to log out?</p>
              <div className="mt-4 flex justify-between">
                <button className="text-red-500" onClick={logout}>
                  Yes
                </button>
                <button className="text-blue-500" onClick={toggleLogoutModal}>
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
 */

export const courseDetails = async () => {
  try {
    const response = await axios.get(`${REACT_APP_SERVER_DOMAIN}/courses`);
    console.log(response);
    return response;
  } catch (error) {
    <Toast type="danger" />;
    console.log("Error in Fetching data", error);
  }
};

export const courseDetailsBySlug = async () => {
  const slug=localStorage.getItem("slug");
  try {
    const response = await axios.get(`${REACT_APP_SERVER_DOMAIN}/course/${slug}`);
    console.log(response);
    return response;
  } catch (error) {
    <Toast type="danger" />;
    console.log("Error in Fetching data", error);
  }
};

export const testModules = async () => {
  try {
    const response = await axios.get(
      `${REACT_APP_SERVER_DOMAIN}/getallmodulesadmin`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    console.log(response);
    return response;
  } catch (error) {
    <Toast type="danger" />;
    console.log("Error in Fetching data", error);
  }
};



export const Loader = () => {
  return (
    <div className="flex items-center justify-center gap-5">
      <CircularProgress size={40} />
      <p className="text-3xl font-semibold ">Loading...</p>
    </div>
  );
};

export const internshipDetails = async () => {
  try {
    const response = await axios.get(`${process.env.PUBLIC_URL}/fakeData.json`);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};


export const collegeUsersDetails = async () => {
  try {
    const response = await axios.get(`${REACT_APP_SERVER_DOMAIN}/collegeUsers`,{
      headers: {
        Authorization:`Bearer ${adminToken}`
      }
    })
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export const HRDetails = async () => {
  try {
    const response = await axios.get(`${REACT_APP_SERVER_DOMAIN}/getAllRec`,{
      headers:{
        Authorization:`Bearer ${adminToken}`
      }
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}


export const verifiedHRDetails = async() =>{
  try {
    const response =await HRDetails();
    const hrData = response.data.data;
    if (Array.isArray(hrData)) {
      const verified= hrData.filter((hr) => hr.isVerified);
      console.log(verified);
      return verified;
    } else {
      console.error("HRResponse is not an array");
    }
  } catch (error) {
    console.error("An error occurred while filtering the HR data:", error);
  } 
} 

// export const PAPDetails = async () => {
//   try {
//     const response= await axios.get(`${REACT_APP_SERVER_DOMAIN}/getAllModulesAdmin`,{
//       headers:{
//         Authorization:`Bearer ${adminToken}`
//       }
//     });
//     console.log(response);
//     return response;
//   } catch (error) {
//       console.log(error);
//     }
// }

export const RouteVerify = async () => {
  const navigate = useNavigate();

  try {
    const response = await axios.get(`${REACT_APP_SERVER_DOMAIN}/verifyadminuser${window.location.pathname}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    });
    console.log(response.status)
    if (response.status === 200 || response.data.isValid) {
      console.log('Access granted');
      navigate("/StudentsDetail");
      console.log('Access granted');

      return true;
    } else {
      console.log('Access denied');

      return false;
    }
  } catch (error) {
    if (error.response) {
      console.log('Server responded with an error:', error.response.status);
    } else if (error.request) {
      console.log('No response received from server');
    } else {
      console.log('Error setting up the request:', error.message);
    }
    
    return false;
  }
}