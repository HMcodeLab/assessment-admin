import React, { useState, useEffect } from "react";
import axios from "axios";
import toast,{Toaster} from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import Loader from "../Loader";
// import { Toaster } from "react-hot-toast";

const AdminProfile = () => {
  const adminToken = localStorage.getItem("authToken");
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State for editing mode

  const adminEmail= jwtDecode(adminToken).email;
  // console.log(adminEmail);
  

  // Fetch Admin Details
  const fetchAdminDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_DOMAIN}/getAdmin`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          params: {
            email: adminEmail,
          },
        }
      );

      if (response.status === 200) {
        const admin = response.data.data;
        setAdminData(admin);
        // toast.success("Admin details fetched successfully!");
      } else {
        toast.error("Failed to fetch admin details.");
      }

      setLoading(false);
    } catch (error) {
      setError("Error fetching admin details.");
      toast.error("Error fetching admin details.");
      console.error(
        "Fetch error:",
        error.response ? error.response.data : error.message
      );
      setLoading(false);
    }
  };

  // Update Admin Details
  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_DOMAIN}/updateAdmin`,
        adminData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      if (response.status === 201) {
        fetchAdminDetails();
        setIsEditing(false); // Exit editing mode after successful update
        toast.success("Admin details updated successfully!");
      }else{

        toast.error("Failed to update admin details.");
      }
    } catch (error) {
      toast.error("Error updating admin details.");
      console.error(
        "Update error:",
        error.response ? error.response.data : error.message
      );
    }
  };
  let temp = true;
  useEffect(() => {
    if (temp) {
      fetchAdminDetails(); // Fetch the admin details when the component mounts
      temp = false;
    }
  }, []);

  if (loading) {
    return (
      <Loader/>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>{error}</div>
      </div>
    );
  }

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData({
      ...adminData,
      [name]: value,
    });
  };

  return (
    <div className=" flex justify-center bg-gray-50 py-[7vh]">
      <Toaster/>
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full h-[40%] py-12">
        <h1 className="text-3xl font-bold text-green-600 mb-6 text-center">
          Admin Profile
        </h1>
        {adminData && (
          <div>
            {isEditing ? (
              // Input fields for editing
              <div className="flex flex-col gap-2">
                <div className="mb-4">
                  <label className="text-xl font-semibold text-gray-700">
                    First Name:
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={adminData.firstName}
                    onChange={handleChange}
                    className="border p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="text-xl font-semibold text-gray-700">
                    Last Name:
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={adminData.lastName}
                    onChange={handleChange}
                    className="border p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="text-xl font-semibold text-gray-700">
                    Email:
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={adminData.email}
                    onChange={handleChange}
                    className="border p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="text-xl font-semibold text-gray-700">
                    Mobile:
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    value={adminData.mobile}
                    onChange={handleChange}
                    className="border p-2 w-full"
                  />
                </div>
                {/* <div className="mb-4">
                  <label className="text-xl font-semibold text-gray-700">
                    Profile:
                  </label>
                  <input
                    type="text"
                    name="profile"
                    value={adminData.profile}
                    onChange={handleChange}
                    className="border p-2 w-full"
                  />
                </div> */}
                <button
                  onClick={handleUpdate}
                  className="p-3 bg-green-500 text-white rounded-full w-full"
                >
                  Save
                </button>
              </div>
            ) : (
              // Display admin details
              <div>
                <div className="mb-4">
                  <p className="text-xl font-semibold text-gray-700">
                    <strong>Name:</strong> {adminData.firstName}{" "}
                    {adminData.lastName}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-xl font-semibold text-gray-700">
                    <strong>Email:</strong> {adminData.email}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-xl font-semibold text-gray-700">
                    <strong>Role:</strong> {adminData.role}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-xl font-semibold text-gray-700">
                    <strong>Mobile:</strong> {adminData.mobile}
                  </p>
                </div>
                {/* <div className="mb-4">
                  <p className="text-xl font-semibold text-gray-700">
                    <strong>Profile:</strong> {adminData.profile}
                  </p>
                </div> */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-3 w-full flex justify-center items-center bg-green-500 text-white rounded-full"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
