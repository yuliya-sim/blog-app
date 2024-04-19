import { Grid, Typography } from "@mui/material";
import classNames from "classnames";
import { footers } from "../../utils/constants";

export function HomeFooter({ classes }: any) {
    return (

        <footer className={classNames(classes.footer, classes.layout)}>
            <Grid container spacing={32} justifyContent="space-evenly">
                {footers.map(footer => (
                    <Grid item xs key={footer.title}>
                        <Typography variant="h6" color="textPrimary" gutterBottom>
                            {footer.title}
                        </Typography>
                        {footer.description.map(item => (
                            <Typography key={item} variant="subtitle1" color="textSecondary">
                                {item}
                            </Typography>
                        ))}
                    </Grid>
                ))}
            </Grid>
        </footer>
    )
}
