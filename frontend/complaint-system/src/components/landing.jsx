import { useRef , useState} from "react";
import { useNavigate } from "react-router-dom";



function Landing() {
  const navigate = useNavigate();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const[role,setRole]=useState("student");

  async function signUp() {
    const response = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      }),
    });

    const data = await response.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate(`/dashboard/${role}`);
    } else {
      const mess = data.message;
      alert(mess);
      usernameRef.current.value = "";
      passwordRef.current.value = "";
    }
  }

  async function login() {
    const response = await fetch(`http://localhost:3000/signin/${role}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      }),
    });

    const data = await response.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate(`/dashboard/${role}`);
    } else {
      const mess = data.message;
      alert(mess);
      usernameRef.current.value = "";
      passwordRef.current.value = "";
    }
  }

  return (
    <>
      <div className="container">
        <div className="navbar">
          <ul>
<li
  className={role === "student" ? "blue" : ""}
  onClick={() => setRole("student")}
>
  Student
</li>

<li
  className={role === "admin" ? "blue" : ""}
  onClick={() => setRole("admin")}
>
  Warden
</li>

          </ul>
        </div>
        <div>
          <ul>
            <li>
              <input
                ref={usernameRef}
                id="username"
                type="text"
                placeholder="username"
              />
            </li>
            <li>
              <input
                ref={passwordRef}
                id="password"
                type="password"
                placeholder="password"
              />
            </li>
            <li>
              <button onClick={login}>Login</button>
            </li>
            <li>
              <button>Forget Passowrd?</button>
            </li>
            <li>Don't have an account ? </li>
            <li>
              <button onClick={signUp}>Sign up</button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
export default Landing;