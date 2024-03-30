import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, Grid } from '@mui/material'; // Grid 추가
import Soccer_image from '../../layouts/img/SoccerImage.jpg';





export default function MultiActionAreaCard() {
  return (
    <Grid container spacing={2}> {/* Grid 컨테이너 추가 */}
      <Grid item xs={2}> {/* Grid 아이템 추가 */}
        <Card sx={{ maxWidth: 600 }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="300"
              image={Soccer_image} // 수정된 부분
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                손흥민
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lizards are a widespread group of squamate reptiles, with over 6,000
                species, ranging across all continents except Antarctica
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="primary">
              Share
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={6}> {/* Grid 아이템 추가 */}
        <Card sx={{ maxWidth: 345 }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="300"
              image={Soccer_image} // 수정된 부분
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                손흥민
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lizards are a widespread group of squamate reptiles, with over 6,000
                species, ranging across all continents except Antarctica
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="primary">
              Share
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
}
