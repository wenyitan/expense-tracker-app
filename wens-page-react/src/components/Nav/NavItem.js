import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';

function NavItem({item}) {
    return (
        <>
            <Button sx={{width: "180px", height: "60px"}} component={RouterLink} to={item.url} color="inherit"> 
                <strong>{item.title}</strong>
            </Button>
        </>
    )
}

export default NavItem;