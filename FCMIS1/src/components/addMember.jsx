import React, {useEffect, useState} from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";

const addMember = () => {

const [values, setvalues] = useState({
    name: '',
    username: '',
    password:'',
    email:'',
    contact: '',
    image: '',
    medical: '',
    dob:'',
    gender:'',
    packageID: '',
    personal:'',
    registerDate:''
}) 
  const navigate = useNavigate();
  const [Package, setPackage] = useState([])

    useEffect(() =>{
      axios.get('http://localhost:3000/auth/package')
      .then(result =>{
        if (result.data.Status){
          setPackage(result.data.Result);
        }else{
          alert(result.data.Error)
        }
      }).catch(err => console.log(err))
    },[]) ;/*there are 3 types of use effect*/

    const handleSubmit = (event) => {
        event.preventDefault()
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('username', values.username);
        formData.append('password', values.password);
        formData.append('email', values.email);
        formData.append('contact', values.contact);
        formData.append('image', values.image);
        formData.append('medical', values.medical);
        formData.append('dob', values.dob);
        formData.append('gender', values.gender);
        formData.append('packageID', values.packageID);
        formData.append('personal', values.personal);
        
        axios.post('http://localhost:3000/auth/add_member', formData)
            .then(result => {
                if (result.data.Status) {
                    navigate('/dashboard/member')
                } else {
                    alert(result.data.Error)
                }
            })
            .catch(err => console.log(err))
    }

  return (
    <div className="grid grid-flow-row auto-rows-max space-y-4">
      <h2 className="flex justify-left font-bold text-lg pb-6">
        Register a Member!
      </h2>
      <div className="w-full max-w-">
        <form
          onSubmit={handleSubmit} className="relative overflow-x-auto" //bg-neutral-600 shadow-md rounded px-8 pt-3 pb-5 mb-4
        >
          <div className="grid grid-cols-2 gap-10">
            <div className="col-span-1 space-y-2">
              <label className="flex justify-left" htmlFor="Name">
                Name
              </label>
              <input
                type="text"
                name="Name"
                autoComplete="off"
                placeholder="Enter Name"
                onChange={(e) => setvalues({ ...values, name: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />

              <label className="flex justify-left" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                name="username"
                autoComplete="off"
                placeholder="Enter Username"
                onChange={(e) => setvalues({ ...values, username: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />

              <label className="flex justify-left" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                name="password"
                autoComplete="off"
                placeholder="Enter Password"
                onChange={(e) => setvalues({ ...values, password: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />

              <label className="flex justify-left" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                name="email"
                autoComplete="off"
                placeholder="Enter Email"
                onChange={(e) => setvalues({ ...values, email: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <label className="flex justify-left" htmlFor="contact">
                Contact
              </label>
              <input
                type="tel"
                name="contact"
                autoComplete="off"
                placeholder="Enter Contact Number"
                onChange={(e) => setvalues({ ...values, contact: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />

              <label className="flex justify-left" htmlFor="contact">
                Image
              </label>
              <input
                type="file"
                name="image"
                placeholder="Upload Image"
                onChange={(e) => setvalues({ ...values, image: e.target.files[0] })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              
            </div>


            <div className="col-span-1 space-y-2">
              <label className="flex justify-left" htmlFor="medical">
                Medical conditions
              </label>
              <input
                type="text"
                name="medical"
                autoComplete="off"
                placeholder="Enter if there any medical condtions"
                onChange={(e) => setvalues({ ...values, medical: e.target.value })}
                className="shadow appearance-none border rounded w-full h-28 py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />

              <label className="flex justify-left" htmlFor="username1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                autoComplete="off"
                placeholder="Enter Date of Birth"
                onChange={(e) => setvalues({ ...values, dob: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />

              <label className="flex justify-left" htmlFor="gender">
                Gender
              </label>
              <select
                name="gender" id='gender'
                onChange={(e) => setvalues({ ...values, gender: e.target.value })}
                class="block w-full px-3 py-2 mt-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:outline-none"
              >
                <option>Select Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>

              <label className="flex justify-left" htmlFor="package">
                Package
              </label>
              <select
                name="package" id ='package'
                onChange={(e) => setvalues({ ...values, packageID: e.target.value })}
                class="block w-full px-3 py-2 mt-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:outline-none"
              >
                    <option>Select Package</option>
                {Package.map(p =>{
                    return <option value={p.packageID}>{p.packageName}</option>
                })}
              </select>

              <label className="flex justify-left" htmlFor="personal">
                Personal Training
              </label>
              <select
                name="personal" id='personal'
                onChange={(e) => setvalues({ ...values, personal: e.target.value })}
                class="block w-full px-3 py-2 mt-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:outline-none"
              >
                <option>Select if personal training is needed</option>
                <option>Yes</option>
                <option>No</option>
              </select>


              <br></br>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                  Register
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/member")}
                  className="flex-1 focus:outline-none text-black bg-white hover:bg-neutral-400 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-900"
                >
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

export default addMember;