import { Link } from "react-router-dom";
import logolong from "../../images/logo/logolong.svg";


function Logo({ size = "w-48", type = "white" }) {
  return (
    <Link to="/member" className="focus inline-block">
      <img
        src={logolong}
        alt="gymate logo"
        className={`h-auto ${size}`}
      />
    </Link>
  );
}

export default Logo;
