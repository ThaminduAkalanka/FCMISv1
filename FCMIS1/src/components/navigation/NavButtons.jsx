import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaRegUser, FaPlus } from "react-icons/fa6";
import axios from "axios";

const btnStyles = `hover:text-red text-white transition-colors duration-300 focus`;

function NavButtons({ onToggleNav}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.get('http://localhost:3000/mem/logout')
        .then(response => {
            if (response.data.Status) {
                localStorage.removeItem('token'); // Clear the token from localStorage
                navigate('/memberlogin');
            }
        })
        .catch(err => console.log(err));
};

  return (
    <div className="flex items-center justify-between gap-7">
      <button className={`3xl:hidden ${btnStyles}`} onClick={onToggleNav}>
        <FaBars className="h-6 w-6" />
      </button>
      <Link to="/member/about" className={btnStyles}>
        <FaRegUser className="h-6 w-6" />
      </Link>

      <div className="focus hidden rounded-sm border-2 border-solid border-gray-350 p-1.5 lg:block">
        <button onClick={handleLogout}
          className="mr-2 flex items-center justify-between gap-2 text-sm font-bold uppercase text-white outline-none"
        >
          <FaPlus className="h-8 w-8 rounded-sm bg-red p-2 text-white transition-transform duration-1000 hover:rotate-[360deg]" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default NavButtons;
