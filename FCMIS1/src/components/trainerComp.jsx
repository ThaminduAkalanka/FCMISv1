import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const TrainersComponent = () => {
    const [trainer, setTrainer] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/auth/trainer')
        .then(result =>{
          if (result.data.Status){
            setTrainer(result.data.Result);
          }else{
            alert(result.data.Error)
          }
        }).catch(err => console.log(err))
    
      },[])

    return (
        <div>
          <h2 class='text-lg font-bold'>Trainers</h2>
       <table class="w-full text-sm text-center rtl:text-right text-black dark:text-gray-400 ">
        <thead class="">
          <tr>
            <th ></th>
            <th ></th>

          </tr>
        </thead>
        <tbody>
          {
            trainer.map((m, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td class="py-4"><img src ={ `http://localhost:3000/images/`+m.image} class='bg-black w-10 h-auto rounded-full'/></td>
                <td>{m.name}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <div class='mt-4'>
      <Link
        to="/dashboard/trainer"
        class=""
      >
       see more
      </Link></div>
        </div>
    );
}

export default TrainersComponent;
