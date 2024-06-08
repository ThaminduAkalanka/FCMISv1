import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SecondaryHeading from "../headings/SecondaryHeading";
import PrimaryHeading from "../headings/PrimaryHeading";
import PrimaryButton from "../buttons/PrimaryButton";


function Hero() {
  const [member, setMember] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found, please log in.');
            return;
        }

        axios.get('http://localhost:3000/mem/memberprofile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.data.Status) {
                setMember(response.data.member.name);
            } else {
                setError(response.data.Error);
            }
        })
        .catch(err => setError('An error occurred while fetching the profile data.'));
    }, []);

  return (
    <section className="relative z-[2] mt-[-93px] flex h-[110dvh] items-center bg-[url('./images/hero/bg-hero.webp')] bg-cover bg-[20%] px-20 text-center xl:text-left">
      <div className="3xl:before:clip-path-hero 3xl:after:clip-path-hero container relative ml-10 flex h-full items-center justify-end xsm:ml-auto 3xl:before:absolute 3xl:before:bottom-0 3xl:before:right-[270px] 3xl:before:h-[60%] 3xl:before:w-[450px] 3xl:before:animate-pulse 3xl:before:bg-[linear-gradient(rgba(255,3,54,1),rgba(255,3,54,0.3))] 3xl:after:absolute 3xl:after:bottom-0 3xl:after:right-[100px] 3xl:after:h-[75%] 3xl:after:w-[500px] 3xl:after:animate-pulse 3xl:after:bg-[linear-gradient(rgba(255,3,54,1),rgba(255,3,54,0.3))]">
        <div className="relative z-10 grid xl:grid-cols-[1fr,250px]">
          <div className="space-y-5 xl:justify-self-end">
            <SecondaryHeading textColor="black" bgColor="white">
              Hi, {member}
            </SecondaryHeading>

            <PrimaryHeading />

            <PrimaryButton to="/member/schedule">View Schedule</PrimaryButton>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
