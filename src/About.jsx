import React from 'react';

const About = () => {
  return (
    <>
    <link
        href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        rel="stylesheet"
        id="bootstrap-css"
      />
    <div className="container" style={{ marginTop: '40px', textAlign: 'center' }}>
      <h1 className="display-4 text-center mb-4">About LifeDrop</h1>
      <p className="lead">
        LifeDrop is a platform dedicated to connecting blood donors with those in need. Our mission is to
        facilitate the process of finding and donating blood, ultimately saving lives and making a difference
        in the community.
      </p>
      <br />
      <h3>Our Vision</h3>
      <p className='lead'>
        To create a world where no one has to suffer due to a lack of blood resources. We aim to ensure that
        blood donations are easily accessible to all who need them.
      </p>
      <br /><br />
      <h3>Our Values</h3>
      <br />
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body text-center">
              <h5 className="card-title">Community</h5>
              <p className="card-text">We believe in the power of community and collaboration.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body text-center">
              <h5 className="card-title">Compassion</h5>
              <p className="card-text">Helping those in need is at the heart of what we do.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body text-center">
              <h5 className="card-title">Integrity</h5>
              <p className="card-text">We operate with transparency and honesty.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default About;
