import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import NavItem from './NavItem';
import { navMenuItems } from '../../navMenuItems';

function Navbar() {

  return (
    <Box sx={{ flexGrow: 1 }}>
        <AppBar elevation={5} position="static" sx={{background:""}}>
            <Toolbar>
                {navMenuItems.map((item, key) => {
                    return (
                        <NavItem key={key} item={item} />
                    )
                })}
            </Toolbar>
        </AppBar>
        </Box>
  );
}
export default Navbar;