import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const cardStyles = `preserve-3d relative h-full w-full duration-500`;

const frontStyles = {
  card: `backface-hidden absolute h-full w-full space-y-4     bg-neutral-600 px-6 py-12 shadow-xl`,
  date: `inline-block rounded-2xl border border-gray-100 px-2 py-1 text-xs font-medium text-gray-100`,
};

const backStyles = {
  card: `backface-hidden absolute h-full w-full space-y-4 overflow-hidden bg-cover px-6 py-12 shadow-xl`,
  date: `inline-block rounded-2xl border border-white px-2 py-1 text-xs font-medium text-white`,
};

const linkStyles = `inline-block bg-red px-4 py-2 text-xs font-bold uppercase text-white`;

function Cards() {

  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/mem/announcements')
      .then(response => {
        if (response.data.status) {
          setAnnouncements(response.data.announcements);
        } else {
          console.error("Error fetching announcements");
        }
      })
      .catch(error => {
        console.error("There was an error fetching the announcements!", error);
      });
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) {
      return '-';
    }
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-CA', options);
  };



  return (
    <div className="grid gap-10 xl:grid-cols-2 3xl:grid-cols-3">
      {/* 01 */}
      {announcements.slice(0, 3).map((announcement) => (
      <div className="perspective group h-72">
        <div className={`${cardStyles} group-hover:rotate-y-180`}>
          {/* Front */}
          <div className={frontStyles.card}>
            <p className={frontStyles.date}>{formatDate(announcement.AnnounceDate)}</p>
            <h4 className="font-bold">{announcement.announcement}</h4>
            <p class='text-xs'>on the date: {formatDate(announcement.applydate)}</p>
            <p className="text-sm font-medium text-gray-300">
            {announcement.AnnounceDescription}
            </p>
            <Link to="/" className={linkStyles}>
              See more &rarr;
            </Link>
          </div>
          {/* Back */}
          <div
            className={`${backStyles.card} rotate-y-180 bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('./images/blog/img2.webp')]`}
          >
            <p className={backStyles.date}>{formatDate(announcement.AnnounceDate)}</p>
            <h4 className="font-bold text-white">{announcement.announcement}</h4>
            <p class='text-xs'>on the date: {formatDate(announcement.applydate)}</p>
            <p className="text-sm font-medium text-white">
            {announcement.AnnounceDescription}
            </p>
            <Link to="/member/update" className={linkStyles}>
              see more &rarr;
            </Link>
          </div>
        </div>
      </div>
))}


    </div>
  );
}

export default Cards;
