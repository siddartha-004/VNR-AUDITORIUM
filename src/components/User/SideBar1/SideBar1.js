import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CelebrationIcon from '@mui/icons-material/Celebration';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ChaletIcon from '@mui/icons-material/Chalet';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import {useNavigate} from 'react-router-dom'
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import {useAppStore} from '../../../appStore';
import { BiBold } from 'react-icons/bi';
import { FaBold } from 'react-icons/fa';
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));



const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function SideBar1() {
  const theme = useTheme();
 
  const navigate=useNavigate();
 
  const open=useAppStore((state)=>state.dopen);

 



  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Box height={40}/>
      <Drawer variant="permanent" open={open}>
         <DrawerHeader>
          <IconButton >
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader> 
        <Divider />
      
         
      
        <List>
        <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate("/UserHome")}}>
              <ListItemButton
                sx={{
                  minHeight: 70,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <SpaceDashboardIcon/>
                </ListItemIcon>
                <ListItemText primary="Dashboard" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
             <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate("/UserHome/MyBookings")}}>
              <ListItemButton
                sx={{
                  minHeight: 70,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <CollectionsBookmarkIcon/>
                </ListItemIcon>
                <ListItemText primary="My Bookings" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate("/UserHome/BookAudi")}}>
              <ListItemButton
                sx={{
                  minHeight: 70,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <AddBusinessIcon/>
                </ListItemIcon>
                <ListItemText primary="Book Audi" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate("/UserHome/AllEvents")}}>
              <ListItemButton
                sx={{
                  minHeight: 70,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <EventAvailableIcon/>
                </ListItemIcon>
                <ListItemText primary="All Events" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate("/UserHome/auditoriums")}}>
              <ListItemButton
                sx={{
                  minHeight: 70,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <ChaletIcon/>
                </ListItemIcon>
                <ListItemText primary="Auditoriums" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem> 
            
        
        </List>
      </Drawer>
      
    </Box>
  );
}