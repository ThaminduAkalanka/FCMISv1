import React, { useState } from 'react'

const login = () => {
    const [values, setvalues] = useState(
        {
            username:'',
            password:'',
        }
    )
  return (
    <div class='flex justify-left items-center h-screen p-10'>
        <div>
            <h2 class='flex justify-left font-bold text-lg pb-6' >
                Member Login
            </h2>
            <form class='p-1'>
                <div class='space-y-4'>
                <div class='space-y-3'>
                    <label class='flex justify-left' htmlFor="username">Username</label>
                    <input type="text" name='username' autoComplete='off' placeholder='Enter Username'
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>
                <div class='space-y-3'>
                    <label class='flex justify-left' htmlFor="password">Password</label>
                    <input type="password" name='password' placeholder='Enter Password'
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>
                <div class='flex grid gap-4 grid-cols-2 '>
                    <div>
                    <input class='h-3 w-3' type='checkbox' name="tick" id="tick"/>
                    <label class='text-xs' htmlFor="remember">Remember me</label>
                    </div>
                    <div>
                    <a class="decoration-2 hover:underline text-xs" href="#">
                    Forgot Password
                    </a>
                    </div>
                </div>
                <button type="button" class="flex-1 w-full focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                    Submit</button>
                <div>
                    <a class="decoration-2 hover:underline text-xs" href="#">
                    Register Now!
                    </a></div>
                </div>
            </form>
        </div>
    </div>
  )
}

export default login