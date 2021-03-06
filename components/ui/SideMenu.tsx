
import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined, DashboardOutlined } from '@mui/icons-material';
import { useContext, useState } from "react";
import { UiContext, AuthContext } from "../../context";
import { useRouter } from "next/router";


export const SideMenu = () => {

    const { isMenuOpen, toogleSideMenu } = useContext( UiContext );
    const { isLoggedIn, user, logout } = useContext(AuthContext);
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState('');


    const onSearchTerm = () => {
        if(searchTerm.trim().length === 0) return;
        
        navigaTo(`/search/${ searchTerm }`);

    }

    const navigaTo = ( url: string ) => {

        toogleSideMenu();
        router.push( url );
        
    }

  return (
    <Drawer
        open={ isMenuOpen }
        onClose = { toogleSideMenu }
        anchor='right'
        sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
    >
        <Box sx={{ width: 250, paddingTop: 5 }}>
    
            <List>
                <ListItem>
                    <Input
                        autoFocus
                        value={ searchTerm }
                        onChange={ e => setSearchTerm( e.target.value)}
                        onKeyPress={ (e) => e.key === 'Enter' ? onSearchTerm() : null }
                        type='text'
                        placeholder="Buscar..."
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick = { onSearchTerm }
                                >
                                 <SearchOutlined />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </ListItem>
                {
                    isLoggedIn && (
                        <>
                            <ListItem button>
                                <ListItemIcon>
                                    <AccountCircleOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Perfil'} />
                                </ListItem>
                
                                <ListItem button onClick={() => navigaTo('/orders/history')}>
                                    <ListItemIcon>
                                        <ConfirmationNumberOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Mis Ordenes'} />
                            </ListItem>
                        </>
                    )
                }

                <ListItem button sx={{ display: { xs: '', sm: 'none' } }} onClick= { () => navigaTo('/category/men')  }>
                    <ListItemIcon>
                        <MaleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Hombres'} />
                </ListItem>

                <ListItem button sx={{ display: { xs: '', sm: 'none' } }} onClick= { () => navigaTo('/category/women')  }>
                    <ListItemIcon>
                        <FemaleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Mujeres'} />
                </ListItem>

                <ListItem button sx={{ display: { xs: '', sm: 'none' } }} onClick= { () => navigaTo('/category/kid')  }>
                    <ListItemIcon>
                        <EscalatorWarningOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Ni??os'} />
                </ListItem>

                {
                    isLoggedIn 
                    ? (
                        <ListItem button onClick={logout}>
                            <ListItemIcon>
                                <LoginOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Salir'} />
                        </ListItem>
                    ) : (
                        <ListItem 
                            button
                            onClick={ () => navigaTo(`/auth/login?p=${ router.asPath  }`) }
                            >
                            <ListItemIcon>
                                <VpnKeyOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Ingresar'} />
                        </ListItem>          
                    )
                }

                {/* Admin */}
                {
                    user?.role === 'admin' && (
                        <>
                        <Divider />
                        <ListSubheader>Admin Panel</ListSubheader>

                        <ListItem 
                            button
                            onClick={ () => navigaTo('/admin/') }
                            >
                            <ListItemIcon>
                                <DashboardOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Dashboard'} />
                        </ListItem>    
                        <ListItem 
                            button
                            onClick={ () => navigaTo('/admin/products') }
                            >
                            <ListItemIcon>
                                <CategoryOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Productos'} />
                        </ListItem>
                        <ListItem 
                            button
                            onClick={ () => navigaTo('/admin/orders') }
                            >
                            <ListItemIcon>
                                <ConfirmationNumberOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Ordenes'} />
                        </ListItem>

                        <ListItem 
                            button 
                            onClick={ () => navigaTo('/admin/users') }
                        >
                            <ListItemIcon>
                                <AdminPanelSettings/>
                            </ListItemIcon>
                            <ListItemText primary={'Usuarios'} />
                        </ListItem>
                        </>
                    )
                }
            </List>
        </Box>
    </Drawer>
  )
}