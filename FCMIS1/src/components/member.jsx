import axios from 'axios'
import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'

const member = () => {
  return (
    <div class="grid grid-flow-row auto-rows-max space-y-4">
      <div>
        <h3>Members</h3>
      </div>
      <Link
        to="/dashboard/add_member"
        class="flex-1 w-40 focus:outline-none text-black bg-white hover:bg-neutral-400 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
      >
        Add Member
      </Link>
    </div>
  );
};

export default member;
