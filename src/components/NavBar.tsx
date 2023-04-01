import * as React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import CellTowerIcon from '@mui/icons-material/CellTower';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import RateReviewIcon from '@mui/icons-material/RateReview';
import "./NavBar.css";

interface NavBarProps {
  isLoggedIn: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ isLoggedIn }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.ownerDocument.body.scrollTop = 0;
    }
  }, []);

  if (!isLoggedIn) {
    return <Box ref={ref} />;
  }

  return (
<Box sx={{ pb: 7 }} ref={ref}>
  <Paper className="navbar" >
      <Link className="nav-link" to="/newNote">
        <RateReviewIcon/>
      </Link>
      <Link className="nav-link" to="/feed">
        <DynamicFeedIcon />
      </Link>
      <Link  className="nav-link" to="/relays">
        <CellTowerIcon />
      </Link>
      <Link  className="nav-link" to="/profile">
     <AccountCircleIcon />
      </Link>
  </Paper>
</Box>
  );
};

export default NavBar;