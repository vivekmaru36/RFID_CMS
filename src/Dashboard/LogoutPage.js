import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    
    // localStorage.removeItem('rfid');

    // Redirect to the initial landing page 
    navigate('/'); 
  }, [navigate]);

  return (
    <div>
      {/* Render a gif for animation */}
      <p>Logging out...</p>
    </div>
  );
};

export default LogoutPage;
