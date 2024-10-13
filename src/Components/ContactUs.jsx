import React from 'react';

const Contact = () => {
  return (
    <>
    <link
        href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        rel="stylesheet"
        id="bootstrap-css"
      />
    <div className="container" style={{ marginTop: '40px' }}>
      <h1 className="text-center mb-4">Contact Us</h1>
      <form>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" className="form-control" id="name" placeholder="Your Name" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" className="form-control" id="email" placeholder="Your Email" required />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea className="form-control" id="message" rows="5" placeholder="Your Message" required></textarea>
        </div>
        <button type="submit" className="btn btn-danger btn-block">Send Message</button>
      </form>
      <div className="mt-4">
        <h3>Our Address</h3>
        <p>123 LifeDrop St, Blood City, BC 12345</p>
        <h4>Phone:<p className='lead'> (123) 456-7890</p></h4>
        <h4>Email: support@lifedrop.com</h4>
      </div>
    </div>
    </>
  );
};

export default Contact;

