import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

const AddMember = () => {
  const [category, setCategory] = useState([]);
  const [values, setValues] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    contact: "",
    image: "",
    medical: "",
    dob: "",
    gender: "",
    packageID: "",
    categoryID: "",
    registerDate: "",
  });
  const [errors, setErrors] = useState({});
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const navigate = useNavigate();
  const [Package, setPackage] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/auth/package")
      .then((result) => {
        if (result.data.Status) {
          setPackage(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    axios.get("http://localhost:3000/train/category")
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log("There was an error fetching the categories!", err));
  }, []);

  const validate = () => {
    let tempErrors = {};
    tempErrors.name = values.name ? "" : "Name is required.";
    tempErrors.username = values.username ? "" : "Username is required.";
    tempErrors.password = values.password ? "" : "Password is required.";
    tempErrors.email = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email) ? "" : "Email is not valid.";
    tempErrors.contact = values.contact.length === 10 ? "" : "Contact must be 10 digits.";
    tempErrors.gender = values.gender ? "" : "Gender is required.";
    tempErrors.packageID = values.packageID ? "" : "Package is required.";
    tempErrors.categoryID = values.categoryID ? "" : "Category is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const checkUsernameAvailability = debounce(async (username) => {
    if (username) {
      try {
        const response = await axios.post("http://localhost:3000/auth/check_username", { username });
        setUsernameAvailable(response.data.available);
      } catch (error) {
        console.error("Error checking username availability:", error);
      }
    }
  }, 300);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });

    if (name === "username") {
      checkUsernameAvailability(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate() && usernameAvailable) {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("username", values.username);
      formData.append("password", values.password);
      formData.append("email", values.email);
      formData.append("contact", values.contact);
      formData.append("image", values.image);
      formData.append("medical", values.medical);
      formData.append("dob", values.dob);
      formData.append("gender", values.gender);
      formData.append("packageID", values.packageID);
      formData.append("categoryID", values.categoryID);

      axios.post("http://localhost:3000/auth/add_member", formData)
        .then((result) => {
          if (result.data.Status) {
            navigate("/dashboard/member");
          } else {
            alert(result.data.Error);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="grid grid-flow-row auto-rows-max space-y-4">
      <h2 className="flex justify-left font-bold text-lg pb-6">Register a Member!</h2>
      <div className="w-full max-w-">
        <form onSubmit={handleSubmit} className="relative overflow-x-auto bg-neutral-700 shadow-md rounded px-8 pt-10 pb-5 mb-4">
          <div className="grid grid-cols-2 gap-10">
            <div className="col-span-1 space-y-2">
              <label className="flex justify-left" htmlFor="Name">Name</label>
              <input
                type="text"
                name="name"
                autoComplete="off"
                placeholder="Enter Name"
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {errors.name && <p className="text-left px-3 text-red-500 text-xs">{errors.name}</p>}

              <label className="flex justify-left" htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                autoComplete="off"
                placeholder="Enter Username"
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {errors.username && <p className="text-left px-3 text-red-500 text-xs">{errors.username}</p>}
              {!usernameAvailable && <p className="text-left text-red-500 text-xs px-3">Username is not available</p>}

              <label className="flex justify-left" htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                autoComplete="off"
                placeholder="Enter Password"
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {errors.password && <p className="text-left px-3 text-red-500 text-xs">{errors.password}</p>}

              <label className="flex justify-left" htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                autoComplete="off"
                placeholder="Enter Email"
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {errors.email && <p className="text-left px-3 text-red-500 text-xs">{errors.email}</p>}

              <label className="flex justify-left" htmlFor="contact">Contact</label>
              <input
                type="tel"
                name="contact"
                autoComplete="off"
                placeholder="Enter Contact Number"
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {errors.contact && <p className="text-left px-3 text-red-500 text-xs">{errors.contact}</p>}

              <label className="flex justify-left" htmlFor="image">Image</label>
              <input
                type="file"
                name="image"
                placeholder="Upload Image"
                onChange={(e) => setValues({ ...values, image: e.target.files[0] })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="col-span-1 space-y-2.5">
              <label className="flex justify-left" htmlFor="medical">Medical conditions</label>
              <input
                type="text"
                name="medical"
                autoComplete="off"
                placeholder="Enter if there any medical conditions"
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full h-28 py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />

              <label className="flex justify-left" htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                name="dob"
                autoComplete="off"
                placeholder="Enter Date of Birth"
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />

              <label className="flex justify-left" htmlFor="gender">Gender</label>
              <select
                name="gender"
                id="gender"
                onChange={handleChange}
                className="block w-full px-3 py-2 mt-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:outline-none"
              >
                <option>Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Others</option>
              </select>
              {errors.gender && <p className="text-left px-3 text-red-500 text-xs">{errors.gender}</p>}

              <label className="flex justify-left" htmlFor="package">Workout Package</label>
              <select
                name="packageID"
                id="package"
                onChange={handleChange}
                className="block w-full px-3 py-2 mt-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:outline-none"
              >
                <option>Select Package</option>
                {Package.map((p) => {
                  return <option value={p.packageID}>{p.packageName}</option>;
                })}
              </select>
              {errors.packageID && <p className="text-left px-3 text-red-500 text-xs">{errors.packageID}</p>}

              <label className="flex justify-left" htmlFor="category">Workout Category</label>
              <select
                name="categoryID"
                id="category"
                onChange={handleChange}
                className="block w-full px-3 py-2 mt-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:outline-none"
              >
                <option>Select Category</option>
                {category.map((c) => (
                  <option key={c.categoryID} value={c.categoryID}>{c.categoryName} - {c.description}</option>
                ))}
              </select>
              {errors.categoryID && <p className="text-left px-3 text-red-500 text-xs">{errors.categoryID}</p>}

              <br />
              <div className="flex space-x-2">
                <button type="submit" className="flex-1 focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                  Register
                </button>

                <button type="button" onClick={() => navigate("/dashboard/member")} className="flex-1 focus:outline-none text-black bg-white hover:bg-neutral-400 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-900">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMember;
