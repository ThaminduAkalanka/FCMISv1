import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddSchedule = () => {
    const [values, setValues] = useState({
        categoryID: '',
        name: '',
        level: '',
        scheduleDetail: '',
    });
    const [category, setCategory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios
          .get("http://localhost:3000/train/category")
          .then((result) => {
            if (result.data.Status) {
              setCategory(result.data.Result);
            } else {
              alert(result.data.Error);
            }
          })
          .catch((err) =>
            console.log("There was an error fetching the categories!", err)
          );
      }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3000/train/add_schedule', values)
            .then(result => {
                if (result.data.Status) {
                    navigate('/trainerDashboard/manageschedule');
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div className='grid grid-flow-row auto-rows-max space-y-4'>
            <h2 className='flex justify-left font-bold text-lg pb-6'>
                Add Schedule
            </h2>
            <div className='w-full max-w-4xl'>
                <form onSubmit={handleSubmit} className='relative overflow-x-auto bg-neutral-600 shadow-md rounded px-8 pt-6 pb-4 mb-4'>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <div className='space-y-3'>
                                <label className='flex justify-left' htmlFor="categoryID">Category</label>
                                <select
                                    value={values.categoryID}
                                    onChange={(e) => setValues({ ...values, categoryID: e.target.value })}
                                    className="block w-full px-3 py-2 mt-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:outline-none"
                                >
                                    <option>Select Category</option>
                                    {category.map((c) => (
                                        <option key={c.categoryID} value={c.categoryID}>
                                            {c.categoryName} - {c.description}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <br />
                            <div className='space-y-3'>
                                <label className='flex justify-left' htmlFor="name">Schedule Name</label>
                                <input 
                                    type="text" 
                                    name='name' 
                                    autoComplete='off' 
                                    placeholder='Enter Name'
                                    onChange={(e) => setValues({ ...values, name: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                />
                            </div>
                            <br />
                            <div className='space-y-3'>
                                <label className='flex justify-left' htmlFor="level">Level</label>
                                <select
                                    value={values.level}
                                    onChange={(e) => setValues({ ...values, level: e.target.value })}
                                    className="block w-full px-3 py-2 mt-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:outline-none"
                                >
                                    <option value="">Select Level</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                        </div>
                        <div >
                            <div className='space-y-3'>
                                <label className='flex justify-left' htmlFor="scheduleDetail">Schedule Details</label>
                                <textarea 
                                    name='scheduleDetail' 
                                    autoComplete='off' 
                                    placeholder='Enter Details'
                                    onChange={(e) => setValues({ ...values, scheduleDetail: e.target.value })}
                                    className="shadow appearance-none border rounded w-full h-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                    rows="11"
                                />
                            </div>

                            <br />
                    <div className="flex space-x-2">
                        <button type="submit" className="flex-1 focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                            Add
                        </button>
                        <button type="button" onClick={() => navigate('/trainerDashboard/manageschedule')} className="flex-1 focus:outline-none text-black bg-white hover:bg-neutral-400 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-900">
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

export default AddSchedule;
