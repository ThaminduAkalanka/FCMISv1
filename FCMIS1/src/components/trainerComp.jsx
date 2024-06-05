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
            <h3 className="text-xl font-semibold mb-4">Trainers</h3>
            <ul>
                {trainer.map(trainer => (
                    <li key={trainer.trainerID} className="mb-2">{trainer.name}</li>
                ))}
            </ul>
            <Link
        to="/dashboard/trainer"
        class=""
      >
       see more
      </Link>
        </div>
    );
}

export default TrainersComponent;
