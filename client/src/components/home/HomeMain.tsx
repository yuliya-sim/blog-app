import { Grid, Typography } from "@mui/material";
import BlogCard from "./blog/BlogCard";


export function HomeMain({ data, classes }: any) {
    return (
        <main className={classes.layout}>
            <div className={classes.mainContent}>
                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                    Stay curious.
                </Typography>
                <Typography variant="h6" align="center" color="textSecondary" component="p">
                    Discover stories, thinking, and expertise from writers on any topic.
                </Typography>
            </div>


            {data["results"] && data["results"].length > 0 ? (
                <Grid spacing={10} alignItems="center" >
                    {data["results"]?.map((blog: any) => (
                        <BlogCard key={blog.id} props={blog} />

                    ))}
                </Grid>
            ) : (
                <></>
            )}
        </main>
    )

}
