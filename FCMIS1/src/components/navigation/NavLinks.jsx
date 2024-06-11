import { Link } from "react-router-dom";

const linkStyles = "hover:text-red focus:text-red focus";
// ring-offset-gray-600

function NavLinks({ onToggleNav, styles }) {
  return (
    <ul className={styles}>
      <li>
        <Link to="/member" className={linkStyles} onClick={onToggleNav}>
          Home
        </Link>
      </li>
      <li>
        <Link to="/member/memberPackage" className={linkStyles} onClick={onToggleNav}>
          Package
        </Link>
      </li>

      <li>
        <Link to="/member/schedule" className={linkStyles} onClick={onToggleNav}>
          Schedule
        </Link>
      </li>

      <li>
        <Link to="/member/classes" className={linkStyles} onClick={onToggleNav}>
          Progress
        </Link>
      </li>
      <li>
        <Link to="/member/contact" className={linkStyles} onClick={onToggleNav}>
          Attendance
        </Link>
      </li>
      <li>
        <Link to="/member/update" className={linkStyles} onClick={onToggleNav}>
          Annoucments
        </Link>
      </li>
    </ul>
  );
}

export default NavLinks;
