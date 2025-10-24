// import "./Login.scss";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail } from "react-icons/hi";

const ExampleTwo = () => {
  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">
          Connect with cities, regions and countries
        </h1>

        <button className="login-btn google">
          <FcGoogle className="icon" />
          Continue with Google
        </button>

        <button className="login-btn email">
          <HiOutlineMail className="icon" />
          Continue with your Email
        </button>
      </div>
    </div>
  );
};

export default ExampleTwo;
