import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {

  const [name,setName] = useState()
  const [email,setEmail] = useState()
  const [bloodgroup,setBloodGroup] = useState()
  const [password,setPassword] = useState()
  const [phoneNo,setPhoneNumber] = useState()
  const [location,setLocation] = useState()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post('http://localhost:3001/register', {name,email,bloodgroup,password,phoneNo,location})
    .then(result => {console.log(result)
      // navigate('/home')
      setTimeout(() => {
        navigate('/home'); // Redirect to a new page after 5 seconds
      }, 1000);
    })
    .catch(err => console.log(err))
  }

  return (
    <>
  <link
    href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
    rel="stylesheet"
    id="bootstrap-css"
  />
  {/*---- Include the above in your HEAD tag --------*/}
  <link
    rel="stylesheet"
    href="https://use.fontawesome.com/releases/v5.0.8/css/all.css"
  />
  <br />
  <br />
  <br />
  <div className="container" style={{ maxWidth: 500 }}>
    
    <div className="card bg-dark text-white">
      <article className="card-body mx-auto" style={{ maxWidth: 400 }}>
        <h4 className="card-title mt-3 text-center">Create Account</h4>
        <p className="text-center">Welcome to LifeDrop</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                {" "}
                <i className="fa fa-user" />{" "}
              </span>
            </div>
            <input
              name=""
              className="form-control"
              placeholder="Full name"
              type="text"
              onChange={(e) => setName(e.target.value)}
            />
          </div>{" "}
          {/* form-group// */}
          <div className="form-group input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                {" "}
                <i className="fa fa-heartbeat" />{" "}
              </span>
            </div>
            <select className="form-control" onChange={(e) => setBloodGroup(e.target.value)}>
              <option selected=""> Select Blood Type</option>
              {/* <option>A</option> */}
              <option>A+</option>
              <option>A-</option>
              {/* <option>B</option> */}
              <option>B+</option>
              <option>B-</option>
              <option>O+</option>
              <option>O-</option>
              <option>AB+</option>
              <option>AB-</option>
            </select>
          </div>{" "}
          {/* form-group// */}
          <div className="form-group input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                {" "}
                <i className="fa fa-envelope" />{" "}
              </span>
            </div>
            <input
              name=""
              className="form-control"
              placeholder="Email address"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>{" "}
          {/* form-group// */}
          <div className="form-group input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                {" "}
                <i className="fa fa-phone" />{" "}
              </span>
            </div>
            <input
              name=""
              className="form-control"
              placeholder="Phone number"
              type="text"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>{" "}
          
          {/* form-group// */}
          <div className="form-group input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                {" "}
                <i className="fa fa-home" />{" "}
              </span>
            </div>
            <input
              name=""
              className="form-control"
              placeholder="Location"
              type="text"
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>{" "}
          
          {/* form-group end.// */}
          <div className="form-group input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                {" "}
                <i className="fa fa-lock" />{" "}
              </span>
            </div>
            <input
              className="form-control"
              placeholder="Create password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>{" "}
          {/* form-group// */}
          {/* <div className="form-group input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                {" "}
                <i className="fa fa-lock" />{" "}
              </span>
            </div>
            <input
              className="form-control"
              placeholder="Repeat password"
              type="password"
            />
          </div>{" "} */}
          {/* form-group// */}
          <div className="form-group">
            <button type="submit" className="btn btn-primary btn-block">
              {" "}
              Create Account
            </button>
          </div>{" "}
          {/* form-group// */}
          <p className="text-center">
            Have an account? <Link to="/login" href="">Log In</Link>{" "}
          </p>
        </form>
      </article>
    </div>{" "}
    {/* card.// */}
  </div>
  {/*container end.//*/}
  <br />
  <br />
  
</>
  )
}

export default SignUp
