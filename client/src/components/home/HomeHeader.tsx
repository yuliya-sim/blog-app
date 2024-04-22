import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import Authentication from "../shared/Autentication";

export function HomeHeader({ classes }: any) {

    return (
        <AppBar position="static" color="default" className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
                <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                    Company name
                </Typography>
                <Button>Our story</Button>
                <Button>Membership</Button>
                <Button>Write</Button>
                <Authentication />
            </Toolbar>
        </AppBar>
    )
}
