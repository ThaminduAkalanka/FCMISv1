import React, {useEffect, useState} from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";

const addTrainer = () => {

const [values, setvalues] = useState({
    name: '',
    username: '',
    password:'',
    contact: '',
    registerDate:'',
    image: ''
}) 
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState([])

    useEffect(() =>{
      axios.get('http://localhost:3000/auth/trainer')
      .then(result =>{
        if (result.data.Status){
          setTrainer(result.data.Result);
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
        formData.append('contact', values.contact);
        formData.append('image', values.image);

        
        axios.post('http://localhost:3000/auth/add_trainer', formData)
            .then(result => {
                if (result.data.Status) {
                    navigate('/dashboard/trainer')
                } else {
                    alert(result.data.Error)
                }
            })
            .catch(err => console.log(err))
    }

  return (
    <div className="grid grid-flow-row auto-rows-max space-y-4">
      <h2 className="flex justify-left font-bold text-lg pb-6">
        Add a Trainer
      </h2>
      <div className="w-full max-w-">
        <form
          onSubmit={handleSubmit} className="relative overflow-x-auto bg-neutral-600 shadow-md rounded px-8 pt-6 pb-5 mb-4" //bg-neutral-600 shadow-md rounded px-8 pt-3 pb-5 mb-4
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


              
            </div>


            <div className="col-span-1 space-y-2">
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
                className="shadow appearance-none border rounded w-full h-32 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <br></br>
              <br></br>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                  Add
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

export default addTrainer;
